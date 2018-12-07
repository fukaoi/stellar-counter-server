'use strict';

const StellarSdk = require('stellar-sdk');
const StellarBase = require('stellar-base');
const config = require('../config/config.json');

class ClientSdk {
  constructor() { 
    this.server = new StellarSdk.Server(config['horizonUrl']);
    this.publicKey = config['publicKey'];
    this.secretKey = config['secretKey'];
    StellarSdk.Network.useTestNetwork();
  }

  getMyBalance(callback, assetType = 'native') {
    this.server.loadAccount(this.publicKey).then((account) => {
      account.balances.forEach(x => {
        if (x.asset_type == assetType) callback(x.balance);
      });
    });
  }

  sendXLM(destAddress, amount, memo) {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(this.secretKey);
    this.server.loadAccount(this.publicKey).then((account) => {
      const transaction = new StellarBase.TransactionBuilder(account)
        .addOperation(StellarBase.Operation.payment({
          destination: destAddress,
          asset: StellarBase.Asset.native(),
          amount: String(amount) // must be string!
        }))
        .addMemo(StellarSdk.Memo.hash(memo))
        .build();
      transaction.sign(sourceKeypair);
      this.server.submitTransaction(transaction);
      return transaction.toEnvelope().toXDR('base64');
    });
  }

  async paymentMessage(callback) {
    this.server.payments()
      .forAccount(this.publicKey)
      .cursor('now')
      .stream({
        onmessage: (message) => {
          callback(message.from, message.amount, message.created_at);
        }
      });
  }
}

module.exports = ClientSdk;
