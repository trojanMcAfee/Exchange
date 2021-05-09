const Block = require('../Block');

const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

const TARGET_DIFFICULTY = BigInt('0x00' + 'F'.repeat(62));

//Sign a transaction
function signTx(privateKey, hashedTx) {
    const key = ec.keyFromPrivate(privateKey);
    const signature = key.sign(hashedTx.toString());
  
    return {
      r: signature.r.toString(16),
      s: signature.s.toString(16)
    }
  }
  
  //Verify a transaction
  function verifyTx(hashedTx, signature, publicKey) {
    const key = ec.keyFromPublic(publicKey, 'hex');

    return key.verify(hashedTx.toString(), signature);
  }
  
  //Adds to chain
  function addBlockToChain(lastBlock, hashedTx, blockchain) {
    if (lastBlock.isFull()) {
      mine(lastBlock);
      const block = new Block();
      block.addTransaction(hashedTx);
      blockchain.addBlock(block);
    } else {
      lastBlock.addTransaction(hashedTx);
    }
  }

  function mine(block) {
    let hash;
    while(true) {
      hash = block.toHash();
      if (BigInt('0x' + hash) < TARGET_DIFFICULTY) break;
      block.nonce++;
    }
    block.hash = hash;
  }

  
  module.exports = {
      signTx,
      verifyTx,
      addBlockToChain
  };