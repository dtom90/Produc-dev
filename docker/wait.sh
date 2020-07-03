#!/bin/sh

docker run --rm \
           --net="host" \
           byrnedo/alpine-curl:0.1.7 \
           --retry 5 --retry-connrefused \
           http://localhost:8080