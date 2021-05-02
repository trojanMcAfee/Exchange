const EC = require('elliptic').ec;
const CryptoJS = require('crypto-js');
const bs58 = require('bs58');

const ec = new EC('secp256k1');

const keys = [];
let key;
for (let i = 0; i < 3; i++) {
    key = ec.genKeyPair();
    let objKeys = {
        privateKey: key.getPrivate().toString(16),
        publicKey: key.getPublic().x.toString(16),
        // publicKey: key.getPublic().encode('hex')
    };
    keys.push(objKeys);
}


function getAddress(publicKey) {

    const y = publicKey.charAt(1);
    let publicX;
    if (y % 2 === 0 || y == 'a' || y == 'c' || y == 'e') {
        publicX = '02' + publicKey;
    } else {
        publicX = '03' + publicKey
    }

    const firstSHA = CryptoJS.SHA256(publicX);
    const ripemd = CryptoJS.RIPEMD160(firstSHA).toString();
    const networkBytes = '00' + ripemd;
    const secondSHA = CryptoJS.SHA256(networkBytes);
    const thirdSHA = CryptoJS.SHA256(secondSHA).toString();
    const checksum = thirdSHA.substring(0, 8);
    const binaryAddress = networkBytes + checksum;

    const bytes = Buffer.from(binaryAddress, 'hex');
    const btcAddress = bs58.encode(bytes);

    console.log('This is the BTC address: ', btcAddress);

}

keys.forEach(key => getAddress(key.publicKey));



module.exports.keys = keys;


