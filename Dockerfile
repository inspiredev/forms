FROM mhart/alpine-node:5.6

WORKDIR /src

COPY package.json /src/

# install deps for node-gyp (by node-sass)
RUN apk add --no-cache python make g++ && \
  npm install && \
  apk del python make g++

COPY . /src/

CMD ["npm", "start"]
