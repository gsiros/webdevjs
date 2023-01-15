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

const uri = "mongodb+srv://client:client@gscluster.jrrwvtn.mongodb.net/?retryWrites=true&w=majority";

const {Log} = require("./Log.js");
const { Product } = require("./Product.js");
const { User } = require("./User.js");

async function run2(){
    var l = new Log(uri);
    await l.addUser("user1","1234");
    await l.addUser("user2","0000");
    await l.addUser("bzafeiris","webdev");
    //await l.addProduct("cookoo", new Product(2,2,"gayz",23));
    //await l.incrProduct("ngasd1", new Product(2,2,"gayz",23));
    //return await l.fetchCart("tom");
    //var carts = await l.fetchAllCarts();
    return await l.load();
}  

run2().then((res => {
    console.log(res.length, res[1].getUsername(), res[1].cart().toJSON());
}));
//var pjson = {"id":1, "categoryId":1, "title":"eheheh", "cost": 42};
//console.log(Product.fromJSON(pjson))