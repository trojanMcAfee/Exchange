const EC = require('elliptic').ec;
const CryptoJS = require('crypto-js');
const bs58 = require('bs58');

const ec = new EC('secp256k1');

const keys = [];
const addressesAndKeys = [];
let addressAndKeys = {};
const addresses = [];

let key;
for (let i = 0; i < 3; i++) {
    key = ec.genKeyPair();
    let objKeys = {
        privateKey: key.getPrivate().toString(16),
        publicKeyX: key.getPublic().x.toString(16),
        publicKeyFull: key.getPublic().encode('hex')
    };
    keys.push(objKeys);
}


function getAddress(keys) {
    const { publicKeyX, privateKey, publicKeyFull } = keys;
    const y = publicKeyX.charAt(1);
    let publicX;
    if (y % 2 === 0 || y == 'a' || y == 'c' || y == 'e') {
        publicX = '02' + publicKeyX;
    } else {
        publicX = '03' + publicKeyX
    }

    const firstSHA = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(publicX));
    const ripemd = CryptoJS.RIPEMD160(firstSHA).toString();
    const networkBytes = '00' + ripemd;
    const secondSHA = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(networkBytes));
    const thirdSHA = CryptoJS.SHA256(secondSHA).toString();
    const checksum = thirdSHA.substring(0, 8);
    const binaryAddress = networkBytes + checksum;

    const bytes = Buffer.from(binaryAddress, 'hex');
    const btcAddress = bs58.encode(bytes);

    addressAndKeys.address = btcAddress;
    addresses.push(btcAddress);
    addressAndKeys.privateKey = privateKey;
    addressAndKeys.publicKey = publicKeyFull;
    addressesAndKeys.push(addressAndKeys);
    addressAndKeys = {};
}

keys.forEach(key => getAddress(key));


module.exports = {
    addressesAndKeys,
    addresses
};


