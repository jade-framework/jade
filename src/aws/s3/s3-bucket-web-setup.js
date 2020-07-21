/**
 * Create an S3 bucket as a static website
 */

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const uuid = require('uuid');

// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Create a random bucket name
const bucketName = `test-${uuid.v4()}`;

// Create params JSON for S3.createBucket
const bucketParams = {
  Bucket: bucketName,
  ACL: 'public-read',
};

// Create params JSON for S3.setBucketWebsite
const staticHostParams = {
  Bucket: bucketName,
  WebsiteConfiguration: {
    ErrorDocument: {
      Key: 'error.html',
    },
    IndexDocument: {
      Suffix: 'index.html',
    },
  },
};

// call S3 to create the bucket
s3.createBucket(bucketParams, function (err, data) {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Bucket URL is ', data.Location);
    // set the new policy on the cewly created bucket
    s3.putBucketWebsite(staticHostParams, function (err, data) {
      if (err) {
        // display error message
        console.log('Error', err);
      } else {
        // update the displayed policy for the selected bucket
        console.log('Success', data);
      }
    });
  }
});
