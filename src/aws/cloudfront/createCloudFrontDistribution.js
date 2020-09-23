const crypto = require('crypto');
const { asyncCreateCloudFrontDistribution } = require('../awsAsyncFunctions');
const {
  cloudFrontOriginId,
  cloudFrontOriginDomain,
} = require('../../templates/constants');
const { jadeLog, jadeErr } = require('../../util/logger');

const createCloudFrontDistribution = async (bucketName) => {
  const uniqueId = crypto.randomBytes(16).toString('hex');
  const callerReference = `jade-${uniqueId}`;
  const originDomainName = cloudFrontOriginDomain(bucketName);
  const originId = cloudFrontOriginId(bucketName);

  const distParams = {
    DistributionConfig: {
      CallerReference: callerReference,
      Comment: callerReference,
      // DefaultRootObject: 'index.html',
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
        ViewerProtocolPolicy: 'redirect-to-https',
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

  jadeLog('Creating CloudFront distribution...');
  try {
    const response = await asyncCreateCloudFrontDistribution(distParams);
    jadeLog(
      `CloudFront distribution created at ${response.Distribution.DomainName}.`,
    );
    return { ...response, originId };
  } catch (error) {
    jadeErr('Error creating CloudFront distribution', error);
    return false;
  }
};

module.exports = {
  createCloudFrontDistribution,
};
