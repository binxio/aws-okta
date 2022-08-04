import { app, BrowserWindow } from "electron";
import { AssumeRoleWithSAMLCommand, Credentials, STSClient } from "@aws-sdk/client-sts";
import inquirer from "inquirer";
import { getConfig } from "./config"
import { homedir, platform } from "os";
import fs from "fs";
import ini from "ini";
import os from 'os';

const config = getConfig();

const sts = new STSClient({
    region: config.AWS_REGION
})

interface IAssumableRole {
    name: string;
    value: string;
}

export const startAuthenticationSession = async (window: BrowserWindow) => {
    await window.loadURL(config.OKTA_AWS || "");
    // Check when the user gets redirected to the AWS assume role selection page.
    // If this is the case, we will extract the SAML response and use that to make an API call with the AWS SDK.
    await window.webContents.on('will-redirect', async (event, url) => {
        if (url.includes('/sso/saml')) {
            // if (platform() === "darwin") {
            //     app.hide();
            // } else if (platform() === "win32") {
            //     window.minimize()
            // } else {
            //     window.hide()
            // }
            const samlResponse: string = await window.webContents.executeJavaScript(`document.getElementsByName('SAMLResponse')[0].value`)
            const assumableRoles = await getAssumableRoles(window);

            await window.loadFile('enter path of test.html here')
            window.webContents.send('incoming-roles', assumableRoles)
            // const assumableRoles = await getAssumableRoles(window);
            // const assumedRoleCredentials = await getAssumedRoleCredentials(samlResponse, assumableRoles);
            // writeFile(assumedRoleCredentials);
            // window.close();
        }
    })
}

const writeFile = (credentials: any) => {
    const filePath = homedir + '/.aws/credentials';
    const file = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
    const config = ini.parse(file);
    config.okta = {
        aws_access_key_id: credentials.AccessKeyId,
        aws_secret_access_key: credentials.SecretAccessKey,
        aws_session_token: credentials.SessionToken,
        region: config.AWS_REGION,
        token_expiration: credentials.Expiration?.toISOString(),
    };
    fs.writeFileSync(filePath, ini.stringify(config));
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

const getAssumedRoleCredentials = async (samlResponse: string, roles: IAssumableRole[]): Promise<Credentials | undefined> => {
    const { roleArn } = await inquirer.prompt({
        name: "roleArn",
        message: "Please select the role you wish to assume:",
        choices: roles, // The return value will be the ARN of the role name chosen by the user.
        type: os.platform() == "win32" ? "rawlist" : "list",
        loop: false,
    });

    const assumeRoleCommand = new AssumeRoleWithSAMLCommand({
        PrincipalArn: config.SAML_PROVIDER,
        RoleArn: roleArn,
        SAMLAssertion: samlResponse,
        DurationSeconds: 36000,
    });

    const assumedRole = await sts.send(assumeRoleCommand);

    return assumedRole.Credentials;
}