FROM node:12.18.2

LABEL maintainer="bucai<1450941858@qq.com>"

ADD . /app/

WORKDIR /app

RUN rm -rf node_modules

RUN npm install

RUN npm run build

EXPOSE 9905

CMD  nohup sh -c 'npm run start:prod'