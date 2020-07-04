#!/bin/bash

# Installs node modules to host directory

IMAGE_NAME=devtrack-base

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.." || exit

CMD="$@"
if [[ -z "$CMD" ]]; then CMD="yarn install"; fi

docker build \
       -f docker/base.dockerfile \
       -t ${IMAGE_NAME} \
       . && \
docker run -i --rm \
       -v "$(pwd)":/app \
       -w /app \
       ${IMAGE_NAME} \
       sh -c "${CMD}"