const render = require('./lib/render')
const config = require('./config/config.json')
const StellarClient = require('./lib/stellar-client')
const logger = require('koa-logger')
const router = require('koa-router')()
const koaBody = require('koa-body')

const Koa = require('koa')
const app = module.exports = new Koa()

app.use(logger())
app.use(render)
app.use(koaBody())
app.use(router.routes())

router.get('/lumen', lumen).get('/token', token)
  .post('/send', send)

async function lumen(ctx) {
  await ctx.render('lumen', {
    horizonUrl: config['horizonUrl'],
    publicKey: config['publicKey'],
    limit: config['limit']
  })
}

async function token(ctx) {
  await ctx.render('token', {
    horizonUrl: config['horizonUrl'],
    publicKey: config['publicKey'],
    limit: config['limit']
  })
}

async function send(ctx) {
  const param = ctx.request.body
  new StellarClient().sendXLM(param.publickey, param.amount, param.txhash)
  ctx.response.status = 201
}

if (!module.parent) app.listen(3000)