import dotenv from "dotenv";
import { homedir, platform } from "os";


let dotenvPath;
if (platform() === "darwin") {
    dotenvPath = "/Applications/aws-okta.app/Contents";
} else if (platform() === "win32") {
    dotenvPath = `${homedir}\\AppData\\Local\\Programs\\aws-okta`;
} else if (platform() === "linux") {
    dotenvPath = "kiwi";
} else {
    dotenvPath = undefined;
}

dotenv.config({
    path: dotenvPath
});

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

const getEnvVars = (): IEnvironmentVariables => {
    return {
        OKTA_AWS: process.env.OKTA_AWS,
        AWS_REGION: process.env.AWS_REGION,
        SAML_PROVIDER: process.env.SAML_PROVIDER,
    };
};

const getSanitizedEnvVars = (config: IEnvironmentVariables): IConfiguration => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as IConfiguration;
};

const env = getEnvVars();

const config = getSanitizedEnvVars(env);

export default config;
