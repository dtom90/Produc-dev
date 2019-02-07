#!/usr/bin/env bash

THIS_DIR=$(dirname "$0")
cd "${THIS_DIR}/.."

docker run -i --rm \
       -v `pwd`:/app \
       -w /app \
       node:10.15.0-alpine \
       yarn install