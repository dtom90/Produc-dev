#!/bin/bash

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.." || exit

docker build \
       -f docker/cypress.dockerfile \
       -t devtrack-cypress \
       . && \
docker run -it --rm \
           --net="host" \
           devtrack-cypress \
           npx cypress run -b chrome