FROM mhart/alpine-node:10

RUN apk add --no-cache tzdata
ENV TZ America/New_York

RUN addgroup -S app && adduser -S -g app app 

COPY package.json /src/
COPY package-lock.json /src/
RUN chown -R app:app /src/

WORKDIR /src
RUN npm install

COPY . /src/

CMD ["npm", "run", "server"]
