const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

const SHA256 = require('crypto-js/sha256');
const { signTx, verifyTx, addBlockToChain } = require('./scripts/handleTx');

const { blockchain, merkleTree } = require('./db');

app.use(cors());
app.use(express.json());

const { addressesAndKeys, addresses } = require('./keys');

//Set up initial addresses with their balances
const balances = {};
const initialBalances = [100, 50, 75];
initialBalances.forEach((balance, i) => balances[addresses[i]] = balance);

//Routes
app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { sender, recipient, amount, transaction, inputted_privateKey } = req.body;
  const hashedTx = SHA256(transaction + Date.now());
  //Sign tx
  const signature = signTx(inputted_privateKey, hashedTx);
  //Verify signature
  const publicKey = addressesAndKeys.map(x => {
    if (sender === x.address) return x.publicKey
  });

  if (!verifyTx(hashedTx, signature, publicKey[0])) {
    res.send({
      message: "You're not authorized to make this transaction",
      authorized: false
    }).end();
    return;
  }
  //Adds to blockchain and Merkle Tree
  const lastBlock = blockchain.chain[blockchain.chain.length - 1];
  merkleTree.addTransaction(hashedTx.toString());
  addBlockToChain(lastBlock, hashedTx, blockchain);
  console.log(merkleTree);
  const isValidChain = blockchain.isValid();

  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({
    balance: balances[sender],
    authorized: true,
    isValidChain,
    blockchain
  });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log(addressesAndKeys);
});
