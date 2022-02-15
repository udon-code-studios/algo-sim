# file: Dockerfile

from node:16

WORKDIR /app

# install node packages
COPY package.json package-lock.json .
RUN npm ci

# build app
COPY . .
RUN npm run build

# set port to serve app
ENV PORT 3000
EXPOSE ${PORT}

# launch app server
CMD ["npm", "start"]

#
# end of file: Dockerfile
