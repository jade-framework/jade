const fs = require('fs');
const path = require('path');

const { asyncUploadToBucket } = require('./index');

const uploadToBucket = async (fileName, bucketName) => {
  const fileStream = fs.createReadStream(fileName);
  const uploadKeyName = path.basename(fileName);
  fileStream.on('error', function (err) {
    console.log('File Error', err);
  });

  const uploadParams = {
    Bucket: bucketName,
    Key: uploadKeyName,
    Body: fileStream,
    ContentType: 'text/html',
  };

  console.log(`Uploading file ${uploadKeyName} to bucket...`);
  try {
    const response = await asyncUploadToBucket(uploadParams);

    console.log(
      `File ${uploadKeyName} successfully uploaded to bucket ${bucketName}; ETag ${response.ETag}`
    );
  } catch (error) {
    console.log('Error uploading file', error);
  }
};

module.exports = { uploadToBucket };
