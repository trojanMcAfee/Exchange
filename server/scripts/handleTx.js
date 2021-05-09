import Block from '../Block';
import Blockchain from '../Blockchain';

const EC = require('elliptic').ec;

const ec = new EC('secp256k1');


const blockchain = new Blockchain();


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
  function addBlockToChain(lastBlock, hashedTx) {
    if (lastBlock.isFull()) {
      const block = new Block();
      block.addTransaction(hashedTx);
      blockchain.addBlock(block);
    } else {
      lastBlock.addTransaction(hashedTx);
    }
  }

  
  module.exports = {
      signTx,
      verifyTx,
      addBlockToChain,
      blockchain
  };