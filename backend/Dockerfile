# file: Dockerfile

from docker:20-dind

# copy golang from the golang:1-alpine image
COPY --from=golang:1-alpine /usr/local/go /usr/local/go/
# add go to path
ENV PATH /usr/local/go/bin:$PATH
# setup GOPATH
ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"

# copy src into $GOPATH/app
RUN mkdir $GOPATH/src/app/
WORKDIR $GOPATH/src/app
COPY ./src ./

# build app
RUN go install

# run app
CMD ["app"]

#
# end of file: Dockerfile
