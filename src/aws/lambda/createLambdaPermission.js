const { asyncAddPermission } = require("../awsAsyncFunctions");

const createLambdaPermission = async (params) => {
  try {
    const response = await asyncAddPermission(params);
    console.log("Successfully added lambda permission.", response);
  } catch (error) {
    console.log("Error adding lambda permission.", error, error.stack);
  }
};

module.exports = { createLambdaPermission };
