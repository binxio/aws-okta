# AWS-OKTA

Command line tool for fetching temporary AWS credentials using your Okta credentials.

## Why is this tool made?
This tool is specifically build for an Okta instance with an external identity provider (e.g. Azure AD). 
The tool is designed to be cross-platform and intended to replace the outdated project:
https://github.com/oktadev/okta-aws-cli-assume-role

## Install
Use ```install.sh``` to install the tool

## Usage
Type ```aws-okta``` in your terminal, to obtain new temporary credentials. The credentials will be stored in ```.aws/credentials``` under the header ```okta```.
