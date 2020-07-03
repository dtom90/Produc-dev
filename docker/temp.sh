#!/bin/sh

# Runs temporary container in development mode
# - Node modules installed in Docker image
# - Source code is copied to Docker image
# - Run with additional command to replace default command

IMAGE_NAME=devtrack-temp
CONTAINER_NAME=devtrack-temp

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.." || exit

docker build \
       -f docker/temp.dockerfile \
       -t ${IMAGE_NAME} \
       . && \
docker run -it --rm \
       -p 8080:8080 \
       --name ${CONTAINER_NAME} \
       ${IMAGE_NAME} \
       "$@"