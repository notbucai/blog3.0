FROM node:12.18.2

LABEL maintainer="bucai<1450941858@qq.com>"

ENV DEBUG=socket.io*

ADD . /app/

WORKDIR /app

RUN rm -rf node_modules cache dist

RUN npm config set sharp_binary_host https://npm.taobao.org/mirrors/sharp

RUN npm config set sharp_libvips_binary_host https://npm.taobao.org/mirrors/sharp-libvips

RUN npm install --registry https://registry.npmmirror.com --max-old-space-size=8192 --loglevel verbose

RUN npm run build

EXPOSE 9905

CMD  nohup sh -c 'npm run start:prod'