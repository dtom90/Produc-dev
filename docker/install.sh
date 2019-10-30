#!/usr/bin/env bash

# Installs node modules to host directory

IMAGE_NAME=producdev-base

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.." || exit

docker build \
       -f docker/Dockerfile.base \
       -t ${IMAGE_NAME} \
       . && \
docker run -i --rm \
       -v "$(pwd)":/app \
       -w /app \
       ${IMAGE_NAME} \
       yarn install