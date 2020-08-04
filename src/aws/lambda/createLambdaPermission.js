const { asyncAddPermission } = require("../awsAsyncFunctions");

// const createLambdaPermission = async (sourceAccount, lambdaArn) => {
//   const params = {
//     Action: "lambda:InvokeFunction",
//     FunctionName: lambdaArn,
//     Principal: "s3.amazonaws.com",
//     SourceAccount: sourceAccount,
//     StatementId: `example-S3-permission`,
//   };

//   try {
//     const response = await asyncAddPermission(params);
//     console.log("Successfully added lambda permission.", response);
//   } catch (error) {
//     console.log("Error adding lambda permission.", error, error.stack);
//   }
// };

const createLambdaPermission = async (params) => {
  try {
    const response = await asyncAddPermission(params);
    console.log("Successfully added lambda permission.", response);
  } catch (error) {
    console.log("Error adding lambda permission.", error, error.stack);
  }
};

module.exports = { createLambdaPermission };
