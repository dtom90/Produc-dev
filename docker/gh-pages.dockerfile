FROM node:lts-alpine as build-stage
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /app

CMD yarn install && yarn run gh_pages:build