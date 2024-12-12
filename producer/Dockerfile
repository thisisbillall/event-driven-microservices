FROM node:16.9.0-alpine
WORKDIR /app
COPY package.json index /app/
RUN npm i
CMD [ "node", "index" ]