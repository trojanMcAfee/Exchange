import React, { useContext } from 'react';
import Context from '../Context';


function Wallet() {
    // const { ids, placeholders } = useContext(Context);

    return (
        <div className="wallet">
            <h1> Your Wallet </h1>
            <input type="text" id="exchange-address" placeholder="Your Address" />
            {/* <select id="exchange-address"></select> */}
            <div id="balance">
            0
            </div>
        </div>
    );
}


export default Wallet;