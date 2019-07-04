#!/usr/bin/env bash

# Installs node modules to host directory

IMAGE_NAME=node:lts-alpine

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

docker run -i --rm \
       -v `pwd`:/app \
       -w /app \
       ${IMAGE_NAME} \
       yarn install