class Product {
    
    #id;
    #categoryId;
    #title;
    #cost;

    constructor(id, categoryId, title, cost){
        this.#id = id;
        this.#categoryId = categoryId;
        this.#title = title;
        this.#cost = cost;
    }
}

module.exports = {Product};