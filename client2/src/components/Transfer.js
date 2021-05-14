import React, { useContext } from 'react';
import { Context } from '../Context';

function Transfer() {
    // const { value } = useContext(Context);
    // console.log(value);

    return (
        <div className="send">
            <h1> Send Amount </h1>
            <input type="text" id="send-amount" placeholder="Send Amount" />
            <input type="text" id="private-key" placeholder="Private Key" />
            <input type="text" id="recipient" placeholder="Recipient" />
            <div className="button" id="transfer-amount">
                Transfer Amount
            </div>
        </div>
    );
}


export default Transfer;