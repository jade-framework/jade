const { exists, getJadePath } = require('../util/fileUtils');
const { addAppQuestions } = require('../util/questions');

const add = async (directory) => {
  try {
    const jadePath = getJadePath(directory);
    // will be changed to check if Jade services are already setup
    if (
      !(await exists(jadePath)) ||
      !(await exists(join(jadePath, 'config.json')))
    ) {
      console.log(`You need to use "jade init" to setup your AWS instance.`);
      return;
    }
    const addAppAnswers = addAppQuestions();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { add };
