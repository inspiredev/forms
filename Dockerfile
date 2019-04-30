FROM mhart/alpine-node:8

RUN addgroup -S app && adduser -S -g app app 

COPY package.json /src/
COPY package-lock.json /src/
RUN chown -R app:app /src/

WORKDIR /src
RUN npm install

COPY . /src/

CMD ["npm", "run", "server"]
