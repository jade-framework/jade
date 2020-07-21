const amazonMachineImageId = "ami-04122be15033aa7ec";
const instanceType = "t2.micro";
const hostDirectory = process.cwd();
const keyPairFilename = "jade-key-pair.pem";

module.exports = {
  amazonMachineImageId,
  instanceType,
  hostDirectory,
  keyPairFilename,
};
