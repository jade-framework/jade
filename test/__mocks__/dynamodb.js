jest.mock('aws-sdk/clients/dynamodb', () => {
  return jest.fn().mockImplementation(() => {
    return {};
  });
});
