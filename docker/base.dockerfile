FROM node:12.18.4-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
