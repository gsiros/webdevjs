var products = []
var currSessionId = null;
var currUsername = null;

/**
 * Makes GET request to the remote server to fetch the categories.
 * 
 * @returns categories JSON metadata
 */
async function getCategories(){
    var data = await fetch('https://wiki-shop.onrender.com/categories');
    if (!data.ok) {
        throw Error(data.status);
    }
    return data.json();
}

/**
 * Makes GET request to the remote server to fetch the subcategories of given
 * category.
 * 
 * 
 * @param {*} id the id of target category
 * @returns subcategories that correspond to category with given id. 
 */
async function getSubCategories(id){
    var data = await fetch(`https://wiki-shop.onrender.com/categories/${id}/subcategories`);
    if (!data.ok) {
        throw Error(data.status);
    }
    return data.json();
}

/**
 * Makes GET request to the remote server to fetch all the products that fall
 * under the same *target* category that corresponds to the given id.
 * 
 * @param {*} id the id of target category
 * @returns the products that fall into the target category
 */
async function getProducts(id){
    var data = await fetch(`https://wiki-shop.onrender.com/categories/${id}/products`);
    if (!data.ok) {
        throw Error(data.status);
    }
    return data.json();
}

function getLocalProduct(id){
    for(const prd in products){
        if(products[prd]["id"] == id){
            return products[prd];
        }
    }
    return null;
}

// For index.html 

function loadCategories()  {
    getCategories().then(cats => {
        for (var i=0; i<cats.length; i++) {
            console.log(`Appending category template No.${i+1}..`);
            loadCategoryTemplate(cats[i]);
        }
    });
}

function loadCategoryTemplate(cat) {
    var template = Handlebars.compile(document.querySelector("#categoryTemplate").innerHTML);
    var filled = template(cat);
    var section = document.createElement("section");
    section.className = "icategory";
    section.innerHTML = filled;
    document.getElementById("categoryContainer").append(section);
}

// For category.html

function loadProducts(){
    var url = new URL(window.location.href); 
    var categoryID = url.searchParams.get('categoryId'); 

    getSubCategories(categoryID).then(subcats => {
        loadFilterChoices({
            subcategs: subcats
        });
    });

    getProducts(categoryID).then(prods => {
        for(var i=0; i<prods.length; i++){
            console.log(`Appending product No.${i+1}..`);
            products.push(prods[i]);
            console.log(`Products size ${products.length}..`);
            loadProductTemplate(prods[i]);
        }
    });
}

function loadFilterChoices(subcategories) {
    var template = Handlebars.compile(document.querySelector("#subcatFilterTemplate").innerHTML);
    var filled = template(subcategories);
    document.getElementById("filtersContainer").innerHTML = filled;
}

function filter(){
    var radButs = document.getElementsByName('filterRad');
  
    for(i = 0; i < radButs.length; i++) {
        if(radButs[i].checked){
            document.getElementById("productsContainer").innerHTML = null;
            for(var j=0; j<products.length; j++){
                if(radButs[i].value == "0" || radButs[i].value == products[j]["subcategory_id"]){
                    loadProductTemplate(products[j]);
                }
            }
            break;
        }
    }
}

function loadProductTemplate(prod){
    var template = Handlebars.compile(document.querySelector("#productTemplate").innerHTML);
    var filled = template(prod);
    var section = document.createElement("section");
    section.className = "icategory";
    section.innerHTML = filled;
    document.getElementById("productsContainer").append(section);
}

// User Login

function login(){


    var username = document.getElementById("usernameInput").value;
    var password = document.getElementById("usrpswdInput").value;

    if (username == "" || password == ""){
        alert("Username or Password field is empty. Please fill out the fields and try again.");
        return;
    }

    currUsername = username;
    var userdata = new FormData();
    userdata.append("username", username);
    userdata.append("password", password);

    fetch("http://localhost:4321/login", {
        method: 'post',
        body: userdata,
    })
    .then(response => {
        if(response.status == 401){
            alert("Invalid credentials! Try again...");
        } else {
            return response.text();
        }
    })
    .then(data => {
        // Store uid:
        var resJson = JSON.parse(data);
        currSessionId = resJson["sessionId"];
        
        var loginforma = document.getElementsByClassName("loginform")[0];
        loginforma.style.display = "none";

        var greetmessagecontainer = document.getElementsByClassName("greetusercontainer")[0];
        greetmessagecontainer.style.display = "flex";

        var greetmessage = document.getElementById("greetmessage");
        greetmessage.innerHTML = `Hello, <b>${currUsername}</b>.`;

        getCartSize();
    });


}

function logout(){
    currSessionId = null;
    currUsername = null;

    document.getElementById("usernameInput").value = "";
    document.getElementById("usrpswdInput").value = "";
    
    var greetmessagecontainer = document.getElementsByClassName("greetusercontainer")[0];
    greetmessagecontainer.style.display = "none";

    var loginforma = document.getElementsByClassName("loginform")[0];
    loginforma.style.display = "flex";

    var greetmessage = document.getElementById("greetmessage");
    greetmessage.innerHTML = "";
}

function addToCart(element, productId) {

    if (!currUsername || !currSessionId){
        alert("Please login before adding items to cart.");
        return;
    }

    var url = new URL(window.location.href); 
    var categoryID = url.searchParams.get('categoryId'); 

    const prd = getLocalProduct(productId);

    var userdata = new FormData();
    userdata.append("username", currUsername);
    userdata.append("sessionId", currSessionId);
    userdata.append("productId", productId);
    userdata.append("categoryId", categoryID);
    userdata.append("title", prd["title"]);
    userdata.append("cost", prd["cost"]);
    

    fetch("http://localhost:4321/addToCart", {
        method: 'post',
        body: userdata,
    })
    .then(res => {
        if(res.status == 401){
            alert("Unauthorized.");
        } else if(res.status == 200) {
            // If OK, increase cart counter.
            let cartcounter = document.getElementsByClassName("cartcounter")[0];
            cartcounter.innerHTML = parseInt(cartcounter.innerHTML) + 1;

            const hiddenElement = element.nextElementSibling;
            hiddenElement.style.display = "inline-block";
            setTimeout(function (){
                hiddenElement.style.display = "none";
            }, 3000);
            return res.text();
        } else {
            return null;
        }
    })
    .then(data => {
        console.log(data);
    });


}

function getCartSize() {
    var userdata = new FormData();
    userdata.append("username", currUsername);
    userdata.append("sessionId", currSessionId);

    fetch("http://localhost:4321/cartsize", {
        method: 'post',
        body: userdata,
    })
    .then(res => {
        if(res.status == 401){
            alert("Unauthorized.");
        } else if(res.status == 404) {
            alert("User not found.")
        } else if(res.status == 200) {
            // If OK, increase cart counter.
            return res.text();
        } else {
            return null;
        }
    })
    .then(data => {
        var dataJSON = JSON.parse(data);
        let cartcounter = document.getElementsByClassName("cartcounter")[0];
        cartcounter.innerHTML = parseInt(dataJSON["size"]);
    });
}

function loadCart(){

    var url = new URL(window.location.href); 
    var username = url.searchParams.get('username'); 
    var sessionId = url.searchParams.get('sessionId'); 

    var userdata = new FormData();
    userdata.append("username", username);
    userdata.append("sessionId", sessionId);

    fetch("http://localhost:4321/cart", {
        method: 'post',
        body: userdata,
    })
    .then(res => {
        if(res.status == 401){
            alert("Unauthorized.");
        } else if(res.status == 404) {
            alert("User not found.")
        } else if(res.status == 200) {
            // If OK,
            return res.text();
        } else {
            return null;
        }
    })
    .then(data => {
        var jsonCart = JSON.parse(data);
        loadCartItems(jsonCart);
        calculateCost(jsonCart);
    });
}

function calculateCost(cart){
    var totalCost = cart["totalCost"];
    let costTextBox = document.getElementById("totalCostNumber");
    costTextBox.innerHTML = "$"+totalCost;
}

function loadCartItems(cart){
    var template = Handlebars.compile(document.querySelector("#cartItemsTemplate").innerHTML);
    var filled = template(cart);
    var table = document.getElementsByClassName("cartitems")[0];
    table.innerHTML = filled;
}

function goToCart(){
    window.location = `/cart.html?username=${currUsername}&sessionId=${currSessionId}`;
}