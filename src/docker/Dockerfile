FROM node:13-alpine

ARG repo_dir
ENV repo_dir=$repo_dir

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .
COPY ${repo_dir} ./repo

EXPOSE 6000
CMD [ "yarn", "start" ]