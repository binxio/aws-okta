import { BrowserWindow } from "electron";
import { AssumeRoleWithSAMLCommand, STSClient } from "@aws-sdk/client-sts";
import { getConfig } from "./config"
import { homedir } from "os";
import fs from "fs";
import ini from "ini";

const config = getConfig();

const sts = new STSClient({
    region: config.AWS_REGION
})

interface IAssumableRole {
    name: string;
    value: string;
}

let SAML_RESPONSE: string;

export const startAuthenticationSession = async (window: BrowserWindow) => {
    await window.loadURL(config.OKTA_AWS || "");
    // Check when the user gets redirected to the AWS assume role selection page.
    // If this is the case, we will extract the SAML response and use that to make an API call with the AWS SDK.
    await window.webContents.on('did-navigate', async (event, url) => {
        if (url.includes('/saml')) {
            SAML_RESPONSE = await window.webContents.executeJavaScript(`document.getElementsByName('SAMLResponse')[0].value`)
            const assumableRoles = await getAssumableRoles(window);
            await window.loadFile('./src/role-selection.html');
            window.webContents.send('incoming-roles', assumableRoles);
        }
    })
}

export const processSelectedRole = async (selectedRole: string) => {
    const assumedRoleCredentials = await getAssumedRoleCredentials(SAML_RESPONSE, selectedRole);
    writeFile(assumedRoleCredentials);
}

const writeFile = (credentials: any) => {
    const filePath = homedir + '/.aws/credentials';
    const file = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
    const configFile = ini.parse(file);
    configFile.okta = {
        aws_access_key_id: credentials.AccessKeyId,
        aws_secret_access_key: credentials.SecretAccessKey,
        aws_session_token: credentials.SessionToken,
        region: config.AWS_REGION,
        token_expiration: credentials.Expiration?.toISOString(),
    };
    fs.writeFileSync(filePath, ini.stringify(configFile));
}

const getAssumableRoles = async (win: BrowserWindow): Promise<IAssumableRole[]> => {
    return await win.webContents.executeJavaScript(`
        const roles = Array.from(document.getElementsByClassName("saml-role-description"));
        roles.map(role => {
            return {
                name: role.innerText,
                value: role.htmlFor,
            };
        });
    `);
}

const getAssumedRoleCredentials = async (samlResponse: string, role: string) => {
    const assumeRoleCommand = new AssumeRoleWithSAMLCommand({
        PrincipalArn: config.SAML_PROVIDER,
        RoleArn: role,
        SAMLAssertion: samlResponse,
        DurationSeconds: 36000,
    });

    const assumedRole = await sts.send(assumeRoleCommand);

    return assumedRole.Credentials;
}