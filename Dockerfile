FROM mhart/alpine-node:8.9

RUN addgroup -S app && adduser -S -g app app 

# dependencies needed to run node-gyp to compile leveldown
RUN apk add --no-cache python make gcc g++

COPY package.json /src/
RUN chown -R app:app /src/

WORKDIR /src
RUN npm install

COPY . /src/

CMD ["npm", "start"]
