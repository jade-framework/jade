FROM node:13-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 6000
CMD [ "yarn", "start" ]