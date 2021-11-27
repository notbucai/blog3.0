FROM node:12.18.2

LABEL maintainer="bucai<1450941858@qq.com>"

ENV HOST 0.0.0.0 

ADD . /app/

WORKDIR /app

RUN rm -rf node_modules

RUN rm -rf dist

RUN npm install --registry https://registry.npm.taobao.org

RUN npm run build

EXPOSE 9907

CMD  nohup sh -c 'npm run pm2'
