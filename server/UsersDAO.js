const {User} = require("./User.js");

class UsersDAO {

    #users;

    constructor(){
        this.#users = [];
    }

    addUser(user){
        this.#users.push(user);
    }

    getUser(username) {
        for (const user in this.#users){
            if (this.#users[user].getUsername() == username){
                return this.#users[user];
            }
        }
        return null;
    }

    load(usrs){
        this.#users = usrs;
    }
}

module.exports = {UsersDAO};