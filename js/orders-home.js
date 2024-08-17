// setInterval(()=> {
//     getOrdersFromDb()
//     displayOrders()
// },5000)


// let orders = []
// // Permet de creer une sauvegarde de la liste order et ces elements
// function getOrdersFromDb() {
//     const items = JSON.parse(localStorage.getItem("orders"))
//     if (items) {
//         orders = items
//     }
// }
// getOrdersFromDb()

// //Permet l'affichage dans le html du contenu de la liste qui on ete push en appuyant sur la touche order du cart
// function displayOrders(){
//     const orderscontent = document.getElementById("orderscontent")
//     orderscontent.innerHTML = ""

//     orders.forEach((order) => {
//         const orderHtml = `
//         <div class="orderscontainer3" id="first">
//             <div style="width: 200px;" class="divone">
//                 <p class="fonttext">Products</p>
//                 <div  id="${order.id}"> 

//                 </div>
//             </div>
//             <div style="width: 200px;" class="divone">
//                 <p class="fonttext">Total Price</p>
//                 <p>
//                     ${order.totalPrice}FCFA
//                 </p>
//             </div>
//             <div class="divfour">
//                 <p class="fonttext">
//                     Status
//                 </p>
//                 <div class="boutonone"  id= "${order.id}-btn">
//                     ${order.status}
//                 </div>
//             </div>
//         </div>
//         `
//         orderscontent.insertAdjacentHTML("afterbegin", orderHtml)

//         let button = document.getElementById(order.id+"-btn")
//         if(order.status === "pending"){ 
//             button.style.backgroundColor = "orange"
//         }
//         if(order.status === "cooking"){
//             button.style.backgroundColor = "green"
//          }
//         if(order.status === "delivery"){ 
//             button.style.backgroundColor = "tomato"
//         }

//         //Permet de lister une autre liste dans la liste order qui contient la quantite commande et le nom du produit
//         const itemscontent = document.getElementById(order.id)
//         order.items.forEach((item)=> {
//             let itemHtml = `
//             <p>${item.quantity} x ${item.name}</p>
//             `
//          itemscontent.insertAdjacentHTML("afterbegin", itemHtml)
//         })
//     });

// }
// displayOrders()



const id = localStorage.getItem("id")
if(!id){
    localStorage.setItem("id",  "table" + Date.now())
}

setInterval(() => {
    getOrdersFromDb()
    displayOrders()
}, 5000)


let orders = []
// Permet de creer une sauvegarde de la liste order et ces elements
function getOrdersFromDb() {
    fetch("https://gestionnairedecommande-default-rtdb.firebaseio.com/orders.json")
        .then((reponse) => reponse.json())
        .then((data) => {
            document.getElementById("loading").style.display = "none"
            const bdOrder = []
            for (const key in data) {
                const tranformedItems = {
                    ...data[key],
                    id: key
                }
                if(tranformedItems.user === id){
                    bdOrder.push(tranformedItems)
                }
               
            }
            orders = bdOrder


        }).catch((error) => {

        })
}
getOrdersFromDb()

//Permet l'affichage dans le html du contenu de la liste qui on ete push en appuyant sur la touche order du cart
function displayOrders() {
    const orderscontent = document.getElementById("orderscontent")
    orderscontent.innerHTML = ""

    orders.forEach((order) => {
        const orderHtml = `
        <div class="orderscontainer3" id="first">
            <div style="width: 200px;" class="divone">
                <p class="fonttext">Products</p>
                <div  id="${order.id}"> 
                
                </div>
            </div>
            <div style="width: 200px;" class="divone">
                <p class="fonttext">Total Price</p>
                <p>
                    ${order.totalPrice}FCFA
                </p>
            </div>
            <div class="divfour">
                <p class="fonttext">
                    Status
                </p>
                <div class="boutonone"  id= "${order.id}-btn">
                    ${order.status}
                </div>
            </div>
        </div>
        `
        orderscontent.insertAdjacentHTML("afterbegin", orderHtml)

        let button = document.getElementById(order.id + "-btn")
        if (order.status === "pending") {
            button.style.backgroundColor = "orange"
        }
        if (order.status === "cooking") {
            button.style.backgroundColor = "green"
        }
        if (order.status === "delivery") {
            button.style.backgroundColor = "tomato"
        }

        //Permet de lister une autre liste dans la liste order qui contient la quantite commande et le nom du produit
        const itemscontent = document.getElementById(order.id)
        order.items.forEach((item) => {
            let itemHtml = `
            <p>${item.quantity} x ${item.name}</p>
            `
            itemscontent.insertAdjacentHTML("afterbegin", itemHtml)
        })
    });

}
displayOrders()
