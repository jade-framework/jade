const { exists, getJadePath } = require('../util/fileUtils');
const { addAppQuestions } = require('../util/questions');

const add = async (directory) => {
  try {
    if (!awsCredentialsConfigured()) return;
    const jadePath = getJadePath(directory);
    if (!(await exists(jadePath))) {
      console.log(`You need to use "jade init" to setup your AWS instance.`);
      return;
    }
    const answers = addAppQuestions();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { add };
