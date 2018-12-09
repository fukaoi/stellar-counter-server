const render = require('./lib/render');
const config = require('./config/config.json');
const StellarClient = require('./lib/stellar-client');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');

const Koa = require('koa');
const app = module.exports = new Koa();

let lists = [];

app.use(logger());
app.use(render);
app.use(koaBody());
router.get('/lumen', lumen).get('/token', token).get('/decode', decode)
      .post('/send', send);
app.use(router.routes());

async function lumen(ctx) {
  await ctx.render('lumen', {
    horizonUrl : config['horizonUrl'],
    publicKey  : config['publicKey'],
    limit      : config['linit']   
  });
}

async function token(ctx) {
  await ctx.render('token', {lists: lists});
}

async function send(ctx) {
  const param = ctx.request.body;
  new StellarClient().sendXLM(param.publickey, param.amount, param.txhash);
  ctx.response.status = 201;
}

async function decode(ctx) {
  const param = ctx.request.body;
  console.log(param);
  const buffer = Buffer.from(param.encoded_memo, 'base64');
  ctx.response.body = buffer.toString('hex');
}

if (!module.parent) app.listen(3000);