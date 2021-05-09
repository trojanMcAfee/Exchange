const Block = require('./Block');

class Blockchain {
    constructor() {
        this.chain = [new Block(0)];
    }

    addBlock(block) {
        block.previousHash = this.chain[this.chain.length - 1].hash;
        this.chain.push(block);
    }

    isValid() {
        for (let i = 0; i < this.chain.length - 1; i++) {
            let currentBlock = this.chain[i].previousHash;
            let nextBlock = this.chain[i + 1].hash;
            if (currentBlock !== nextBlock) {
                return false;
            }
        }
        return true;
    }
}


module.exports = Blockchain;