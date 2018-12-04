const render = require('./lib/render');
const config = require('./config/config.json');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');

const Koa = require('koa');
const app = module.exports = new Koa();

let lists = [];

app.use(logger());
app.use(render);
app.use(koaBody());
router.get('/lumen', lumen).get('/token', token);
app.use(router.routes());

async function lumen(ctx) {
  await ctx.render('lumen', {
    horizonUrl: config['horizonUrl'],
    publicKey: config['publicKey']
  });
}

async function token(ctx) {
  await ctx.render('token', {lists: lists});
}


if (!module.parent) app.listen(3000);