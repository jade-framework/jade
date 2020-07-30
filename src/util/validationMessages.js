const customizeLambdaWarnings = (name) => {
  const warningMessages = {
    nameIsTaken: msgAfterAction(
      "name",
      name,
      "already being used in this directory",
      "is"
    ),
    invalidSyntax: `${msgAfterAction(
      "name",
      name,
      "invalid",
      "is"
    )}. Lambda names must be 1 to 64 characters in length and contain only letters, numbers, hyphens, or underscores.`,
    doesNotExistInCwd: msgAfterAction(
      "file",
      name,
      "exist in this directory",
      "does not"
    ),
    alreadyExistsOnAws: `${msgAfterAction(
      "lambda",
      name,
      "exists",
      "already"
    )}.  To overwrite this lambda, please use "bam redeploy ${name}".`,
    doesNotExistOnAws: msgAfterAction("lambda", name, "exist", "does not"),
    useDeployInstead: `${msgAfterAction(
      "lambda",
      name,
      "exist",
      "does not"
    )}. To deploy a new lambda, please use "bam deploy ${name}".`,
    invalidLambda: `${msgAfterAction(
      "lambda",
      name,
      "contain exports.handler",
      "does not"
    )}.  To create a local lambda file in the correct format, please use "bam create ${name}".`,
  };

  return warningMessages;
};

module.exports = {
  customizeLambdaWarnings,
};
