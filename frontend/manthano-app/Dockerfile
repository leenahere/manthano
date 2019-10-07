FROM node:10

RUN mkdir -p /manthano/client
WORKDIR /manthano/client

COPY . /manthano/client

RUN rm package-lock.json && rm -rf node_modules && rm -rf ~/.node-gyp && rm yarn.lock

RUN npm i -g node-gyp

RUN npm install

CMD ["npm", "start"]
