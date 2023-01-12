const {Cart} = require("./Cart.js");

class User {
    #username;
    #password;
    #currSessionId;
    #cart;

    constructor(username, password) {
        this.#username = username;
        this.#password = password;
        this.#currSessionId = null;
        this.#cart = new Cart();
    }

    getUsername(){
        return this.#username;
    }

    getPassword(){
        return this.#password;
    }

    getCurrentSessionId(){
        return this.#currSessionId;
    }

    setCurrentSessionId(sessionId){
        this.#currSessionId = sessionId;
    }

    cart(){
        return this.#cart; 
    }
}

module.exports = {User};