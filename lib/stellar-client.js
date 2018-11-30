'use strict';

const StellarSdk = require('stellar-sdk');
const StellarBase = require('stellar-base');
const config = require('../config/config.json');

class ClientSdk {
  constructor() { 
    const horizon_url = 'https://horizon-testnet.stellar.org';
    this.server = new StellarSdk.Server(horizon_url);
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

  sendXLM(destAddress, amount) {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(this.secretKey);
    this.server.loadAccount(this.publicKey).then((account) => {
      const transaction = new StellarBase.TransactionBuilder(account)
        .addOperation(StellarBase.Operation.payment({
          destination: destAddress,
          asset: StellarBase.Asset.native(),
          amount: String(amount) // must be string!
        })).build();
      transaction.sign(sourceKeypair);
      console.log(transaction.toEnvelope().toXDR('base64'));
      this.server.submitTransaction(transaction);
    });
  }
}

new ClientSdk().getMyBalance(console.log);
// new ClientSdk().sendXLM('GCZLVVKNA4E2HBFWN7PFIURFDR44QOT5CLTIPDBKWF4KZGIB5JWZ7FQ6', 1000);
