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
