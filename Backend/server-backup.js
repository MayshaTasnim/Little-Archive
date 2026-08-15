const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;


// ================================
// MIDDLEWARE
// ================================

// Allow frontend to communicate with backend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();
});

app.use(express.json());


// ================================
// LOAD PRODUCTS
// ================================

const productsPath = path.join(
    __dirname,
    "data",
    "products.json"
);

const products = JSON.parse(
    fs.readFileSync(productsPath, "utf-8")
);


// ================================
// HOME / TEST ROUTE
// ================================

app.get("/", (req, res) => {
    res.send("Little Archive backend is running!");
});


// ================================
// PRODUCTS API
// ================================

app.get("/api/products", (req, res) => {

    const { category, search } = req.query;

    let filteredProducts = products;


    // Category filter
    if (category) {

        filteredProducts = filteredProducts.filter(
            product =>
                product.category.toLowerCase() ===
                category.toLowerCase()
        );

    }


    // Search filter
    if (search) {

        const searchText = search.toLowerCase().trim();

        filteredProducts = filteredProducts.filter(
            product =>
                product.name
                    .toLowerCase()
                    .includes(searchText)
        );

    }


    res.json(filteredProducts);

});


// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

    console.log(
        `Little Archive backend running at http://localhost:${PORT}`
    );

});