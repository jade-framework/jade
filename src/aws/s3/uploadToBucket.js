const fs = require('fs');
const path = require('path');

const { asyncUploadToBucket } = require('../awsAsyncFunctions');
const { jadeLog, jadeErr } = require('../../util/logger');

const uploadToBucket = async (fileName, bucketName) => {
  const fileStream = fs.createReadStream(fileName);
  const uploadKeyName = path.basename(fileName);
  fileStream.on('error', function (err) {
    jadeErr('File Error', err);
  });

  const uploadParams = {
    Bucket: bucketName,
    Key: uploadKeyName,
    Body: fileStream,
    ContentType: 'text/html',
  };

  jadeLog(`Uploading file ${uploadKeyName} to bucket...`);
  try {
    const response = await asyncUploadToBucket(uploadParams);

    jadeLog(
      `File ${uploadKeyName} successfully uploaded to bucket ${bucketName}.`,
    );
  } catch (error) {
    jadeErr('Error uploading file', error);
  }
};

module.exports = { uploadToBucket };
