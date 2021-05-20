const Block = require('../models/Block');
const UTXO = require('../models/UTXO');
const Transaction = require('../models/Transaction');
const SHA256 = require('crypto-js/sha256');

const EC = require('elliptic').ec;


const ec = new EC('secp256k1');

const { TARGET_DIFFICULTY, miner, BLOCK_REWARD, provider } = require('../config');
const { merkleTree, blockchain } = require('../db');

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

  //Gets hash from last Ropstein block
  let previousRopsteinHash;
  let myBlockCount = 0;

  async function mineRopsteinBlock(startMining = true) {
    const blockNum = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNum);
    const hash = block.hash;

    if (startMining === false) {
      return hash;
    } else if (startMining && previousRopsteinHash !== hash) {
      previousRopsteinHash = hash;
      merkleTree.addHashToTree(hash);
      console.log(`Block #${myBlockCount}'s hash from Ropstein was added to the tree: `, merkleTree.blockHashes[merkleTree.blockHashes.length - 1]);
      myBlockCount++;
      blockchain.addBlock(hash); //Can cause interference with blockchain.addBlock()
    }
  }
  
  //Adds to chain
  async function addBlockToChain(lastBlock, hashedTx, blockchain) {
    if (lastBlock.isFull()) {
      
      const { id: { nextId }, hash } = mineMyBlock(lastBlock);
      const mixedHash = SHA256(await mineRopsteinBlock(false) + hash).toString();
      lastBlock.hash = mixedHash;
      merkleTree.addHashToTree(mixedHash);

      console.log(`Block #${myBlockCount} was mined with mixed hash ${mixedHash}`);
      myBlockCount++;
      const block = new Block(nextId);
      block.addTransaction(hashedTx);
      blockchain.addBlock(block);
    } else {
      lastBlock.addTransaction(hashedTx);
    }
  }

  function mineMyBlock(block) {
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
    
    return {
      id: block.id + 1,
      hash
    }
  }

  
  module.exports = {
      signTx,
      verifyTx,
      addBlockToChain,
      mineRopsteinBlock
  };