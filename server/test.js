const {Cart} = require('./Cart.js')
const {Product} = require('./Product.js')

var c = new Cart();
var p = new Product(1,1,"lol",45); 
var d = new Product(1,1,"lol",45); 

c.add(p);
c.add(d);
console.log(c.toJSON());

/*console.log(p.toJSON == d.toJSON);
console.log(JSON.stringify(p));
console.log(JSON.stringify(d));
console.log(p == d);*/