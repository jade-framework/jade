#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CdkProjectStack } = require('../lib/cdk-project-stack');

const app = new cdk.App();
new CdkProjectStack(app, 'CdkProjectStack');
