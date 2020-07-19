const aws = require("../aws");

aws.getCallerIdentity({}, (err, data) => {
  console.log(err);
  console.log(data);
});
