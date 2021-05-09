import "./index.scss";
const { blockchain } = require('../server/scripts/handleTx');
// const { addresses } = require('../server/keys');

const server = "http://localhost:3042";

// const selectAddresses = document.getElementById('exchange-address');
// const defaultOp = document.createElement('option');
// defaultOp.innerHTML = '**** Select an address to transfer to ****'
// defaultOp.value = '**** Select an address to transfer to ****';
// selectAddresses.appendChild(defaultOp);
// addresses.forEach(address => {
//   const option = document.createElement('option');
//   option.innerHTML = address;
//   option.value = address;
//   selectAddresses.appendChild(option);
// })

document.getElementById("exchange-address").addEventListener('change', ({ target: {value} }) => {
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
  const inputted_privateKey = document.getElementById('private-key').value;
  const sender = document.getElementById("exchange-address").value;
  // const sender = selectAddresses.options[selectAddresses.selectedIndex].value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;

  const transaction = {
    from: sender,
    amount,
    to: recipient
  };
  
  const body = JSON.stringify({
    sender, amount, recipient, transaction, inputted_privateKey
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance, authorized, message, isValidChain, blockchain }) => {
    if (authorized) {
      document.getElementById("balance").innerHTML = balance;
      console.log('It is a valid chain: ', isValidChain);
      console.log(blockchain);
    } else {
      alert(message);
    }
  }).catch(err => {
    console.error(err);
  });
});
