#!/bin/sh

docker run --rm -it -p 3000:3000 -v ${PWD}:/app node:16.5-stretch /bin/bash
