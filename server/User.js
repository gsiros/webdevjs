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
    }sx

    getPassword(){
        return this.#password;
    }

    getCurrentSessionId(){
        return this.#currSessionId;
    }

    updateSessionId(sessionId){
        this.#currSessionId = sessionId;
    }

    passwordMatch(password){
        return this.#password == password;
    }

    sessionIdMatch(sessionId){
        return this.#currSessionId == sessionId;
    }

    cart(){
        return this.#cart; 
    }
}

module.exports = {User};