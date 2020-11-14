#!/bin/bash

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
       sh -c 'yarn run web:build && cp -r .circleci dist_web && cp CNAME dist_web' && \
docker cp ${CONTAINER_NAME}:/app/dist_web ./dist_web && \
docker rm -f ${CONTAINER_NAME}
