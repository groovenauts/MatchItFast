FROM gcr.io/deeplearning-platform-release/tf2-cpu.2-5

ARG WORKDIR=/app
RUN mkdir -p ${WORKDIR}
WORKDIR ${WORKDIR}

# Due to a change in the Beam base image in version 2.24, we need to install
# libffi-dev manually as a dependency. For more information:
#   https://github.com/GoogleCloudPlatform/python-docs-samples/issues/4891
#RUN apt-get update && apt-get install -y libffi-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -U -r ./requirements.txt

COPY main.py

RUN python3 main.y
