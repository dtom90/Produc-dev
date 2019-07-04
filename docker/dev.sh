#!/usr/bin/env bash

# Runs development container with source mapping
# - PREREQUISITE: run install.sh to install dependencies
# - Source code is mapped from host
# - Run with additional command to replace default command

IMAGE_NAME=node:lts-alpine
CONTAINER_NAME=producdev-dev

CMD="$@"
if [[ -z "$CMD" ]]; then CMD="yarn run dev"; fi

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

docker run -it --rm \
       -p 8080:8080 \
       -v `pwd`:/app \
       -w /app \
       --name ${CONTAINER_NAME} \
       ${IMAGE_NAME} \
       ${CMD}