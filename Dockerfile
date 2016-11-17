FROM mhart/alpine-node:6.3

RUN addgroup -S app && adduser -S -g app app 

COPY package.json /src/
RUN chown -R app:app /src/

WORKDIR /src
# install deps for node-gyp (by node-sass)
RUN apk add --no-cache python make g++ && \
  npm install && \
  apk del python make g++

COPY . /src/

CMD ["npm", "start"]
