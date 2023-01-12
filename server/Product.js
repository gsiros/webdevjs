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

    getId(){
        return this.#id;
    }

    getCatId(){
        return this.#categoryId;
    }

    getTitle(){
        return this.#title;
    }

    getCost(){
        return this.#cost;
    }

    toJSON(){
        return {
            "id" : this.#id,
            "categoryId": this.#categoryId,
            "title": this.#title,
            "cost": this.#cost
        };
    }

    equals(p){
        return (this.#id == p.getId()) && (this.#categoryId == p.getCatId()) && (this.#title == p.getTitle()) && (this.#cost == p.getCost());
    }
}

module.exports = {Product};