const EC = require('elliptic').ec;
const CryptoJS = require('crypto-js');

const ec = new EC('secp256k1');

const key = ec.genKeyPair();

const keys = {
    privateKey: key.getPrivate().toString(16),
    publicKey: key.getPublic().encode('hex')
};

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

const message = 'test message';
const msgHash = CryptoJS.SHA256(message).toString();
const signature = key.sign(msgHash);
console.log(key.verify(msgHash, signature));

module.exports.keys = keys;


