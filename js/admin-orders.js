// setInterval(()=> {
//     getOrdersFromDb()
//     displayOrders()
// },5000)

let orders = []

async function getOrdersFromDb() {
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
                bdOrder.push(tranformedItems)
            }
            orders = bdOrder
            displayOrders()
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
            <div style="width: 200px;" class="Table"><p class="fonttext">Client</p>
                <p>
                    ${order.user}
                </p>
            </div>
            <div style="width: 200px;" class="divone"><p class="fonttext">Products</p>
             <div id = "${order.id}">

             </div>
            </div>
            <div style="width: 200px;" class="divone"><p class="fonttext">Total Price</p>
                <p>
                    ${order.totalPrice}FCFA
                </p>
            </div>
            <div class="divfour">
                <p class="fonttext">
                    Status
                </p>
                <button onclick="changeStatus('${order.id}')" class="boutonone" style = "cursor: pointer"; id= "${order.id}-btn">
                    ${order.status}
                </button>
            </div>
        </div>
        `
        orderscontent.insertAdjacentHTML("afterbegin", orderHtml)

        //Permet de lister une autre liste dans la liste order qui contient la quantite commande et le nom du produit
        const itemscontent = document.getElementById(order.id)
        order.items.forEach((item) => {
            let itemHtml = `
            <p>${item.quantity} x ${item.name}</p>
            `
            itemscontent.insertAdjacentHTML("afterbegin", itemHtml)
        })

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
    });

}



const changeStatus = (orderId) => {
    let statusText = ""
    const index = orders.findIndex((order) => {
        return order.id === orderId
    })

    statusText = orders[index].status

    if (statusText !== "delivery") {

        if (statusText === "pending") {
            statusText = "cooking"
            orders[index].status = statusText
            return updateOrder(orders[index])
        }

        if (statusText === "cooking") {
            statusText = "delivery"
            orders[index].status = statusText
            return updateOrder(orders[index])
        }
    }
    
}


async function updateOrder(order) {
    console.log("clicked")
    let button = document.getElementById(order.id + "-btn")

    fetch(`https://gestionnairedecommande-default-rtdb.firebaseio.com/orders/${order.id}.json`, {
        method: "PATCH",
        body: JSON.stringify(order)
    }).then((reponse) => {
        console.log(reponse)
        if (reponse.ok) {
            button.innerHTML = order.status
            if (order.status === "pending") {
                button.style.backgroundColor = "orange"
            }
            if (order.status === "cooking") {
                button.style.backgroundColor = "green"
            }
            if (order.status === "delivery") {
                button.style.backgroundColor = "tomato"
            }
        } else {
            alert("error1")
        }
    }).catch((error) => {
        alert("error")
    })
}