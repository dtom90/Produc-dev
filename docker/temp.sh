#!/usr/bin/env bash

IMAGE_NAME=todo-vue-test
CONTAINER_NAME=todo-vue-test

CMD="$@"
if [[ -z "$CMD" ]]; then CMD="yarn run dev"; fi

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

docker build \
       -f docker/Dockerfile \
       -t ${IMAGE_NAME} \
       . && \
docker run -i --rm \
       -p 8080:8080 \
       --name ${CONTAINER_NAME} \
       ${IMAGE_NAME} \
       ${CMD}