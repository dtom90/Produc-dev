#!/usr/bin/env bash

# Runs production container

IMAGE_NAME=producdev-prod
CONTAINER_NAME=producdev-prod

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.." || exit

docker build \
       -f docker/Dockerfile.prod \
       -t ${IMAGE_NAME} \
       . && \
docker run -i --rm \
       -p 8080:80 \
       --name ${CONTAINER_NAME} \
       ${IMAGE_NAME}