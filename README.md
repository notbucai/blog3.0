# 博客第三个版本

`巩固知识、打发时间` 本项目基于这两点进行开发，可能不完美。

## 技术选型

### Docker 部署

> `tar --exclude=node_modules --exclude=dist --exclude=.nuxt --exclude=_config --exclude=.git -zcvf ../blog3.tar.gz .`   
> `docker-compose up --build`  
> `docker-compose up -d`  


### 服务端 

> 使用 `nestjs` + `mongodb` + `redis` + `cos`

### 管理平台

> 使用 `Vuejs` + `Element UI`

### 博客前端

> 使用 `Nuxtjs` + `Vuetify.js`

## 目录结构

```
├── README.md            # 自述
├── admin                # 管理页面
│   ├── Dockerfile              # 管理页面 Dockerfile 配置 （ps: 目前无用）
│   ├── README.md               # 管理页面自述
│   ├── package.json
│   ├── public
│   ├── src                     # 项目目录
│   └── vue.config.js           # vue 配置文件
├── docker-compose.yml   # docker-compose 配置文件
├── front-end            # 博客前台页面
│   ├── Dockerfile
│   ├── README.md
│   ├── assets
│   ├── components
│   ├── constant
│   ├── jsconfig.json
│   ├── layouts
│   ├── middleware
│   ├── nuxt.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── pages
│   ├── plugins
│   ├── server
│   ├── static
│   ├── store
│   └── utils
├── package.json
└── server                # 博客服务端
    ├── Dockerfile
    ├── README.md
    ├── dist
    ├── nest-cli.json
    ├── package-lock.json
    ├── package.json
    ├── src
    ├── test
    ├── tsconfig.build.json
    ├── tsconfig.json
    ├── tslint.json
    ├── views
    └── yarn.lock

```

## 项目开发进度

> 2020-06-22 基础版本 项目部署  
> 2020-07-02 交互功能基本完善  


## 如何运行？

1. clone 本项目

2. 将 server/src/`_config` 改成server/src/`config`

2. 修改 `server/src/config/default.conf.ts` 文件中的配置

3. 安装个个项目中的依赖

4. 运行服务端  
> `cd server` && `npm run start:dev`  
5. 运行博客前端
> `cd front-end` && `npm run dev`  
6. 运行管理后台
> `cd admin` && `npm run serve`  

