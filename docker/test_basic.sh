#!/bin/bash

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.." || exit

./docker/temp.sh sh -c "yarn packages:audit && yarn run lint && yarn run test:unit"
test_exit_code=$?
if [ ${test_exit_code} != 0 ]; then exit ${test_exit_code}; fi
