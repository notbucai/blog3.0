FROM node:latest

LABEL maintainer="bucai<1450941858@qq.com>"

ADD . /app/

WORKDIR /app

RUN npm install --registry=https://registry.npm.taobao.org

RUN npm run build

EXPOSE 9905

CMD  nohup sh -c 'npm run start:prod'