const {MongoClient} = require("mongodb");
const {User} = require("./User.js");
const {Product} = require("./Product.js");

class Log {
    
    #uri
    #client

    constructor(URI){
        this.#uri = URI;
    }

    async fetchAllUsers(){
        var res = undefined;
        this.#client = new MongoClient(this.#uri);
        const database = this.#client.db('userdb');
        const coll = database.collection('users');

        res = await coll.find().toArray();
        await this.#client.close();

        return res;
    }

    async load(){
        var users = []

        this.#client = new MongoClient(this.#uri);
        var carts = await this.fetchAllUsers();
        for (const cart in carts){
            var us = new User(carts[cart]["username"], carts[cart]["password"]);
            carts[cart]["products"].forEach(element => {
                us.cart().add(Product.fromJSON(element));
            });
            users.push(us);
        }
        await this.#client.close();
        
        return users;
    }

    async fetchUser(usr){
        var res = udnefined;
        
        this.#client = new MongoClient(this.#uri);

        const database = this.#client.db('userdb');
        const coll = database.collection('users');

        res = await coll.findOne({ username: usr });
        
        await this.#client.close();
        
        return res;
    }

    async addUser(usr, pswd){
        this.#client = new MongoClient(this.#uri);
        const database = this.#client.db('userdb');
        const coll = database.collection('users');
        await coll.insertOne({
            username: usr,
            password: pswd,
            products: [] 
        });
        await this.#client.close();
    }

    async addProduct(usr, product){
        this.#client = new MongoClient(this.#uri);
        const database = this.#client.db('userdb');
        const coll = database.collection('users');

        await coll.updateOne(
            { 
                username: usr
            },
            { $push: { 'products': product.toJSON()}}
        );
        await this.#client.close();
    }

}

module.exports = {Log};