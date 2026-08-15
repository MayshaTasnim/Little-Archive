// ======================================================
// ADMIN ORDERS
// ======================================================

const ordersList =
    document.getElementById(
        "admin-orders-list"
    );


// ======================================================
// LOAD ORDERS
// ======================================================

async function loadAdminOrders() {

    try {

        const response =
            await fetch(
                "http://localhost:3000/api/orders"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load orders."
            );

        }


        const orders =
            await response.json();


        displayOrders(orders);


    } catch (error) {

        console.error(
            "Load orders error:",
            error
        );


        ordersList.innerHTML = `
            <p class="admin-orders-error">
                Unable to load orders.
            </p>
        `;

    }

}


// ======================================================
// DISPLAY ORDERS
// ======================================================

function displayOrders(orders) {

    if (!orders.length) {

        ordersList.innerHTML = `
            <p class="admin-orders-empty">
                No orders have been placed yet.
            </p>
        `;

        return;

    }


    ordersList.innerHTML = "";


    orders.forEach(function(order) {

        const orderCard =
            document.createElement("article");


        orderCard.className =
            "admin-order-card";


        orderCard.innerHTML = `

            <div class="admin-order-header">

                <div>

                    <h2>
                        ${order.orderId || order.id}
                    </h2>

                    <p>
                        ${order.date || order.createdAt}
                    </p>

                </div>


                <span class="admin-order-status">
                    ${order.status}
                </span>

            </div>


            <div class="admin-order-customer">

                <p>
                    <strong>Customer:</strong>
                    ${order.customerName}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${order.customerEmail || order.userEmail}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${order.phone || "N/A"}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${order.shippingAddress || order.address || "N/A"}
                </p>

            </div>


            <div class="admin-order-items">

                <h3>
                    Items
                </h3>

                ${order.items.map(function(item) {

                    return `
                        <div class="admin-order-item">

                            <span>
                                ${item.name}
                                × ${item.quantity}
                            </span>

                            <span>
                                ${Number(item.price) *
                                  Number(item.quantity)}
                            </span>

                        </div>
                    `;

                }).join("")}

            </div>


            <div class="admin-order-footer">

                <strong>
                    Total: ${order.total}
                </strong>

            </div>

        `;


        ordersList.appendChild(
            orderCard
        );

    });

}


// ======================================================
// START
// ======================================================

loadAdminOrders();