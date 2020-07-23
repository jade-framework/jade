const retry = require("async-retry");

module.exports = async function retryUntilSuccess(func, ...args) {
  let count;
  await retry(
    async (bail, attempt) => {
      count = attempt;
      const res = await func(...args);
      console.log(res.status, "hi");
      return res;
    },
    {
      onRetry: (err) => console.log(`Attempt ${count} at reconnecting`),
    }
  );
};
