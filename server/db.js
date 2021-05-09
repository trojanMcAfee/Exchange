const Blockchain = require('./models/Blockchain');
const MerkleTree = require('./models/MerkleTree');


const db = {
    blockchain: new Blockchain(),
    merkleTree: new MerkleTree()
};


module.exports = db;