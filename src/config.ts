import { homedir } from "os";
import ini from 'ini';
import fs from 'fs';
import path from 'path';

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

const env = getEnvVariables();
const config = getSanitizedEnvVars(env);

export default config;
