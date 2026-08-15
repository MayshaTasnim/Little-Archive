// ======================================================
// ================= ADMIN PRODUCTS ======================
// ======================================================


// ======================================================
// ================= CHECK ADMIN =========================
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const adminData =
            localStorage.getItem(
                "littleArchiveAdmin"
            );


        if (!adminData) {

            window.location.href =
                "admin-login.html";

            return;

        }


        let admin;

        try {

            admin =
                JSON.parse(adminData);

        } catch (error) {

            localStorage.removeItem(
                "littleArchiveAdmin"
            );

            window.location.href =
                "admin-login.html";

            return;

        }


        if (
            !admin ||
            admin.role !== "admin"
        ) {

            localStorage.removeItem(
                "littleArchiveAdmin"
            );

            window.location.href =
                "admin-login.html";

            return;

        }


        // Start loading products
        loadAdminProducts();


        // Setup buttons
        setupAdminProducts();

    }
);



// ======================================================
// ================= LOAD PRODUCTS ======================
// ======================================================

async function loadAdminProducts() {

    const productsList =
        document.getElementById(
            "admin-products-list"
        );


    if (!productsList) {
        return;
    }


    productsList.innerHTML = `
        <p class="admin-products-loading">
            Loading products...
        </p>
    `;


    try {

        const response =
            await fetch(
                "http://localhost:3000/api/products"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load products."
            );

        }


        const products =
            await response.json();


        displayAdminProducts(products);


    } catch (error) {

        console.error(
            "Load products error:",
            error
        );


        productsList.innerHTML = `
            <p class="admin-products-error">
                Unable to load products.
                Please make sure the backend is running.
            </p>
        `;

    }

}



// ======================================================
// ================ DISPLAY PRODUCTS ====================
// ======================================================

function displayAdminProducts(products) {

    const productsList =
        document.getElementById(
            "admin-products-list"
        );


    if (!productsList) {
        return;
    }


    if (
        !products ||
        products.length === 0
    ) {

        productsList.innerHTML = `
            <div class="admin-no-products">

                <i class="fa-solid fa-box-open"></i>

                <h2>
                    No Products Found
                </h2>

                <p>
                    Your store does not have any products yet.
                </p>

            </div>
        `;

        return;

    }


    productsList.innerHTML =
        products.map(
            product => {

                const price =
                    product.price !== undefined
                        ? `৳${product.price}`
                        : "";


                const unit =
                    product.unit || "";


                return `

                    <article
                        class="admin-product-card"
                    >

                        <div
                            class="admin-product-image"
                        >

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                        </div>


                        <div
                            class="admin-product-info"
                        >

                            <span
                                class="admin-product-category"
                            >
                                ${product.category || "Uncategorized"}
                            </span>


                            <h2>
                                ${product.name}
                            </h2>


                            <p
                                class="admin-product-price"
                            >
                                ${price}
                                ${unit}
                            </p>


                            <p
                                class="admin-product-id"
                            >
                                Product ID:
                                ${product.id}
                            </p>


                        </div>


                        <div
                            class="admin-product-actions"
                        >

                            <button
                                type="button"
                                class="admin-edit-product-btn"
                                data-product-id="${product.id}"
                            >

                                <i
                                    class="fa-solid fa-pen"
                                ></i>

                                Edit

                            </button>


                            <button
                                type="button"
                                class="admin-delete-product-btn"
                                data-product-id="${product.id}"
                            >

                                <i
                                    class="fa-solid fa-trash"
                                ></i>

                                Delete

                            </button>

                        </div>

                    </article>

                `;

            }
        ).join("");

}



// ======================================================
// ================= SETUP BUTTONS ======================
// ======================================================

function setupAdminProducts() {

    const addProductButton =
        document.getElementById(
            "add-product-btn"
        );


    const closeButton =
        document.getElementById(
            "product-modal-close"
        );


    const cancelButton =
        document.getElementById(
            "product-cancel-btn"
        );


    const productModal =
        document.getElementById(
            "product-modal"
        );


    const productForm =
        document.getElementById(
            "product-form"
        );


    const logoutButton =
        document.getElementById(
            "admin-logout-btn"
        );


    // Add Product
    if (addProductButton) {

        addProductButton.addEventListener(
            "click",
            function() {

                openProductModal();

            }
        );

    }


    // Close modal
    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function() {

                closeProductModal();

            }
        );

    }


    // Cancel
    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function() {

                closeProductModal();

            }
        );

    }


    // Product form
    if (productForm) {

        productForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "product-name"
            ).value.trim();


        const price =
            document.getElementById(
                "product-price"
            ).value;


        const category =
            document.getElementById(
                "product-category"
            ).value;


        const unit =
            document.getElementById(
                "product-unit"
            ).value.trim();


        const image =
            document.getElementById(
                "product-image"
            ).value.trim();


        if (
            !name ||
            !price ||
            !category ||
            !image
        ) {

            showProductMessage(
                "Please fill in all required fields."
            );

            return;

        }


        try {

            const productId =
                document.getElementById(
                    "product-id"
                ).value;


            const isEditing =
                productId !== "";


            const url =
                isEditing
                    ? `http://localhost:3000/api/products/${productId}`
                    : "http://localhost:3000/api/products";


            const method =
                isEditing
                    ? "PUT"
                    : "POST";


            const response =
                await fetch(
                    url,
                    {
                        method: method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            price: Number(price),

                            category: category,

                            unit: unit,

                            image: image

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                showProductMessage(
                    data.message ||
                    "Unable to save product."
                );

                return;

            }


            showProductMessage(
                isEditing
                    ? "Product updated successfully!"
                    : "Product added successfully!"
            );


            closeProductModal();


            productForm.reset();


            document.getElementById(
                "product-id"
            ).value = "";


            loadAdminProducts();


        } catch (error) {

            console.error(
                "Save product error:",
                error
            );


            showProductMessage(
                "Unable to connect to the server."
            );

        }

    }
);
    }


    // Logout
    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function() {

                localStorage.removeItem(
                    "littleArchiveAdmin"
                );


                window.location.href =
                    "admin-login.html";

            }
        );

    }


    // Edit / Delete buttons
    document.addEventListener(
        "click",
        function(event) {

            const editButton =
                event.target.closest(
                    ".admin-edit-product-btn"
                );


            const deleteButton =
                event.target.closest(
                    ".admin-delete-product-btn"
                );


            if (editButton) {

    const productId =
        Number(editButton.dataset.productId);


    editProduct(productId);

}


         if (deleteButton) {

    const productId =
        Number(
            deleteButton.dataset.productId
        );


    deleteProduct(productId);

}

        }
    );

}



// ======================================================
// ================= OPEN MODAL =========================
// ======================================================

function openProductModal() {

    const modal =
        document.getElementById(
            "product-modal"
        );


    const form =
        document.getElementById(
            "product-form"
        );


    const title =
        document.getElementById(
            "product-modal-title"
        );


    if (!modal) {
        return;
    }


    if (form) {
        form.reset();
    }


    document.getElementById(
        "product-id"
    ).value = "";


    if (title) {

        title.textContent =
            "Add Product";

    }


    modal.classList.add(
        "active"
    );

}



// ======================================================
// ================= CLOSE MODAL ========================
// ======================================================

function closeProductModal() {

    const modal =
        document.getElementById(
            "product-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );

}



// ======================================================
// ================= SHOW MESSAGE =======================
// ======================================================

function showProductMessage(message) {

    const messageElement =
        document.getElementById(
            "admin-products-message"
        );


    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        message;


    setTimeout(
        function() {

            messageElement.textContent =
                "";

        },
        3000
    );

}

// ======================================================
// ================= EDIT PRODUCT ========================
// ======================================================

async function editProduct(productId) {

    try {

        const response =
            await fetch(
                "http://localhost:3000/api/products"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load products."
            );

        }


        const products =
            await response.json();


        const product =
            products.find(
                item =>
                    Number(item.id) === productId
            );


        if (!product) {

            showProductMessage(
                "Product not found."
            );

            return;

        }


        // Fill the form
        document.getElementById(
            "product-id"
        ).value = product.id;


        document.getElementById(
            "product-name"
        ).value = product.name || "";


        document.getElementById(
            "product-price"
        ).value = product.price ?? "";


        document.getElementById(
            "product-category"
        ).value = product.category || "";


        document.getElementById(
            "product-unit"
        ).value = product.unit || "";


        document.getElementById(
            "product-image"
        ).value = product.image || "";


        // Change modal title
        document.getElementById(
            "product-modal-title"
        ).textContent =
            "Edit Product";


        // Open modal
        document.getElementById(
            "product-modal"
        ).classList.add(
            "active"
        );


    } catch (error) {

        console.error(
            "Edit product error:",
            error
        );


        showProductMessage(
            "Unable to load product."
        );

    }

}

// ======================================================
// ================= DELETE PRODUCT ======================
// ======================================================

async function deleteProduct(productId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/products/${productId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showProductMessage(
                data.message ||
                "Unable to delete product."
            );

            return;

        }


        showProductMessage(
            "Product deleted successfully!"
        );


        // Refresh product list
        loadAdminProducts();


    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        showProductMessage(
            "Unable to connect to the server."
        );

    }

}