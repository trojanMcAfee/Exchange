import SHA256 from 'crypto-js/sha256';

class Block {
    constructor() {
        this.transactions = [];
        this.limit = 3;
    }

    isFull() {
        return this.transactions.length < this.limit ? false: true;
    }

    addTransaction(hashedTx) {
        this.transactions.push(hashedTx.toString());
    }

    toHash() {
        return SHA256(this).toString();
    }
}

export default Block;