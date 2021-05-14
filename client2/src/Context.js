import React, { useState } from 'react';

export const Context = React.createContext();

export function Provider(props) {

    // const [ value, setValue ] = useState({
    //     ids: { 
    //             0: 'wallet',
    //             1: 'transfer',
    //             2: 'locking',
    //             3: 'explorer',
    //             4: 'verify'
    //         },
    //         placeholders: {
    //             0: "Send Amount",
    //             1: "Private Key",
    //             2: "Recipient"
    //         }
    // });

    
    // const value = {
    //     ids: {
    //         0: 'wallet',
    //         1: 'transfer',
    //         2: 'locking',
    //         3: 'explorer',
    //         4: 'verify'
    //     },
    //     placeholders: {
    //         0: "Send Amount",
    //         1: "Private Key",
    //         2: "Recipient"
    //     }
    // };

    const ids =[
        'send-amount',
        'private-key',
        'recipient'
    ]

    const placeholders = [
        "Send Amount",
        "Private Key",
        "Recipient"
    ]

    // const hi = 'hi';


    return(
        <Context.Provider value={{ids, placeholders}}>
            {props.children}
        </Context.Provider>
    );
}