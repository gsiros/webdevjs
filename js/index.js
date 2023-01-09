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

// For index.html 

function loadCategories()  {
    console.log("ratio");
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
    getProducts(categoryID).then(prods => {
        for(var i=0; i<prods.length; i++){
            console.log(`Appending product No.${i+1}..`);
            loadProductTemplate(prods[i]);
        }
    });
}

function loadProductTemplate(prod){
    var template = Handlebars.compile(document.querySelector("#productTemplate").innerHTML);
    var filled = template(prod);
    var section = document.createElement("section");
    section.className = "icategory";
    section.innerHTML = filled;
    document.getElementById("productsContainer").append(section);
}