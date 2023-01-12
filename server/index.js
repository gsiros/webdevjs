const express = require('express');
const path = require('path');
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const {User} = require("./User.js")
const {Product} = require("./Product.js");

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
        print("Login attempt: '" + username +"':'"+ password +"'");

        if (!isValidUser(username, password)){
            // User does not exist:
            res.sendStatus(401);
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            //res.json({"sessionId" : uuidv4()});
            const sessionId = uuidv4();
            updateUserSessionId(username, sessionId);
            res.end(JSON.stringify({"sessionId" : sessionId}));
            //res.end(`{"sessionId" : "${uuidv4()}"}`);
        }

    });


});

function updateUserSessionId(username, newSessionId){
    for (const user in dummyusers){
        if (dummyusers[user].getUsername() == username){
            dummyusers[user].setCurrentSessionId(newSessionId);
        }
    }
    return false;
}

function isValidUser(username, password){
    for (const user in dummyusers){
        if (dummyusers[user].getUsername() == username && dummyusers[user].getPassword() == password){
            return true;
        }
    }
    return false;
}

function hasActiveSession(username, sessionId){
    for (const user in dummyusers){
        if (dummyusers[user].getUsername() == username && dummyusers[user].getCurrentSessionId() == sessionId){
            return true;
        }
    }
    return false;
}

function addProductToUserCart(username, product){
    for (const user in dummyusers){
        if (dummyusers[user].getUsername() == username){
            dummyusers[user].cart().add(product);
            break;
        }
    }
}

function getCartSizeForUser(username){
    for (const user in dummyusers){
        if (dummyusers[user].getUsername() == username){
            return dummyusers[user].cart().size();
        }
    }
    return null;
}

function getCartForUser(username){
    for (const user in dummyusers){
        if (dummyusers[user].getUsername() == username){
            return dummyusers[user].cart().toJSON();
        }
    }
    return null;
}

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

        // TODO: check if user has an active session...
        if (!hasActiveSession(username, sessionId)){
            // No active session found:
            res.sendStatus(401);
        } else {
            addProductToUserCart(username, new Product(productId, categoryId, title, cost));
            console.log(getCartForUser(username));
            res.sendStatus(200);
        }

        print("'" + username +"'@'"+ sessionId +"' adding Product(id: "+productId+", catId: "+categoryId+", title:'"+title+"', cost:" +cost+ ") to their cart.");

    });

});

app.post("/cartsize", function (req,res) {
    const form = new formidable.IncomingForm();
    
    form.parse(req, function (err, fields, files) {
        var username = fields["username"];
        var sessionId = fields["sessionId"];
        if (!hasActiveSession(username, sessionId)){
            // User does not exist:
            print("UNAUTHORIZED: Cart size for: '" + username +"':'"+ sessionId +"'");
            res.sendStatus(401);
        } else {
            
            var size = getCartSizeForUser(username);
            if (size != null){
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({"size" : size}));
                print("Requesting Cart size for: '" + username +"':'"+ sessionId +"'");
            } else {
                print("NOTFOUND: Cart size for: '" + username +"':'"+ sessionId +"'");
                res.sendStatus(404);
            }
        }
    });
    
});

app.post("/cart", function (req,res) {
    const form = new formidable.IncomingForm();
    
    form.parse(req, function (err, fields, files) {
        var username = fields["username"];
        var sessionId = fields["sessionId"];
        if (!hasActiveSession(username, sessionId)){
            // User does not exist:
            print("UNAUTHORIZED: Cart size for: '" + username +"':'"+ sessionId +"'");
            res.sendStatus(401);
        } else {
            var jsonCart = getCartForUser(username);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jsonCart));
            print("Requesting Cart for: '" + username +"':'"+ sessionId +"'");
        }
    });
    
});

app.listen(4321, () => {
    print('Server listening on port 4321...');
});