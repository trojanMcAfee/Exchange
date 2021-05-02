import "./index.scss";
import Block from '../server/Block';
import Blockchain from '../server/Blockchain';

const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');

const ec = new EC('secp256k1');

const server = "http://localhost:3042";

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
function verifyTx(hashedTx, signature, sender) {
  const key = ec.keyFromPublic(sender, 'hex');

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


document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }
  
  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});



document.getElementById("transfer-amount").addEventListener('click', () => {
  const privateKey = prompt('Sign the transaction using your Private Key');

  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;

  //Hash tx
  const transaction = {
    from: sender,
    amount,
    to: recipient
  };
  const hashedTx = SHA256(transaction);
  
  //Sign tx
  const signature = signTx(privateKey, hashedTx);

  //Verify signature
  if (!verifyTx(hashedTx, signature, sender)) {
    alert("You're not authorized to make this transaction");
    return;
  }

  //Adds to blockchain
  const lastBlock = blockchain.chain[blockchain.chain.length - 1];
  addBlockToChain(lastBlock, hashedTx);

  const body = JSON.stringify({
    sender, amount, recipient
  });


  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
  
  alert('Transaction successful!');
  blockchain.isValid() ? console.log('valid chain') : console.log('invalid chain');
  console.log(blockchain);
});
