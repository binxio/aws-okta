import dotenv from "dotenv";
import {platform} from "os";


let dotenvPath;
if (platform() === "darwin") {
    dotenvPath = "/Applications/aws-okta.app/Contents";
} else if (platform() === "win32") {
    dotenvPath = "banana";
} else if (platform() === "linux") {
    dotenvPath = "kiwi";
} else {
    dotenvPath = undefined;
}

dotenv.config({
    path: dotenvPath
});

interface ENV {
    OKTA_AWS: string | undefined;
    AWS_REGION: string | undefined;
    SAML_PROVIDER: string | undefined;
}

interface Config {
    OKTA_AWS: string;
    AWS_REGION: string;
    SAML_PROVIDER: string;
}

const getEnvVars = (): ENV => {
    return {
        OKTA_AWS: process.env.OKTA_AWS,
        AWS_REGION: process.env.AWS_REGION,
        SAML_PROVIDER: process.env.SAML_PROVIDER,
    };
};

const getSanitizedEnvVars = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as Config;
};

const env = getEnvVars();

const config = getSanitizedEnvVars(env);

export default config;
