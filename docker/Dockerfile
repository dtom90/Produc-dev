FROM node:8.12.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

EXPOSE 8080
CMD ["yarn", "run", "serve"]