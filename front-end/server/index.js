const Koa = require('koa')
const KoaRouter = require('koa-router')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const http = require('./http')

const cache = require('./cache')

const app = new Koa()
const router = new KoaRouter({
  prefix: '/cache'
});
const bffRouter = new KoaRouter({
  prefix: '/bff'
});
bffRouter.get('/user/:id/card', async (ctx) => {
  const data = await bff.userCard(ctx.params.id);
  ctx.body = {
    code: 0,
    data
  };
});


router.get('/data/home', async (ctx) => {
  const httpUrls = [
    ['/article/list/hot', 'cache'],
    ['/article/list/all', 'cache'],
    ['/tag/list/effect', 'cache'],
    ['/article/list/random', 'cache'],
    ['/comment/list/new/article', 'cache'],
  ];
  const promiseList = httpUrls.map(async (item, index) => {
    const timeKey = `cache:${item[0]}:time`;
    console.time(timeKey);
    const [url, type] = item;
    if (type === 'cache') {
      const data = await cache.getCache(url);
      console.timeEnd(timeKey);
      return {
        data: {
          data,
        }
      }
    }
    const res = await http.get(url)
    console.timeEnd(timeKey);
    return res;
  });

  const data = await Promise.all(promiseList)
  ctx.body = {
    code: 0,
    data: data.map(item => item.data ? item.data.data : {})
  }
})

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const bff = require('./bff')
config.dev = app.env !== 'production'

async function start () {
  cache.initTask([
    '/comment/list/new/article',
    '/article/list/hot',
    '/tag/list/effect',
    '/article/list/random'
  ]);
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  await nuxt.ready()
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app
    .use(router.routes())
    .use(bffRouter.routes());

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
