FROM node:13-alpine

EXPOSE 3000

RUN mkdir /code

WORKDIR /code

ADD api /code

RUN npm install

CMD ["npx", "nodemon", "server"]
