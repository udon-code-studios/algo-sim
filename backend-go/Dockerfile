FROM golang:1.18

WORKDIR /app

# copy app
COPY ./src .

# install go packages
RUN go install

# build app
RUN go build -o app

# start app
CMD ./app
