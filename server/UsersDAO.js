const {User} = require("./User.js");

class UsersDAO {

    #users;

    constructor(){
        this.#users = [];
        this.#users.push(new User("user1", "1234"));
        this.#users.push(new User("user2", "0000"));
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
}

module.exports = {UsersDAO};