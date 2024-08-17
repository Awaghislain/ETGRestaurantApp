
// a decommanter dans un nouveau navogateur----------------------------{

// let products = [
//     {
//         id: 154,
//         name: "White beans",
//         image: "../IMG-20240723-WA0003.jpg",
//         stock: 4,
//         cooktime: 15,
//         price: 5000,
//     },
//     {
//         id: 155,
//         name: "Ndole",
//         image: "../ndule.jpg",
//         stock: 6,
//         cooktime: 15,
//         price: 5000,
//     },
//     {
//         id: 156,
//         name: "Eru",
//         image: "../eru.jpg",
//         stock: 8,
//         cooktime: 30,
//         price: 3000,
//     },
//     {
//         id: 157,
//         name: "Katikati",
//         image: "../katikati.jpg",
//         stock: 2,
//         cooktime: 30,
//         price: 5000,
//     },
//     {
//         id: 158,
//         name: "Fried Rice",
//         image: "../friedrice.jpg",
//         stock: 2,
//         cooktime: 10,
//         price: 500,
//     },
// ];

// localStorage.setItem("products", JSON.stringify(products))

// ------------------------------------------------------------------}


// a commenter lorsqu'on est dans un nouveau navigateur--------------------------{
let products = []
let editProductId;
function getProductsFormDb() {
    fetch("https://gestionnairedecommande-default-rtdb.firebaseio.com/products.json")
        .then((reponse) => reponse.json())
        .then((data) => {
            const dbProducts = []
            for (const key in data) {
                const tranformedItems = {
                    ...data[key],
                    id: key
                }
                dbProducts.push(tranformedItems)
            }
            products = dbProducts
            displayProducts(products)

        }).catch((error) => {

        })
}
getProductsFormDb()
//-------------------------------------------------------------------------------}

//Permet d'afficher le tableau avec ses caracteristique dans la page administrateur
function displayProducts(productsItems) {
    const tablebody = document.getElementById("tablebody")
    tablebody.innerHTML = ""
    for (let item of productsItems) {
        const tablerow = document.createElement("tr")
        tablerow.innerHTML = `<td> <img class="imgplat1" src="${item.image}"></td>
                        <td>${item.name}</td>
                        <td>${item.price}FCFA</td>
                        <td>${item.stock}</td>
                        <td>${item.cooktime} min</td>
                        <td>
                        <div style ="display: flex; gap:0.5rem">
                        <div style = "cursor:pointer; font-size:1rem" onclick = "showForm('${item.id}')"><i class="fa-solid fa-pen"></i></div>
                        <div style = "cursor:pointer; font-size:1rem" onclick = "deleteProducts('${item.id}')"><i class="fa-solid fa-trash-can"></i></div>
                        </div>
                        </td>
                        `
        tablebody.appendChild(tablerow)

        //Permet de recuperer l'objet produit dans la base de donner
        localStorage.setItem("products", JSON.stringify(productsItems))
    }
}

displayProducts(products)

//Permet l'affichage ou non du formulaire
function displayForm() {
    const containerRight = document.getElementById("containerRight")
    const displayFormBtn = document.getElementById("displayFormBtn")

    if (containerRight.style.display === "none") {
        displayFormBtn.innerHTML = "Close"
        containerRight.style.display = "block"
        displayFormBtn.style.backgroundColor = "red"
    } else {
        containerRight.style.display = "none"
        displayFormBtn.innerHTML = "Open"
        displayFormBtn.style.backgroundColor = "blue"
    }
}

//Permet de save les donner qui sont saisie dans le formulaire et d'effacer le formulaire apres avoir save  
function saveProduct() {
    const image = document.getElementById("image")
    const price = document.getElementById("price")
    const name = document.getElementById("name")
    const stock = document.getElementById("stock")
    const cooktime = document.getElementById("cooktime")

    if (image.value === "" || price.value === "" || name.value === "" || stock.value === "" || cooktime.value === "") {
        alert("invalid form input")
        return
    }

    const newProduct = {
        name: name.value,
        image: image.value,
        stock: stock.value,
        cooktime: cooktime.value,
        price: price.value,
    }



    //Pour le back-end
    fetch("https://gestionnairedecommande-default-rtdb.firebaseio.com/products.json", {
        method: "POST",
        body: JSON.stringify(newProduct)
    }).then((reponse) => {
        console.log(reponse)
        if (reponse.ok) {
            products.push(newProduct)

            displayProducts(products)
            emptyForm()
        } else {
            alert("error1")
        }
    }).catch((error) => {
        alert("error")
    })
}

// Delete products 
function deleteProducts(productId) {

    // localStorage.setItem("products", JSON.stringify(products))

    fetch(`https://gestionnairedecommande-default-rtdb.firebaseio.com/products/${productId}.json`, {
        method: "DELETE",
    }).then((reponse) => {
        console.log(reponse)
        if (reponse.ok) {
            const updateProduct = products.filter((product) => {
                return product.id !== productId
            });
            products = updateProduct
            displayProducts(updateProduct);
        } else {
            alert("error1")
        }
    }).catch((error) => {
        alert("error")
    })
}


//  Edit products
function showForm(productId) {
    editProductId = productId
    const product = products.find((product) => {
        return product.id === productId
    })
    document.getElementById("editbutton").style.display = "block"
    document.getElementById("savebutton").style.display = "none"

    console.log(product)

    document.getElementById("containerRight").style.display = "block"
    document.getElementById("name").value = product.name
    document.getElementById("price").value = product.price
    document.getElementById("stock").value = product.stock
    document.getElementById("cooktime").value = product.cooktime
    document.getElementById("image").value = product.image
}

//Permet de vider le contenu du formulaire
function emptyForm() {
    document.getElementById("name").value = ""
    document.getElementById("price").value = ""
    document.getElementById("stock").value = ""
    document.getElementById("cooktime").value = ""
    document.getElementById("image").value = ""
}

//Permet de recharger le formulaire
function resetForm() {
    document.getElementById("editbutton").style.display = "none"
    document.getElementById("savebutton").style.display = "block"
    emptyForm()
}


function editProduct() {

    // Getting form data
    const image = document.getElementById("image").value
    const price = document.getElementById("price").value
    const name = document.getElementById("name").value
    const stock = document.getElementById("stock").value
    const cooktime = document.getElementById("cooktime").value

    //Permet d'envoyer une alerte si le formulaire est vide
    if (image === "" || price === "" || name === "" || stock === "" || cooktime === "") {
        alert("invalid form input")
        return
    }

    fetch(`https://gestionnairedecommande-default-rtdb.firebaseio.com/products/${editProductId}.json`, {
        method: "PATCH",
        body: JSON.stringify({
            name: name,
            price: price,
            cooktime: cooktime,
            stock: stock,
            image: image,
        })
    }).then((reponse) => {
        console.log(reponse)
        if (reponse.ok) {
            const index = products.findIndex((product) => {
                return product.id === editProductId
            });

            // Replace elements
            products[index].image = image
            products[index].price = price
            products[index].stock = stock
            products[index].cooktime = cooktime
            products[index].name = name

            displayProducts(products)
            emptyForm()
            editProductId = ""
        } else {
            alert("error1")
        }
    }).catch((error) => {
        alert("error")
    })
}


