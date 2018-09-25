FROM node:8-alpine
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN if [ "${NODE_ENV}" = "production" ]; then yarn run build; fi

EXPOSE 8080
CMD if [ "${NODE_ENV}" = "production" ]; then yarn run serve:prod; else yarn run serve; fi