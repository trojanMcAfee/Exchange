const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(id) {
        this.id = id;
        this.timestamp = Date.now();
        this.transactions = [];
        this.utxos = [];
        this.limit = 3;
        this.nonce = 0;
    }

    addTransactionUTXO(tx) {
        this.utxos.push(tx);
    }

    isFull() {
        return this.transactions.length < this.limit ? false: true;
    }

    addTransaction(hashedTx) {
        this.transactions.push(hashedTx.toString());
    }

    toHash() {
        return SHA256(this.timestamp + '' 
            + JSON.stringify(this.transactions) + '' 
            + this.nonce + '' 
            + JSON.stringify(this.utxos)).toString();
    }
}

module.exports = Block;