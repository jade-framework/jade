FROM node:13

ARG REPO_DIR
# ENV REPO_DIR_ENV $REPO_DIR

WORKDIR /app

COPY ./dockerBuild.js .
COPY .$REPO_DIR .$REPO_DIR
COPY ./package.json .

EXPOSE 6000
CMD [ "yarn", "start" ]