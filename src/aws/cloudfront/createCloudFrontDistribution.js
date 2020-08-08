const uuid = require('uuid');
const { asyncCreateCloudFrontDistribution } = require('../awsAsyncFunctions');
const {
  cloudFrontOriginDomain,
  cloudFrontOriginId,
} = require('../../templates/constants');

const createCloudFrontDistribution = async (bucketName) => {
  const callerReference = 'jade-' + uuid.v4();
  const originDomainName = cloudFrontOriginDomain(bucketName);
  const originId = cloudFrontOriginId(bucketName);

  const distParams = {
    DistributionConfig: {
      CallerReference: callerReference,
      Comment: callerReference,
      DefaultRootObject: 'index.html',
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
            // OriginPath: originPath,
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

  console.log('Creating CloudFront distribution...');
  try {
    const response = await asyncCreateCloudFrontDistribution(distParams);
    console.log(
      `CloudFront distribution created at ${response.Distribution.DomainName}`,
    );
  } catch (error) {
    console.log('Error creating CloudFront distribution', error);
  }
  return originId;
};

module.exports = {
  createCloudFrontDistribution,
};