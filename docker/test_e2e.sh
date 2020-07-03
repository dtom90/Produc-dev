#!/bin/sh

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.." || exit

docker build \
       -f docker/testcafe.dockerfile \
       -t devtrack-testcafe \
       . && \
docker run -it --rm \
           --net="host" \
           devtrack-testcafe \
           chromium:headless /tests -c 4 --selector-timeout 3000