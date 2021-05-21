const Block = require('./Block');
const MerkleTree = require('./MerkleTree');

class Blockchain {
    constructor() {
        this.chain = [new Block(0)];
        // this.merkleRoot = this.merkleRoot;
    }

    addBlock(block) {
        // if (typeof block === 'object') {
            block.previousHash = this.chain[this.chain.length - 1].hash;
            // block.previousHash = typeof (this.chain[this.chain.length - 1]) === 'object' ? this.chain[this.chain.length - 1].hash : this.chain[this.chain.length - 1];
        // } 
        this.chain.push(block);
    }

    isValid() {
        for (let i = 0; i < this.chain.length - 1; i++) {
            let currentBlock = this.chain[i].hash;
            let nextBlock = this.chain[i + 1].previousHash;
            if (currentBlock !== nextBlock && currentBlock && nextBlock) {
                console.log('current block hash: ', currentBlock, 'with id: ', this.chain[i].id);
                console.log('next block previous hash: ', nextBlock, 'with id: ', this.chain[i + 1].id);
                return false;
            }
        }
        return true;
    }
}


module.exports = Blockchain;