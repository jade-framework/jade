const inquirer = require("inquirer");

// rl.question("What is you? ", (ans) => {
//   console.log(`You is ${ans}`);
//   rl.close();
// });

// const qn = require("util").promisify(rl.question.bind(rl));

(async () => {
  const prompt = inquirer.createPromptModule();
  try {
    const questions = [
      {
        message: "Hello you are a question?",
        // filter(input, answers) {
        //   console.log(input, answers);
        //   return Promise.resolve(input);
        // },
        name: "Answers",
      },
    ];
    const hi = await prompt(questions);
    console.log("hi", hi);
  } catch (err) {
    console.log(err);
    console.log("closing");
  }
})();

// const getUserInput = async (question) => {};
