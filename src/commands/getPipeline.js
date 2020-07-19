const { getPipeline } = require("../aws/");

const params = {
  name: "MyFirstPipeline",
};

console.log(
  getPipeline(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  })
);
