#!/usr/bin/env bash

IMAGE_NAME=todo-vue-prod
CONTAINER_NAME=todo-vue-prod

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

docker build \
       --build-arg NODE_ENV=production \
       -t ${IMAGE_NAME} . && \
docker run -i --rm \
       -p 8080:8080 \
       --name ${CONTAINER_NAME} \
       ${IMAGE_NAME}