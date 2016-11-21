FROM mhart/alpine-node:6.3

RUN addgroup -S app && adduser -S -g app app 

COPY package.json /src/
RUN chown -R app:app /src/

WORKDIR /src
RUN npm install

COPY . /src/

CMD ["npm", "start"]
