# AWS-OKTA
Command line tool for fetching temporary AWS credentials through Okta.

## Why is this tool made?
This tool was specifically built for Okta instances that rely on an external identity provider (e.g. Azure AD) for single sign-on (SSO) authentication, but it can also be used for any type of authentication through Okta.

A tool maintained by Okta developers ([okta-aws-cli-assume-role](https://github.com/oktadev/okta-aws-cli-assume-role)) exists, but currently does not support Okta SSO authentication, and requires external JFX libraries that are difficult to manage across different operating systems. 

`aws-okta` is designed to be a simple cross-platform alternative, and supports SSO authentication flows.

## Install
Download the required binary release and install on your system. 

NOTE: currently, codesigning has not yet been implemented. As a result, Windows and MacOS users will need to manually enable the use of the CLI.

### Add `.aws-okta/env` file
Add the `.aws-okta` directory in your home directory. Create a file named `env` in this directory, and fill it with the contents of the `env.example` file in this repository. Replace the values of the environment variables according to your Okta and AWS configuration.

### Add aws-okta to path
**MacOs:**

Append the below to your `~/.zsh_profile` or `~/.zshrc` file and restart your terminal.

```export PATH=/Applications/aws-okta.app/Contents/MacOS:$PATH```

## Usage
Type ```aws-okta``` in your terminal, to obtain new temporary credentials. The credentials will be stored in ```.aws/credentials``` under the header ```okta```.
