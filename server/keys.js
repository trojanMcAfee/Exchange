const EC = require('elliptic').ec;
const CryptoJS = require('crypto-js');

const ec = new EC('secp256k1');

const keys = [];
let key;
for (let i = 0; i < 3; i++) {
    key = ec.genKeyPair();
    let objKeys = {
        privateKey: key.getPrivate().toString(16),
        publicKey: key.getPublic().encode('hex')
    };
    keys.push(objKeys);
}


function convertToAddress() {
    const firstSHA = CryptoJS.SHA256(keys.publicKey).toString();
    console.log('firstSha: ', firstSHA);
    const ripemd = CryptoJS.RIPEMD160(firstSHA).toString();
    console.log('ripemd: ', ripemd);
    const networkBytes = '00' + ripemd;
    console.log('networkBytes: ', networkBytes);
    const secondSHA = CryptoJS.SHA256(networkBytes).toString();
    console.log('secondSha: ', secondSHA);
    const thirdSHA = CryptoJS.SHA256(secondSHA).toString();
    console.log('thirdSha: ', thirdSHA);
    const checksum = thirdSHA.substring(0, 8);
    console.log('checksum: ', checksum);
    const binaryAddress = networkBytes + checksum;
    console.log('binaryAddress: ', binaryAddress);
}



module.exports.keys = keys;


