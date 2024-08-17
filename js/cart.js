// let carts = [
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
// ];

// // localStorage.setItem("carts", JSON.stringify(carts))


// function displayCarts(carts) {
//     for (let item of carts) {
//         const cart = `

//         <div class="container3" id="first">
//             <div class="divone">${item.stock}</div>jpg
//             <img class="plat2" src="${item.image}">
//             <div class="divone">${item.name}</div>
//             <div class="divone">${item.price} FCFA</div>
//             <div class="divfour">
//                 <button class="boutonone">
//                     -
//                 </button>
//                 <button class="boutontwo">
//                     +
//                 </button>
//             </div>
//         </div>`

//         const cartDiv = document.getElementById("content")
//         cartDiv.insertAdjacentHTML("first", cart)
//     }
// }

const id = localStorage.getItem("id")
if(!id){
    localStorage.setItem("id",  "table" + Date.now())
}


let orders = []

let carts = []
let totalPrice = 0;

// function getOrdersFromDb() {
//     const items = JSON.parse(localStorage.getItem("orders"))
//     if (items) {
//         orders = items
//     }
// }
// getOrdersFromDb()

//Permet de creer une base de donner qui contient les elements du cart
function getCartFromDb() {
    const items = JSON.parse(localStorage.getItem("carts"))
    if (items) {
        carts = items
    }
    //permet de changer le nombre total de la commande dans le items account
    document.getElementById("count").innerHTML = carts.length
}
getCartFromDb()

//Permet de faire afficher la commande dans le cart
function setCartItems() {
    const cartContainerLeft = document.getElementById("cartContainer")

    cartContainerLeft.innerHTML = ""
    carts.forEach((cartItem) => {
        const cartHtml = `<div class="container3" id="first">
                <div class="divone" style = "width: 20px">${cartItem.quantity}</div>
                <img class="plat2" src="${cartItem.image}">
                <div class="divone" style = "width: 50px">${cartItem.name}</div>
                <div class="divone">${cartItem.price} FCFA</div>
                <div class="divfour">
                    <button class="boutonone" style = "cursor: pointer" onclick = "delItemQuantity('${cartItem.productId}')">
                        -
                    </button>
                    <button class="boutontwo" style = "cursor: pointer" onclick = "addItemQuantity('${cartItem.productId}')">
                        +
                    </button>
                </div>
            </div>`

        cartContainerLeft.insertAdjacentHTML("afterbegin", cartHtml)
    })
    calculateCartSummary()
    document.getElementById("count").innerHTML = carts.length

    if(carts.length < 1){
        document.getElementById("savebutton").style.display = "none"
    }
    else{
        document.getElementById("savebutton").style.display = "block"
    }
}
setCartItems()

//Faire la somme des prix 
function calculateCartSummary() {
    totalPrice = 0
    carts.forEach((cartItem) => {
        totalPrice = +totalPrice + (+cartItem.price * +cartItem.quantity)
    })

    document.getElementById("totalPrice").innerHTML = totalPrice
    document.getElementById("account").innerHTML = carts.length
}

//Ajouter la quantite d'un plat
function addItemQuantity(productId) {
    const index = carts.findIndex((cartItem) => {
        return cartItem.productId === productId
    });

    carts[index].quantity = +carts[index].quantity + 1
    setCartItems()
    calculateCartSummary()
}

//Supprimer la quantite d'un plat
function delItemQuantity(productId) {
    const index = carts.findIndex((cartItem) => {
        return cartItem.productId === productId
    });

    if (+carts[index].quantity > 1) {

        carts[index].quantity = +carts[index].quantity - 1

        setCartItems()
        calculateCartSummary()
    } else {
        removeItemFromCart(productId)
    }

}

//Permet de retirer un plat si la quantite est de 0
function removeItemFromCart(productId) {
    const updateCart = carts.filter((cartItem) => {
        return cartItem.productId !== productId
    });
    carts = updateCart
    setCartItems()
    calculateCartSummary()
    localStorage.setItem("carts", JSON.stringify(carts))
}

function order(){
    let order = {
        // id: Date.now(),
        items: carts,
        totalPrice: totalPrice,
        user: id,
        status: "pending",
    }
 
    fetch("https://gestionnairedecommande-default-rtdb.firebaseio.com/orders.json", {
        method: "POST",
        body: JSON.stringify(order)
    }).then((reponse) => {
        console.log(reponse)
        if (reponse.ok) {
            carts = []
            orders.push(order)
            setCartItems()
            calculateCartSummary()
            localStorage.setItem("carts", JSON.stringify(carts))
        } else {
            alert("error1")
        }
    }).catch((error) => {
        alert("error")
    })
}