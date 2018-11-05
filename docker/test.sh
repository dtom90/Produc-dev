#!/usr/bin/env bash

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

echo
echo "Building test container..."
echo
docker build \
       -f docker/Dockerfile \
       -t todo-vue-test \
       . && \
echo && echo "Running Lint and Unit Tests..." && echo &&\
docker run -i --rm \
       --name todo-vue-test \
       todo-vue-test \
       sh -c 'yarn run lint && yarn run test:unit'
test_exit_code=$?
if [ ${test_exit_code} != 0 ]; then exit ${test_exit_code}; fi
echo
echo "Deploying production container..."
echo
./docker/prod.sh &
sleep 1
while ! curl -s 127.0.0.1:8080 > /dev/null; do
    sleep 1
done
echo
echo "Production container deployed."
echo
echo "Testing against production container..."
echo
docker run -i --rm \
           -v `pwd`/tests/e2e:/tests \
           --net="host" \
           testcafe/testcafe 'chromium --no-sandbox,firefox' /tests
test_exit_code=$?
echo
echo "Stopping production container..."
echo
docker stop todo-vue-prod
exit ${test_exit_code}
