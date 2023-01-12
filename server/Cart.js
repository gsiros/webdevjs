class Cart {
    
    #cart;

    constructor(){
        this.#cart = new Map();
    }

    size(){
        var totalsize = 0;
        this.#cart.forEach(function (value, key) {
            totalsize += value;
        });
        return totalsize;
    }

    add(product){
        var productQuantity = this.#cart.get(product);
        if(!productQuantity){
            this.#cart.set(product, 1);
        } else {
            this.#cart.set(product, productQuantity+1);
        }    
    }
}

module.exports = {Cart};