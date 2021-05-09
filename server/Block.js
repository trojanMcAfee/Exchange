const SHA256 = require('crypto-js/sha256');

class Block {
    constructor() {
        this.timestamp = Date.now();
        this.transactions = [];
        this.limit = 3;
        this.nonce = 0;
    }

    isFull() {
        return this.transactions.length < this.limit ? false: true;
    }

    addTransaction(hashedTx) {
        this.transactions.push(hashedTx.toString());
    }

    toHash() {
        return SHA256(this.timestamp + this.transactions + '' + this.nonce).toString();
    }
}

module.exports = Block;