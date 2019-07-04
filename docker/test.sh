#!/usr/bin/env bash

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

echo
echo "Building test container..."
echo
docker build \
       -f docker/Dockerfile.dev \
       -t produc-dev-test \
       . && \
echo && echo "Running Lint and Unit Tests..." && echo &&\
docker run -it --rm \
       --name produc-dev-test \
       produc-dev-test \
       sh -c 'yarn run lint && yarn run test:unit'
test_exit_code=$?
if [ ${test_exit_code} != 0 ]; then exit ${test_exit_code}; fi
echo
echo "Deploying production container..."
echo
docker run -d --rm \
       -p 8080:80 \
       --name produc-dev-prod \
       produc-dev-prod
test_exit_code=$?
if [ ${test_exit_code} != 0 ]; then exit ${test_exit_code}; fi
docker run --rm \
           --net="host" \
           byrnedo/alpine-curl:0.1.7 \
           --retry 5 --retry-connrefused \
           http://localhost:8080
test_exit_code=$?
if [ ${test_exit_code} != 0 ]; then docker stop produc-dev-prod && exit ${test_exit_code}; fi
echo
echo "Production container deployed."
echo
echo "Testing against production container..."
echo
docker run -it --rm \
           -v `pwd`/tests/e2e:/tests \
           --net="host" \
           testcafe/testcafe chromium,firefox /tests
test_exit_code=$?
echo
echo "Stopping production container..."
echo
docker stop produc-dev-prod
exit ${test_exit_code}
