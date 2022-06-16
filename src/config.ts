import dotenv from "dotenv";
import { homedir, platform } from "os";
import ini from 'ini';
import fs from 'fs';
import path from 'path';

// let dotenvPath;
// if (platform() === "darwin") {
//     console.log(__dirname)
//     dotenvPath = "/Applications/aws-okta.app/Contents";
// } else if (platform() === "win32") {
//     dotenvPath = `${homedir}\\AppData\\Local\\Programs\\aws-okta`;
// } else if (platform() === "linux") {
//     dotenvPath = "kiwi";
// } else {
//     dotenvPath = undefined;
// }

// dotenv.config({
//     path: dotenvPath
// });



interface IEnvironmentVariables {
    OKTA_AWS: string | undefined;
    AWS_REGION: string | undefined;
    SAML_PROVIDER: string | undefined;
}

interface IConfiguration {
    OKTA_AWS: string;
    AWS_REGION: string;
    SAML_PROVIDER: string;
}

// const getEnvVars = (): IEnvironmentVariables => {
//     return {
//         OKTA_AWS: process.env.OKTA_AWS,
//         AWS_REGION: process.env.AWS_REGION,
//         SAML_PROVIDER: process.env.SAML_PROVIDER,
//     };
// };

const getEnvVariables = () => {
    const environmentPath = path.join(homedir(), '.aws-okta', 'env');
    const config = ini.parse(fs.readFileSync(environmentPath, 'utf-8'))
    return {
        AWS_REGION: config.AWS_REGION,
        SAML_PROVIDER: config.SAML_PROVIDER,
        OKTA_AWS: config.OKTA_AWS,
    }
}

const getSanitizedEnvVars = (config: IEnvironmentVariables): IConfiguration => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as IConfiguration;
};

// const env = getEnvVars();
const secondaryEnv = getEnvVariables();
const config = getSanitizedEnvVars(secondaryEnv);

export default config;
