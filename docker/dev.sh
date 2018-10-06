#!/usr/bin/env bash

IMAGE_NAME=todo-vue-dev
CONTAINER_NAME=todo-vue-dev

CMD="$@"

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

docker build \
       -f docker/Dockerfile \
       -t ${IMAGE_NAME} \
       . && \
docker run -i --rm \
       -p 8080:8080 \
       -v `pwd`:/app \
       --name ${CONTAINER_NAME} \
       ${IMAGE_NAME} \
       ${CMD}