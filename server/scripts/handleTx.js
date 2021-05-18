const Block = require('../models/Block');
const UTXO = require('../models/UTXO');
const Transaction = require('../models/Transaction');

const EC = require('elliptic').ec;


const ec = new EC('secp256k1');

const { TARGET_DIFFICULTY, miner, BLOCK_REWARD, provider } = require('../config');

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
  async function addBlockToChain(lastBlock, hashedTx, blockchain) {

    const blockNum = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNum);
    const lastBlockHash = block.hash; //mix the hash of the last block with the hash of my block

    if (lastBlock.isFull()) {
      const nextId = mine(lastBlock);
      console.log(`Block #${lastBlock.id} was mined with hash ${lastBlock.hash}`);
      const block = new Block(nextId);
      block.addTransaction(hashedTx);
      blockchain.addBlock(block);
    } else {
      lastBlock.addTransaction(hashedTx);
    }
  }

  function mine(block) {
    let hash;

    const coinbaseUTXO = new UTXO(miner.ADDRESS, BLOCK_REWARD());
    const coinbaseTX = new Transaction([], [coinbaseUTXO]);
    block.addTransactionUTXO(coinbaseTX);
    console.log(coinbaseTX);

    while(true) {
      hash = block.toHash();
      if (BigInt('0x' + hash) < TARGET_DIFFICULTY) break;
      block.nonce++;
    }
    block.hash = hash;
    return block.id + 1;
  }

  
  module.exports = {
      signTx,
      verifyTx,
      addBlockToChain
  };