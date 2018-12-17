'use strict'

const StellarSdk = require('stellar-sdk')
const StellarBase = require('stellar-base')
const config = require('../config/config.json')

class ClientSdk {
  constructor() {
    this.server = new StellarSdk.Server(config['horizonUrl'])
    this.keypair = StellarSdk.Keypair.fromSecret(config['secretKey']);    
    StellarSdk.Network.useTestNetwork()
  }

  getMyBalance(callback, assetType = 'native') {
    this.server.loadAccount(this.keypair.publicKey()).then((account) => {
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
    this.execOperation(setting, memo)
  }

  trustLine(assetName, issuerPublicKey) {
    const asset = new StellarSdk.Asset(assetName, issuerPublicKey)
    const setting = StellarSdk.Operation.changeTrust(
    {
      asset: asset,
      limit: "10000"
    })
    this.execOperation(setting)
  } 
  
  async execOperation(setting, memo = '') {
    try {
      const account = await this.server.loadAccount(this.keypair.publicKey())
      let transaction
      if (memo) {
        transaction = new StellarBase.TransactionBuilder(account)
        .addOperation(setting)
        .addMemo(StellarSdk.Memo.hash(memo))
        .build()
      } else {
        transaction = new StellarBase.TransactionBuilder(account)
        .addOperation(setting)
        .build()
      } 
      transaction.sign(this.keypair)
      this.server.submitTransaction(transaction)
      return transaction.toEnvelope().toXDR('base64')
    } catch (error) {
      console.error(error)
    }
  }

  paymentMessage(callback) {
    this.server.payments()
      .forAccount(this.keypair.publicKey()).cursor()
      .stream({
        onmessage: (message) => {
          callback(message.from, message.amount, message.created_at)
        }
      })
  }
}

module.exports = ClientSdk
