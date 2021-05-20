const SHA256 = require('crypto-js/sha256');

class MerkleTree {
    constructor() {
      this.blockHashes = [];
    }

    addHashToTree(tx) {
      this.blockHashes.push(tx);
    }

    getProof(index, layer = this.blockHashes, proof = []) {
      const newLayer = [];
      for (let i = 0; i < layer.length; i += 2) {
        let left = layer[i];
        let right = layer[i + 1];

        if (i === index) {
          if (right) {
            proof.push({
              data: right,
              left: false
            });
          }
        } else if (i + 1 === index) {
          proof.push({
            data: left,
            left: true
          });
        }

        right ? newLayer.push(SHA256(left, right)) : newLayer.push(left);
      }

      index = Math.floor(index / 2);
      if (newLayer.length === 1) {
        return proof;
      } else {
        return this.getProof(index, newLayer, proof);
      }
      
    }

    getRoot(layer = this.blockHashes) {
      if (layer.length === 1) return layer[0];
      const newLayer = [];

      for (let i = 0; i < layer.length; i += 2) {
        let left = layer[i];
        let right = layer[i + 1];
        right ? newLayer.push(SHA256(left, right)) : newLayer.push(left);
      }

      return this.getRoot(newLayer); 
    }
}

module.exports = MerkleTree;