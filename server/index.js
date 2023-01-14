const express = require('express');
const path = require('path');
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const {User} = require("./User.js")
const {Product} = require("./Product.js");
const {UsersDAO} = require("./UsersDAO.js");

var udao = new UsersDAO();

const dummyusers = [
    new User("user1", "1234"),
    new User("user2", "0000")
];

function print(something){
    var now = new Date();
    console.log(now.toLocaleTimeString() + ": " +something);
}

const app = express()
app.use(express.static(path.join(__dirname, '../client')));

app.get('/', function (req, res) {
    print("Index page requested...");
    res.sendFile('index.html');
});

app.post('/login', function(req, res) {
    const form = new formidable.IncomingForm();
    
    // Parse incoming user data:
    form.parse(req, function(err, fields, files) {
        if (err != null) {
            print(err)
            // Send error status; BAD LOGIN CRED.
            return res.status(400).json({ message: err.message });
        }

        var username = fields["username"];
        var password = fields["password"];
        
        var u = udao.getUser(username);
        if (!u || !u.passwordMatch(password)){
            // User does not exist:
            print("(FAIL) Login attempt: '" + username +"':'"+ password +"'");
            res.sendStatus(401);
        } else {
            print("(SUCCESS) Login attempt: '" + username +"':'"+ password +"'");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            //res.json({"sessionId" : uuidv4()});
            const sessionId = uuidv4();
            u.updateSessionId(sessionId);
            res.end(JSON.stringify({"sessionId" : sessionId}));
            //res.end(`{"sessionId" : "${uuidv4()}"}`);
        }

    });


});

app.post("/addToCart", function (req, res) {
    const form = new formidable.IncomingForm();
    
    // Parse incoming user data:
    form.parse(req, function(err, fields, files) {
        
        if (err != null) {
            print(err)
            // Send error status;
            return res.status(404).json({ message: err.message });
        }

        var username = fields["username"];
        var sessionId = fields["sessionId"];
        var productId = fields["productId"];
        var categoryId = fields["categoryId"];
        var title = fields["title"];
        var cost = fields["cost"];

        var u = udao.getUser(username);
        if (!u || !u.sessionIdMatch(sessionId)){
            // No active session found:
            res.sendStatus(401);
        } else {
            u.cart().add(new Product(productId, categoryId, title, cost));
            res.sendStatus(200);
            print("'" + username +"'@'"+ sessionId +"' adding Product(id: "+productId+", catId: "+categoryId+", title:'"+title+"', cost:" +cost+ ") to their cart.");
        }


    });

});

app.post("/cartsize", function (req,res) {
    const form = new formidable.IncomingForm();
    
    form.parse(req, function (err, fields, files) {
        var username = fields["username"];
        var sessionId = fields["sessionId"];

        var u = udao.getUser(username);
        if (!u || !u.sessionIdMatch(sessionId)){
            // User does not exist:
            print("UNAUTHORIZED: Cart size for: '" + username +"':'"+ sessionId +"'");
            res.sendStatus(401);
        } else {
            var size = u.cart().size();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({"size" : size}));
            print("Requesting Cart size for: '" + username +"':'"+ sessionId +"'");
        }
    });
    
});

app.post("/cart", function (req,res) {
    const form = new formidable.IncomingForm();
    
    form.parse(req, function (err, fields, files) {
        var username = fields["username"];
        var sessionId = fields["sessionId"];

        var u = udao.getUser(username);
        if (!u || !u.sessionIdMatch(sessionId)){
            // User does not exist:
            print("UNAUTHORIZED: Cart size for: '" + username +"':'"+ sessionId +"'");
            res.sendStatus(401);
        } else {
            var jsonCart = u.cart().toJSON();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jsonCart));
            print("Requesting Cart for: '" + username +"':'"+ sessionId +"'");
        }
    });
    
});

app.listen(4321, () => {
    print('Server listening on port 4321...');
});

