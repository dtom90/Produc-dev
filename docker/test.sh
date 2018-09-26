#!/usr/bin/env bash

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

echo "Deploying production container..."
./docker/prod.sh > docker/prod.log &
sleep 1
while ! grep -m1 'Listening on port 8080' < docker/prod.log; do
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
