/**
 * An AWS Lambda function that logs and returns a message
 */

exports.helloWorld = async (event, context, callback) => {
  console.log('Hello from Lambda!');
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
