#!/usr/bin/env bash

IMAGE_NAME=node:10.15.1-alpine

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

docker run -i --rm \
       -v `pwd`:/app \
       -w /app \
       ${IMAGE_NAME} \
       yarn install