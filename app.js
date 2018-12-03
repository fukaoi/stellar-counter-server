const render = require('./lib/render');
const ClientSdk = require('./lib/stellar-client');
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
  // let lists = 
  //   [
  //   { address: "xxxxxxxxxxxxxx", timestamp: "20101-101001-11", amount: 10 },
  //   { address: "xxxxxxxxxx3333333", timestamp: "2018-101001-11", amount: 30 }, { address: "44444444444", timestamp: "2019-101001-11", amount: 40 }
  //   ]

  let lists = [];
  const client = new ClientSdk();
  let store_tx = async (address, amount, timestamp) => {
    let obj = { address: address, amount: amount, timestamp: timestamp };
    lists.push(obj);
    console.log(lists.length);
  }
  client.paymentMessage(store_tx);
  await ctx.render('lumen', { lists: lists });
}

async function token(ctx) {
  await ctx.render('token', {lists: lists});
}


if (!module.parent) app.listen(3000);