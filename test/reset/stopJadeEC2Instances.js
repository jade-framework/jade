const { promisify } = require("util");
const EC2 = require("aws-sdk/clients/ec2");
const { getRegion } = require("../../src/util/getRegion");

const apiVersion = "latest";
const region = getRegion();

const ec2 = new EC2({ apiVersion, region });

// promisify ec2 functions
