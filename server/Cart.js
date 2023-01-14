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
        var prodJSON = JSON.stringify(product.toJSON());
        var productQuantity = this.#cart.get(prodJSON);
        if(!productQuantity){
            this.#cart.set(prodJSON, 1);
        } else {
            this.#cart.set(prodJSON, productQuantity+1);
        }    
    }

    #calculateCost(){
        var totalCost = 0;
        this.#cart.forEach(function (value, key) {
            var prod = JSON.parse(key);
            totalCost += parseInt(prod["cost"])*parseInt(value);
        });
        return totalCost;
    }

    toJSON(){
        var jsonCart = {
            "cartItems":[],
            "totalCost": this.#calculateCost()
        };
        
        this.#cart.forEach(function (value, key) {
            var prod = JSON.parse(key);
            jsonCart["cartItems"].push({
                "title" : prod["title"],
                "cost": prod["cost"],
                "quantity": value
            });
        });

        return jsonCart;

    }
}

module.exports = {Cart};