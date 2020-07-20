const CloudFront = require('aws-sdk/clients/cloudfront');
const uuid = require('uuid');

const createCloudfrontDistribution = bucketName => {
  const cloudfront = new CloudFront({ apiVersion: '2019-03-26' });
  const callerReference = 'jade-' + uuid.v4();
  const originDomainName = `${bucketName}.s3.amazonaws.com`;
  const originId = `S3-${bucketName}`; // unique ID of origin within the distribution

  const distParams = {
    DistributionConfig: {
      CallerReference: callerReference,
      Comment: callerReference,
      DefaultCacheBehavior: {
        ForwardedValues: {
          Cookies: {
            Forward: 'none',
            WhitelistedNames: {
              Quantity: 0,
            },
          },
          QueryString: false,
          Headers: {
            Quantity: 0,
          },
          QueryStringCacheKeys: {
            Quantity: 0,
          },
        },
        MinTTL: 0,
        TargetOriginId: originId,
        TrustedSigners: {
          Enabled: false,
          Quantity: 0,
        },
        ViewerProtocolPolicy: 'allow-all',
        AllowedMethods: {
          Items: ['GET', 'HEAD'],
          Quantity: 2,
          CachedMethods: {
            Items: ['GET', 'HEAD'],
            Quantity: 2,
          },
        },
        Compress: false,
        DefaultTTL: 86400,
        LambdaFunctionAssociations: {
          Quantity: 0,
        },
        MaxTTL: 31536000,
        SmoothStreaming: false,
      },
      Enabled: true,
      Origins: {
        Items: [
          {
            DomainName: originDomainName,
            Id: originId,
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginProtocolPolicy: 'match-viewer',
            },
          },
        ],
        Quantity: 1,
      },
    },
  };

  console.log('Creating Cloudfront distribution...');
  cloudfront.createDistribution(distParams, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log('Successfully created Cloudfront distribution');
  });
};

module.exports = {
  createCloudfrontDistribution,
};
