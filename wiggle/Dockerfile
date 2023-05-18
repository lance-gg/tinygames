FROM node:18-alpine3.17
WORKDIR /app
EXPOSE 3000
ADD src .src
COPY package.json .
COPY babel.config.js .
COPY webpack.config.js .
RUN apk add --update --no-cache make gcc g++ python3 && ln -sf python3 /usr/bin/python
RUN npm install
RUN npm run build
CMD ["npm", "start"]
