import { getEnvVariables, getSanitizedEnvVars } from "../src/config"

describe("test environment configuration", () => {
    test('it should return the set value', () => {
        const variables = getEnvVariables("test/mock-files/env")
        const sanitizedVariables = getSanitizedEnvVars(variables)
        expect(sanitizedVariables.OKTA_AWS).toBe("https://banana.icecream");
    });


    test('it should throw an error when a required key is missing', () => {
        const variables = getEnvVariables("test/mock-files/env-missing-key")
        const sanitizedVariables = () => {
            getSanitizedEnvVars(variables);
        };
        expect(sanitizedVariables).toThrow("Missing key OKTA_AWS in env");
    });


    test('it should throw an error if a required key has no value', () => {
        const variables = getEnvVariables("test/mock-files/env-missing-value")
        const sanitizedVariables = () => {
            getSanitizedEnvVars(variables);
        };

        expect(sanitizedVariables).toThrow("Missing value for key  OKTA_AWS in env");
    });
})
