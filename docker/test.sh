#!/usr/bin/env bash

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.." || exit

IMAGE_NAME=producdev-prod
CONTAINER_NAME=producdev-prod

echo
echo "Running Lint and Unit Tests..."
echo
./docker/temp.sh yarn run lint && yarn run test:unit
test_exit_code=$?
if [ ${test_exit_code} != 0 ]; then exit ${test_exit_code}; fi
echo
echo "Deploying production container..."
echo
docker build \
       -f docker/Dockerfile.prod \
       -t ${IMAGE_NAME} \
       . && \
docker run -d --rm \
       -p 8080:80 \
       --name ${CONTAINER_NAME} \
       ${IMAGE_NAME}
test_exit_code=$?
if [ ${test_exit_code} != 0 ]; then exit ${test_exit_code}; fi
docker run --rm \
           --net="host" \
           byrnedo/alpine-curl:0.1.7 \
           --retry 5 --retry-connrefused \
           http://localhost:8080
test_exit_code=$?
if [ ${test_exit_code} != 0 ]; then docker stop ${CONTAINER_NAME} && exit ${test_exit_code}; fi
echo
echo "Production container deployed."
echo
echo "Testing against production container..."
echo
docker build \
       -f docker/Dockerfile.testcafe \
       -t producdev-testcafe \
       . && \
docker run -it --rm \
           --net="host" \
           producdev-testcafe \
           chromium:headless /tests -c 4 --selector-timeout 3000
test_exit_code=$?
echo
echo "Stopping production container..."
echo
docker stop ${CONTAINER_NAME}
exit ${test_exit_code}
