const SHA256 = require('crypto-js/sha256');
const { providers: { JsonRpcProvider } } = require('ethers');


module.exports = {
    TARGET_DIFFICULTY: BigInt('0x00' + 'F'.repeat(62)),
    miner: {
        PUBLIC_KEY: '045fcb5371c5a4aa6befad0d66649264afea6c3ba8a862df89ac5b49d9cc5ffd707ed14e2aeed3d5c85c03a8f2346d39f70f3a67dcc0467536ea47706604135d5f',
        PRIVATE_KEY: '7e51e8bf53dad6d4d4e89c6eb7024d897d284610fa985412ce5c7e1ad098e30e',
        ADDRESS: '1KkDGKyMFQS7eqqeug865fPFesbGvKfPsi'
    },
    BLOCK_REWARD: function() {
        return SHA256('The new ETH' + (Math.floor(Math.random() * 100) + 1)).toString();
    },
    provider: new JsonRpcProvider('https://mainnet.infura.io/v3/ead605dd65704007ae941fffb7c1d1a7')
};