FROM node:16.20.2-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
