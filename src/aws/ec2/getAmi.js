const { asyncDescribeImages } = require("../awsAsyncFunctions");

const getAmi = async () => {
  const params = {
    Filters: [
      {
        Name: "name",
        Values: ["amzn2-ami-hvm-2.0.????????.?-x86_64-gp2"],
      },
      {
        Name: "state",
        Values: ["available"],
      },
    ],
    Owners: ["amazon"],
  };

  const response = await asyncDescribeImages(params);
  return response.Images.map((image) => {
    return {
      imageId: image.ImageId,
      creationDate: new Date(image.CreationDate),
    };
  }).sort((a, b) => {
    const diff = a > b;
    if (a.creationDate > b.creationDate) {
      return -1;
    } else if (a.creationDate < b.creationDate) {
      return 1;
    } else {
      return 0;
    }
  })[0].imageId;
};

module.exports = { getAmi };
