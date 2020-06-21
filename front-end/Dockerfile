FROM node:latest

LABEL maintainer="bucai<1450941858@qq.com>"

ENV HOST 0.0.0.0 

ADD . /app/

WORKDIR /app

RUN npm install

RUN npm run build

EXPOSE 9907

CMD  nohup sh -c 'npm run start'
