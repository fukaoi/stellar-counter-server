const render = require('./lib/render');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const serve = require('koa-static');

const Koa = require('koa');
const app = module.exports = new Koa();

const lists = [];

app.use(logger());
app.use(render);
app.use(koaBody());
router.get('/lumen', lumen).get('/token', token);
app.use(router.routes());
app.use(serve('./public'));

async function lumen(ctx) {
  await ctx.render('lumen', {lists: lists});
}

async function token(ctx) {
  await ctx.render('token', {lists: lists});
}


if (!module.parent) app.listen(3000);