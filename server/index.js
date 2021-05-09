const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

const SHA256 = require('crypto-js/sha256');
const { signTx, verifyTx, addBlockToChain, blockchain } = require('./scripts/handleTx');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const { addressesAndKeys } = require('./keys');

//Set up initial addresses with their balances
const addresses = [];
addressesAndKeys.forEach(obj => addresses.push(obj.address));

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
  const hashedTx = SHA256(transaction);
  //Sign tx
  const signature = signTx(inputted_privateKey, hashedTx);
  //Verify signature
  const publicKey = addressesAndKeys.map(x => {
    if (sender === x.address) return x.publicKey
  });
  if (!verifyTx(hashedTx, signature, publicKey[0])) {
    console.log("You're not authorized to make this transaction");
    return;
  }
  //Adds to blockchain
  const lastBlock = blockchain.chain[blockchain.chain.length - 1];
  addBlockToChain(lastBlock, hashedTx);

  console.log('Transaction successful!');
  blockchain.isValid() ? console.log('valid chain') : console.log('invalid chain');
  console.log(blockchain);


  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log(addressesAndKeys);
});
