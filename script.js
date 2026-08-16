// ======================================================
// LITTLE ARCHIVE - SCRIPT.JS
// ======================================================



// ======================================================
// ================= FAVOURITES ==========================
// ======================================================


// Load saved favourites
let favourites = JSON.parse(
    localStorage.getItem("littleArchiveFavourites")
) || [];


// Save favourites
function saveFavourites() {

    localStorage.setItem(
        "littleArchiveFavourites",
        JSON.stringify(favourites)
    );

}


// Update all heart icons
function updateFavouriteButtons() {

    const buttons =
        document.querySelectorAll(".favourite-btn");


    buttons.forEach(button => {

        const productId =
            button.dataset.productId;

        const icon =
            button.querySelector("i");


        if (!productId || !icon) {
            return;
        }


        if (favourites.includes(String(productId))) {

            // Filled heart
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

            button.setAttribute(
                "aria-label",
                "Remove from favourites"
            );

        } else {

            // Outline heart
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

            button.setAttribute(
                "aria-label",
                "Add to favourites"
            );

        }

    });

}



// ======================================================
// ================= FAVOURITE CLICK ====================
// ======================================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(".favourite-btn");


        if (!button) {
            return;
        }


        event.preventDefault();
        event.stopPropagation();


        const productId =
            button.dataset.productId;


        if (!productId) {

            console.log(
                "No product ID found on favourite button."
            );

            return;
        }


        const id =
            String(productId);


        // Already favourite → remove
        if (favourites.includes(id)) {

            favourites =
                favourites.filter(
                    favouriteId =>
                        favouriteId !== id
                );

        }

        // Not favourite → add
        else {

            favourites.push(id);

        }


        saveFavourites();

        updateFavouriteButtons();

    }
);



// ======================================================
// ================= PAGE LOAD ===========================
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateFavouriteButtons();

    }
);



// ======================================================
// ============== WATCH FOR NEW PRODUCTS ================
// ======================================================

const observer =
    new MutationObserver(function() {

        updateFavouriteButtons();

    });


observer.observe(
    document.body,
    {
        childList: true,
        subtree: true
    }
);



// ======================================================
// ===================== SEARCH ==========================
// ======================================================


// Search elements
const searchButton =
    document.querySelector(".search-btn");


const searchContainer =
    document.getElementById("search-container");


const searchInput =
    document.getElementById("search-input");


const searchResults =
    document.getElementById("search-results");


const searchSubmit =
    document.getElementById("search-submit");



// ======================================================
// ================= OPEN SEARCH ========================
// ======================================================

if (searchButton && searchContainer) {

    searchButton.addEventListener(
        "click",
        function() {

            searchContainer.classList.toggle(
                "active"
            );


            if (
                searchContainer.classList.contains(
                    "active"
                )
            ) {

                if (searchInput) {
                    searchInput.focus();
                }

            }

        }
    );

}



// ======================================================
// ================= SEARCH PRODUCTS ====================
// ======================================================

async function searchProducts() {

    // Make sure search elements exist
    if (!searchInput || !searchResults) {
        return;
    }


    const searchText =
        searchInput.value.trim();


    // Empty search
    if (!searchText) {

        searchResults.innerHTML = "";

        return;
    }


    // Loading message
    searchResults.innerHTML = `
        <p class="search-loading">
            Searching...
        </p>
    `;


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/products?search=${encodeURIComponent(searchText)}`
            );


        if (!response.ok) {

            throw new Error(
                "Search failed"
            );

        }


        const products =
            await response.json();


        displaySearchResults(products);


    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        searchResults.innerHTML = `
            <p class="search-error">
                Unable to search products.
                Please make sure the backend is running.
            </p>
        `;

    }

}



// ======================================================
// ================ DISPLAY SEARCH RESULTS ==============
// ======================================================

function displaySearchResults(products) {


    // No results
    if (
        !products ||
        products.length === 0
    ) {

        searchResults.innerHTML = `
            <p class="no-results">
                No products found.
            </p>
        `;

        return;
    }


    // Display products
    searchResults.innerHTML =
        products.map(product => {


            const productPage =
                getProductPage(
                    product.category
                );


            const price =
                product.price !== undefined
                    ? `৳${product.price}`
                    : "";


            const unit =
                product.unit === "Tk set"
                    ? " set"
                    : "";


            return `

                <a
                    href="${productPage}"
                    class="search-result"
                >

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div>

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            ${price}${unit}
                        </p>

                    </div>

                </a>

            `;

        }).join("");

}



// ======================================================
// ============== GET PRODUCT CATEGORY PAGE =============
// ======================================================

function getProductPage(category) {


    if (!category) {
        return "#";
    }


    const categoryName =
        String(category)
            .trim()
            .toLowerCase();


    const pages = {

        "notebooks":
            "notebook.html",

        "stickers":
            "sticker.html",

        "sticky-notes":
            "stckynote.html",

        "washi-tape":
            "washitape.html"

    };


    return pages[categoryName] || "#";

}



// ======================================================
// ================ SEARCH SUBMIT BUTTON ================
// ======================================================

if (searchSubmit) {

    searchSubmit.addEventListener(
        "click",
        function() {

            searchProducts();

        }
    );

}



// ======================================================
// ================= SEARCH WITH ENTER ==================
// ======================================================

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchProducts();

            }

        }
    );

}
// ======================================================
// ===================== CART ============================
// ======================================================

// Load saved cart
let cart = JSON.parse(
    localStorage.getItem("littleArchiveCart")
) || [];


// Save cart
function saveCart() {

    localStorage.setItem(
        "littleArchiveCart",
        JSON.stringify(cart)
    );

}
// ======================================================
// ================= UPDATE CART COUNT ==================
// ======================================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }


    let totalItems = 0;

    cart.forEach(item => {

        totalItems += item.quantity;

    });


    cartCount.textContent = totalItems;

}

// ======================================================
// ================= ADD TO CART ========================
// ======================================================

document.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(".add-to-cart-btn");

        if (!button) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();


        const productId =
            String(button.dataset.productId);

        if (!productId) {
            return;
        }


        try {

            // Get product information from backend
            const response = await fetch(
                "http://localhost:3000/api/products"
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to load products"
                );

            }


            const products =
                await response.json();


            // Find clicked product
            const product =
                products.find(
                    item =>
                        String(item.id) === productId
                );


            if (!product) {

                console.error(
                    "Product not found:",
                    productId
                );

                return;

            }


            // Check if product is already in cart
            const existingItem =
                cart.find(
                    item =>
                        String(item.id) === productId
                );


            if (existingItem) {

                // Product already exists → increase quantity
                existingItem.quantity += 1;

            } else {

                // Add new product
                cart.push({

                    id: product.id,

                    name: product.name,

                    price: product.price,

                    image: product.image,

                    quantity: 1

                });

            }


            // Save updated cart
            saveCart();


            // Update 🛒 number in header
            updateCartCount();


            // Show ✓ temporarily
            button.innerHTML =
                '<i class="fa-solid fa-check"></i>';


            setTimeout(function() {

                button.innerHTML =
                    '<i class="fa-solid fa-cart-shopping"></i>';

            }, 1000);


            console.log(
                "Cart:",
                cart
            );


        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );

        }

    }
);
document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

    }
);
// ======================================================
// ================= CHECKOUT ============================
// ======================================================

const checkoutForm =
    document.getElementById("checkout-form");

const checkoutMessage =
    document.getElementById("checkout-message");


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("customer-name")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("customer-phone")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("customer-address")
                    .value
                    .trim();


            const paymentElement =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (!name || !phone || !address) {

                checkoutMessage.textContent =
                    "Please fill in all delivery information.";

                return;

            }


            if (!paymentElement) {

                checkoutMessage.textContent =
                    "Please select a payment method.";

                return;

            }


            if (cart.length === 0) {

                checkoutMessage.textContent =
                    "Your cart is empty.";

                return;

            }


            const payment =
                paymentElement.value;


            console.log("Order placed:", {

                customerName: name,

                phone: phone,

                address: address,

                paymentMethod: payment,

                items: cart

            });


            checkoutMessage.textContent =
                "Order placed successfully! 🎉";


            checkoutMessage.style.color =
                "#6b8e23";


           setTimeout(function() {

    const savedUser =
        JSON.parse(
            localStorage.getItem("littleArchiveUser")
        ) || null;
        // Admin Panel button
const adminPanelBtn =
    document.getElementById(
        "admin-panel-btn"
    );


if (adminPanelBtn) {

    if (
        savedUser &&
        savedUser.role === "admin"
    ) {

        adminPanelBtn.style.display =
            "inline-flex";

    } else {

        adminPanelBtn.style.display =
            "none";

    }

}

    const orderTotal =
        cart.reduce(function(total, item) {

            return total +
                (Number(item.price) * Number(item.quantity));

        }, 0);


    const newOrder = {

        orderId:
            "LA-" + Date.now(),

        date:
            new Date().toLocaleString(),

        userEmail:
            savedUser && savedUser.email
                ? savedUser.email
                : "guest",

        customerName:
            name,

        phone:
            phone,

        address:
            address,

        paymentMethod:
            payment,

        items:
            cart.map(function(item) {

                return {

                    id: item.id,

                    name: item.name,

                    price: item.price,

                    image: item.image,

                    quantity: item.quantity

                };

            }),

        total:
            orderTotal,

        status:
            "Order Placed"

    };


    // Save order to backend
fetch(
    "http://localhost:3000/api/orders",
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            userId:
                savedUser && savedUser.id
                    ? savedUser.id
                    : "guest",

            customerName:
                newOrder.customerName,

            customerEmail:
                newOrder.userEmail,

            items:
                newOrder.items,

            total:
                newOrder.total,

            shippingAddress:
                newOrder.address

        })

    }
)
.then(function(response) {

    return response.json();

})
.then(function(data) {

    if (!data || !data.order) {

        throw new Error(
            "Order was not saved."
        );

    }


    // Order successfully saved
    localStorage.removeItem(
        "littleArchiveCart"
    );


    // Keep local order history
    const orders =
        JSON.parse(
            localStorage.getItem(
                "littleArchiveOrders"
            )
        ) || [];


    orders.push(newOrder);


    localStorage.setItem(
        "littleArchiveOrders",
        JSON.stringify(orders)
    );


    // Go back to homepage
    window.location.href =
        "index.html";

})
.catch(function(error) {

    console.error(
        "Order saving error:",
        error
    );


    alert(
        "Your order could not be saved. Please try again."
    );

});

}, 2000);
        }
    );

}
// ======================================================
// ================= PROFILE ICON ========================
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const profileButton =
            document.querySelector(".profile-btn");


        if (!profileButton) {
            return;
        }


        profileButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const loggedInUser =
                    localStorage.getItem(
                        "littleArchiveUser"
                    );


                if (loggedInUser) {

                    // Logged in → Profile page
                    window.location.href =
                        "profile.html";

                } else {

                    // Not logged in → Login page
                    window.location.href =
                        "login.html";

                }

            }
        );

    }
);
