const { asyncUpdateCloudFrontDistribution } = require('../awsAsyncFunctions');

const disableCloudFrontDistribution = async (id, ETag) => {
  var params = {
    DistributionConfig: {
      /* required */ CallerReference: `${new Date()}` /* required */,
      Comment: 'Deleting CFD' /* required */,
      DefaultCacheBehavior: {
        TargetOriginId: 'STRING_VALUE' /* required */,
        TrustedSigners: {
          /* required */ Enabled: true || false /* required */,
          Quantity: 1 /* required */,
          Items: [
            'STRING_VALUE',
            /* more items */
          ],
        },
        ViewerProtocolPolicy: 'allow-all' /* required */,
        AllowedMethods: {
          Items: [
            /* required */
            'GET',
            /* more items */
          ],
          Quantity: 1 /* required */,
          CachedMethods: {
            Items: [
              /* required */
              'GET',
              /* more items */
            ],
            Quantity: 1 /* required */,
          },
        },
        Compress: true || false,
        DefaultTTL: 0,
        FieldLevelEncryptionId: 'STRING_VALUE',
        ForwardedValues: {
          Cookies: {
            /* required */ Forward: 'none' /* required */,
            WhitelistedNames: {
              Quantity: 0 /* required */,
              Items: [
                'STRING_VALUE',
                /* more items */
              ],
            },
          },
          QueryString: true || false /* required */,
          Headers: {
            Quantity: 0 /* required */,
            Items: [
              'STRING_VALUE',
              /* more items */
            ],
          },
          QueryStringCacheKeys: {
            Quantity: 0 /* required */,
            Items: [
              'STRING_VALUE',
              /* more items */
            ],
          },
        },
        LambdaFunctionAssociations: {
          Quantity: 0 /* required */,
          Items: [
            {
              EventType: 'viewer-request' /* required */,
              LambdaFunctionARN: 'STRING_VALUE' /* required */,
              IncludeBody: true || false,
            },
            /* more items */
          ],
        },
        MaxTTL: 0,
        MinTTL: 0,
        SmoothStreaming: true || false,
      },
      Enabled: true || false /* required */,
      Origins: {
        /* required */
        Items: [
          /* required */
          {
            DomainName: 'STRING_VALUE' /* required */,
            Id: 'STRING_VALUE' /* required */,
            ConnectionAttempts: 0,
            ConnectionTimeout: 0,
            CustomHeaders: {
              Quantity: 1 /* required */,
              Items: [
                {
                  HeaderName: 'STRING_VALUE' /* required */,
                  HeaderValue: 'STRING_VALUE' /* required */,
                },
                /* more items */
              ],
            },
            CustomOriginConfig: {
              HTTPPort: 0 /* required */,
              HTTPSPort: 0 /* required */,
              OriginProtocolPolicy: 'http-only' /* required */,
              OriginKeepaliveTimeout: 0,
              OriginReadTimeout: 0,
              OriginSslProtocols: {
                Items: [
                  /* required */
                  'SSLv3',
                  /* more items */
                ],
                Quantity: 1 /* required */,
              },
            },
            OriginPath: 'STRING_VALUE',
            S3OriginConfig: {
              OriginAccessIdentity: 'STRING_VALUE' /* required */,
            },
          },
          /* more items */
        ],
        Quantity: 1 /* required */,
      },
      Aliases: {
        Quantity: 1 /* required */,
        Items: [
          'STRING_VALUE',
          /* more items */
        ],
      },
      CacheBehaviors: {
        Quantity: 1 /* required */,
        Items: [
          {
            PathPattern: 'STRING_VALUE' /* required */,
            TargetOriginId: 'STRING_VALUE' /* required */,
            TrustedSigners: {
              /* required */ Enabled: true || false /* required */,
              Quantity: 1 /* required */,
              Items: [
                'STRING_VALUE',
                /* more items */
              ],
            },
            ViewerProtocolPolicy: 'allow-all' /* required */,
            AllowedMethods: {
              Items: [
                /* required */
                'GET',
                /* more items */
              ],
              Quantity: 1 /* required */,
              CachedMethods: {
                Items: [
                  /* required */
                  'GET',
                  /* more items */
                ],
                Quantity: 1 /* required */,
              },
            },
            //CachePolicyId: 'STRING_VALUE',
            Compress: true || false,
            DefaultTTL: 1,
            FieldLevelEncryptionId: 'STRING_VALUE',
            ForwardedValues: {
              Cookies: {
                /* required */ Forward: 'none' /* required */,
                WhitelistedNames: {
                  Quantity: 1 /* required */,
                  Items: [
                    'STRING_VALUE',
                    /* more items */
                  ],
                },
              },
              QueryString: true || false /* required */,
              Headers: {
                Quantity: 1 /* required */,
                Items: [
                  'STRING_VALUE',
                  /* more items */
                ],
              },
              QueryStringCacheKeys: {
                Quantity: 1 /* required */,
                Items: [
                  'STRING_VALUE',
                  /* more items */
                ],
              },
            },
            LambdaFunctionAssociations: {
              Quantity: 1 /* required */,
              Items: [
                {
                  EventType: 'viewer-request' /* required */,
                  LambdaFunctionARN: 'STRING_VALUE' /* required */,
                  IncludeBody: true || false,
                },
                /* more items */
              ],
            },
            MaxTTL: 1,
            MinTTL: 1,
            //OriginRequestPolicyId: 'STRING_VALUE',
            SmoothStreaming: true || false,
          },
          /* more items */
        ],
      },
      CustomErrorResponses: {
        Quantity: 1 /* required */,
        Items: [
          {
            ErrorCode: 1 /* required */,
            ErrorCachingMinTTL: 1,
            ResponseCode: 'STRING_VALUE',
            ResponsePagePath: 'STRING_VALUE',
          },
          /* more items */
        ],
      },
      DefaultRootObject: 'STRING_VALUE',
      HttpVersion: 'http1.1',
      IsIPV6Enabled: true || false,
      Logging: {
        Bucket: 'STRING_VALUE' /* required */,
        Enabled: true || false /* required */,
        IncludeCookies: true || false /* required */,
        Prefix: 'STRING_VALUE' /* required */,
      },
      OriginGroups: {
        Quantity: 1 /* required */,
        Items: [
          {
            FailoverCriteria: {
              /* required */
              StatusCodes: {
                /* required */
                Items: [
                  /* required */
                  2,
                  /* more items */
                ],
                Quantity: 1 /* required */,
              },
            },
            Id: 'STRING_VALUE' /* required */,
            Members: {
              /* required */
              Items: [
                /* required */
                {
                  OriginId: 'STRING_VALUE' /* required */,
                },
                /* more items */
              ],
              Quantity: 1 /* required */,
            },
          },
          /* more items */
        ],
      },
      PriceClass: 'PriceClass_All',
      Restrictions: {
        GeoRestriction: {
          /* required */ Quantity: 1 /* required */,
          RestrictionType: 'none' /* required */,
          Items: [
            'STRING_VALUE',
            /* more items */
          ],
        },
      },
      ViewerCertificate: {
        ACMCertificateArn: 'STRING_VALUE',
        Certificate: 'STRING_VALUE',
        CertificateSource: 'cloudfront',
        CloudFrontDefaultCertificate: true || false,
        IAMCertificateId: 'STRING_VALUE',
        MinimumProtocolVersion: 'SSLv3',
        SSLSupportMethod: 'sni-only',
      },
      WebACLId: 'STRING_VALUE',
    },
    Id: id /* required */,
    IfMatch: ETag,
  };

  try {
    let data = await asyncUpdateCloudFrontDistribution(params);
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { disableCloudFrontDistribution };
