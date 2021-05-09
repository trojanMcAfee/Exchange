class UTXO {
    constructor(owner, coin) {
        this.owner = owner;
        this.coin = coin;
        this.spent = false;
    }
}


module.exports = UTXO;