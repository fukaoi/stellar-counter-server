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
  console.log(config['test']);
  let lists2 = {"lists":
    [
    { address: "xxxxxxxxxxxxxx", timestamp: "20101-101001-11", amount: 10 },
    { address: "xxxxxxxxxx3333333", timestamp: "2018-101001-11", amount: 30 }, { address: "44444444444", timestamp: "2019-101001-11", amount: 40 }
    ]}
  await ctx.render('lumen', {lists: lists2});
}

async function token(ctx) {
  await ctx.render('token', {lists: lists});
}


if (!module.parent) app.listen(3000);