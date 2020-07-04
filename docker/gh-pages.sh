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
docker run -it \
       -p 8080:8080 \
       --name ${CONTAINER_NAME} \
       ${IMAGE_NAME} \
       yarn run gh_pages:build && \
docker cp ${CONTAINER_NAME}:/app/dist_gh_pages ./dist_gh_pages && \
docker rm -f ${CONTAINER_NAME}
