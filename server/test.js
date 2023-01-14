/*const {Cart} = require('./Cart.js')
const {Product} = require('./Product.js')

var c = {"cartItems":[]};
var p = new Product(1,1,"lol",45); 
var d = new Product(1,1,"lol",45); 

c["nah"] = 0
console.log(c);

/*console.log(p.toJSON == d.toJSON);
console.log(JSON.stringify(p));
console.log(JSON.stringify(d));
console.log(p == d);*/

const { UsersDAO } = require("./UsersDAO.js");

var udao = new UsersDAO();
udao.addUser("george", "1234");
udao.updateUserSessionId("george","asdfas4");
console.log(udao.hasActiveSession("george","asdfas4"));
console.log(udao.getCartForUser("george"));