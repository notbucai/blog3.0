FROM node:12.18.2

LABEL maintainer="bucai<1450941858@qq.com>"

ENV HOST 0.0.0.0 

ADD . /app/

WORKDIR /app

RUN rm -rf node_modules

RUN rm -rf dist

RUN npm config set sharp_binary_host https://npm.taobao.org/mirrors/sharp

RUN npm config set sharp_libvips_binary_host https://npm.taobao.org/mirrors/sharp-libvips

RUN npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass

RUN npm install --registry https://registry.npmmirror.com --max-old-space-size=8192

RUN npm run build

ENV NODE_ENV production

EXPOSE 9907

CMD  nohup sh -c 'npm run pm2'
