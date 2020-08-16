FROM node:13-alpine

WORKDIR /app

ARG repo_dir
ENV repo_dir_env=$repo_dir

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 6000
CMD [ "yarn", "start" ]