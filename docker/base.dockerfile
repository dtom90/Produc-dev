FROM node:18.20.5-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
