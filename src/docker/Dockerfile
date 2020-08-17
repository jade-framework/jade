FROM node:13

ARG REPO_NAME
ENV REPO_NAME_ENV $REPO_NAME

WORKDIR /app

RUN mkdir ./${REPO_NAME}
COPY ./dockerBuild.js .
COPY ./${REPO_NAME} ./${REPO_NAME}
# COPY ./gatsby-default ./gatsby-default
COPY ./package.json .

EXPOSE 6000
CMD [ "yarn", "start" ]