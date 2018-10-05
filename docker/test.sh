#!/usr/bin/env bash

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

echo "Deploying production container..."
./docker/prod.sh &
sleep 1
while ! curl -s 127.0.0.1:8080 > /dev/null; do
    sleep 1
done
echo "Production container deployed."
echo
echo "Testing against production container..."
docker run -i --rm \
           -v `pwd`/tests/e2e:/tests \
           --net="host" \
           testcafe/testcafe 'chromium --no-sandbox,firefox' /tests
test_exit_code=$?
echo
echo "Stopping production container..."
docker stop todo-vue-prod
exit "$test_exit_code"
