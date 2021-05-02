import SHA256 from 'crypto-js/sha256';

class Block {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    toHash() {
        return SHA256(this);
    }
}

export default Block;