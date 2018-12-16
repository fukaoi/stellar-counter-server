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
  .post('/send', send).post('/trust', trust)

async function lumen(ctx) {
  await ctx.render('lumen', {
    header: 'header-lumen',
    horizonUrl: config['horizonUrl'],
    publicKey: config['publicKey'],
    limit: config['limit']
  })
}

async function token(ctx) {
  await ctx.render('token', {
    header: 'header-token',
    horizonUrl: config['horizonUrl'],
    publicKey: config['publicKey'],
    limit: config['limit']
  })
}

async function send(ctx) {
  const param = ctx.request.body
  let status, body
  if (!param.publickey || !param.amount || !param.txhash) {
    status = 404
    body = `Not found parameters => publickey:${param.publickey},amount:${param.amount},txhash:${param.txhash}`
  } else {
    const response = new StellarClient().sendXLM(param.publickey, param.amount, param.txhash)
    status = 201
    message = response  
  }
  ctx.response.status = status
  ctx.response.message = body
}

async function trust(ctx) {
  const param = ctx.request.body
  let status, body
  if (!param.assetName || !param.issuerPublicKey) {
    status = 404
    body = `Not found parameters => assetName:${param.assetName}, issuerPublicKey:${issuerPublicKey}`
  } else {
    const response = new StellarClient().trustLine(param.assetName, param.issuerPublicKey)
    status = 201
    message = response  
  }
  ctx.response.status = status
  ctx.response.message = body
}

if (!module.parent) app.listen(process.env.PORT || 3000)