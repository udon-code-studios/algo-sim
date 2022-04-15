# file: Dockerfile

from node:16

ARG BACKEND_URI
ENV REACT_APP_BACKEND_URI=$BACKEND_URI

WORKDIR /app

# install node packages
COPY package.json package-lock.json ./
RUN npm ci

# build app
COPY . .
RUN npm run build

# set port to serve app
ENV PORT 3000
EXPOSE ${PORT}

# Install the serve command globally.
RUN npm install -g serve

# Run the create-react-app application when the container is started.
CMD ["serve", "-s", "build"]

#
# end of file: Dockerfile
