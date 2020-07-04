#!/bin/bash
set -e 

echo
echo "Running Packages Audit, Lint, and Unit Tests..."
echo
./test_basic.sh

IMAGE_NAME=devtrack-prod
CONTAINER_NAME=devtrack-prod
echo
echo "Deploying production container..."
echo
./prod.sh -d
./wait.sh
echo
echo "Production container deployed."
echo
echo "Testing against production container..."
echo
set +e
./test_e2e.sh
test_exit_code=$?
echo
echo "Stopping production container..."
echo
docker stop ${CONTAINER_NAME}
exit ${test_exit_code}
