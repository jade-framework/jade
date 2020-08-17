FROM node:13-alpine

ARG REPO_DIR

WORKDIR /app

COPY ./dockerBuild.js .
COPY .$REPO_DIR .
COPY ./package.json .

EXPOSE 6000
CMD [ "yarn", "start" ]