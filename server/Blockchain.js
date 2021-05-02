import Block from './Block';

class Blockchain {
    constructor() {
        this.chain = [new Block()];
    }

    addBlock(block) {
        block.previousHash = this.chain[this.chain.length - 1].toHash();
        this.chain.push(block);
    }

    isValid() {
        for (let i = 0; i < this.chain.length - 1; i++) {
            let currentBlock = this.chain[i];
            let nextBlock = this.chain[i + 1];
            if (currentBlock.toHash().toString() !== nextBlock.toHash().toString()) {
                return false;
            }
        }
        return true;
    }
}


export default Blockchain;