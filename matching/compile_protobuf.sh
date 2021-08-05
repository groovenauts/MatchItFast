#!/bin/sh

set -e

WORKDIR=$(dirname $0)

mkdir -p "${WORKDIR}/third_party"
cd "${WORKDIR}/third_party"
git clone https://github.com/googleapis/googleapis.git
cd "${WORKDIR}"
python3 -m grpc_tools.protoc -I=. --proto_path=third_party/googleapis --python_out=. --grpc_python_out=. match_service.proto
