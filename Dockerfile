# FROM node:14-alpine
FROM node:14-alpine

WORKDIR /app

COPY ./package.json /app/
RUN npm install

COPY ./ /app/
