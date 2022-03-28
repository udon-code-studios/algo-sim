FROM ubuntu:20.04

# set port to serve app
ENV PORT 3000
EXPOSE ${PORT}

# get alpaca variables as build arguments and set env variables
ARG APCA_API_KEY_ID
ARG APCA_API_SECRET_KEY
ARG APCA_API_BASE_URL
ENV APCA_API_KEY_ID=$APCA_API_KEY_ID
ENV APCA_API_SECRET_KEY=$APCA_API_SECRET_KEY
ENV APCA_API_BASE_URL=$APCA_API_BASE_URL

# install curl (to install other dependencies)
RUN apt update && apt install curl -y

# install golang (install instructions: https://go.dev/doc/install)
RUN curl -LO https://go.dev/dl/go1.18.linux-amd64.tar.gz
RUN rm -rf /usr/local/go && tar -C /usr/local -xzf go1.18.linux-amd64.tar.gz
ENV PATH $PATH:/usr/local/go/bin

# install node (install instructions: https://github.com/nodesource/distributions#installation-instructions)
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs

# install python
# python 3.8.10 comes with base image

WORKDIR /app

# copy app
COPY ./src .

# install go packages
RUN go install

# build app
RUN go build -o app

# start app
CMD ./app
