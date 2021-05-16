import React from 'react';
const server = "http://localhost:3042";

export const Context = React.createContext(null);

export function Provider(props) {


    const getValue = (e, id) => {
        const value = e.target.value;
        if(value === "") {
            document.getElementById(id).innerHTML = 0;
            return;
          }
          
          fetch(`${server}/balance/${value}`).then((response) => {
            return response.json();
          }).then(({ balance }) => {
            document.getElementById("balance").innerHTML = balance;
          });
    }

    const handleAccountInteraction = () => {
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
    }

    const value = {
        actions: {
            getValue,
            handleAccountInteraction
        }
    };


    return(
        <Context.Provider value={value}>
            {props.children}
        </Context.Provider>
    );
}

