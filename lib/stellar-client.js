'use strict'

const StellarSdk = require('stellar-sdk')
const StellarBase = require('stellar-base')
const config = require('../config/config.json')

class ClientSdk {
  constructor() {
    this.server = new StellarSdk.Server(config['horizonUrl'])
    this.publicKey = config['publicKey']
    this.secretKey = config['secretKey']
    StellarSdk.Network.useTestNetwork()
  }

  getMyBalance(callback, assetType = 'native') {
    this.server.loadAccount(this.publicKey).then((account) => {
      account.balances.forEach(x => {
        if (x.asset_type == assetType) callback(x.balance)
      })
    })
  }

  sendXLM(destAddress, amount, memo) {
    const setting = StellarBase.Operation.payment(
    {
      destination: destAddress,
      asset: StellarBase.Asset.native(),
      amount: String(amount) // must be string!
    })
    execOperation(setting, memo)
  }

  trustLine(assetName) {
    const setting = StellarSdk.Operation.changeTrust(
    {
      asset: assetName,
      limit: "10000"
    })
    execOperation(setting)
  } 
  
  async execOperation(config, memo = '') {
    try {
      const account = await this.server.loadAccount(this.publicKey)
      const transaction = new StellarBase.TransactionBuilder(account)
        .addOperation(config)
        .addMemo(StellarSdk.Memo.hash(memo))
        .build()
      transaction.sign(this.secretKey)
      this.server.submitTransaction(transaction)
      return transaction.toEnvelope().toXDR('base64')

    } catch (error) {
      console.error(error)
      return error
    }
  }

  paymentMessage(callback) {
    this.server.payments()
      .forAccount(this.publicKey).cursor()
      .stream({
        onmessage: (message) => {
          callback(message.from, message.amount, message.created_at)
        }
      })
  }
}

module.exports = ClientSdk
