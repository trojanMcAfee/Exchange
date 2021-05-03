const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

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
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log(addressesAndKeys);
  // console.log('The balances: ', balances);
});
