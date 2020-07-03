#!/bin/sh

# Runs production container

IMAGE_NAME=devtrack-prod
CONTAINER_NAME=devtrack-prod

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.." || exit

if [ "$1" == "-d" ]; then
  RUN_OPTION="-d"
else
  RUN_OPTION="-it"
fi

docker build \
       -f docker/prod.dockerfile \
       -t ${IMAGE_NAME} \
       . && \
docker run ${RUN_OPTION} --rm \
       -p 8080:80 \
       --name ${CONTAINER_NAME} \
       ${IMAGE_NAME}