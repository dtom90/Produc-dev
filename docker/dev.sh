#!/usr/bin/env bash

IMAGE_NAME=node:10.15.0-alpine
CONTAINER_NAME=todo-vue-dev

CMD="$@"

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

docker run -i --rm \
       -p 8080:8080 \
       -v `pwd`:/app \
       -w /app \
       --name ${CONTAINER_NAME} \
       ${IMAGE_NAME} \
       yarn run dev