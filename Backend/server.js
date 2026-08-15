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

    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );


    if (req.method === "OPTIONS") {

        return res.sendStatus(204);

    }


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
// LOAD USERS
// ================================

const usersPath = path.join(
    __dirname,
    "data",
    "users.json"
);

let users = JSON.parse(
    fs.readFileSync(usersPath, "utf-8")
);
// ================================
// LOAD ORDERS
// ================================

const ordersPath = path.join(
    __dirname,
    "data",
    "orders.json"
);

let orders = JSON.parse(
    fs.readFileSync(ordersPath, "utf-8")
);


// ================================
// HOME / TEST ROUTE
// ================================

app.get("/", (req, res) => {
    res.send("Little Archive backend is running!");
});


// ================================
// REGISTER
// ================================

app.post("/api/register", (req, res) => {

    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    // Check if email already exists
    const existingUser = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        return res.status(400).json({
            message: "An account with this email already exists."
        });
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: "user"
    };

    users.push(newUser);

    // Save users to users.json
    fs.writeFileSync(
        usersPath,
        JSON.stringify(users, null, 4)
    );

    res.status(201).json({
        message: "Registration successful!",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
    });

});


// ================================
// LOGIN
// ================================

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    // Check if fields are provided
    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter your email and password."
        });
    }

    // Find user
    const user = users.find(
        user =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
    );

    // User not found
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password."
        });
    }

    // Login successful
    res.json({
        message: "Login successful!",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });

});

// ================================
// CREATE ORDER
// ================================

app.post("/api/orders", (req, res) => {

    const {
        userId,
        customerName,
        customerEmail,
        items,
        total,
        shippingAddress
    } = req.body;


    // Check required fields
    if (
        !userId ||
        !customerName ||
        !customerEmail ||
        !items ||
        !items.length ||
        total === undefined
    ) {

        return res.status(400).json({
            message: "Missing required order information."
        });

    }


    // Create order
    const newOrder = {

        id: Date.now(),

        userId: userId,

        customerName: customerName,

        customerEmail: customerEmail,

        items: items,

        total: Number(total),

        shippingAddress: shippingAddress || "",

        status: "Pending",

        createdAt: new Date().toISOString()

    };


    // Save order
    orders.push(newOrder);


    fs.writeFileSync(
        ordersPath,
        JSON.stringify(orders, null, 4)
    );


    res.status(201).json({

        message: "Order placed successfully!",

        order: newOrder

    });

});
// ================================
// GET ALL ORDERS
// ================================

app.get("/api/orders", (req, res) => {

    res.json(orders);

});
// ================================
// USERS API
// ================================

app.get("/api/users", (req, res) => {

    res.json(
        users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }))
    );

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
// ADD PRODUCT
// ================================

app.post("/api/products", (req, res) => {

    const {
        name,
        price,
        category,
        unit,
        image
    } = req.body;


    // Check required fields
    if (
        !name ||
        price === undefined ||
        !category ||
        !image
    ) {

        return res.status(400).json({
            message: "Please fill in all required product fields."
        });

    }


    // Create new product
    const newProduct = {

        id: Date.now(),

        name: name,

        price: Number(price),

        category: category,

        unit: unit || "",

        image: image

    };


    // Add product
    products.push(newProduct);


    // Save products.json
    fs.writeFileSync(
        productsPath,
        JSON.stringify(products, null, 4)
    );


    // Send response
    res.status(201).json({

        message: "Product added successfully!",

        product: newProduct

    });

});

// ================================
// EDIT PRODUCT
// ================================

app.put("/api/products/:id", (req, res) => {

    const productId = Number(req.params.id);

    const {
        name,
        price,
        category,
        unit,
        image
    } = req.body;


    // Find product
    const productIndex = products.findIndex(
        product => product.id === productId
    );


    if (productIndex === -1) {

        return res.status(404).json({
            message: "Product not found."
        });

    }


    // Check required fields
    if (
        !name ||
        price === undefined ||
        !category ||
        !image
    ) {

        return res.status(400).json({
            message: "Please fill in all required product fields."
        });

    }


    // Update product
    products[productIndex] = {

        ...products[productIndex],

        name: name,

        price: Number(price),

        category: category,

        unit: unit || "",

        image: image

    };


    // Save products.json
    fs.writeFileSync(
        productsPath,
        JSON.stringify(products, null, 4)
    );


    // Send response
    res.json({

        message: "Product updated successfully!",

        product: products[productIndex]

    });

});

// ================================
// DELETE PRODUCT
// ================================

app.delete("/api/products/:id", (req, res) => {

    const productId = Number(req.params.id);


    // Find product
    const productIndex = products.findIndex(
        product => product.id === productId
    );


    // Product not found
    if (productIndex === -1) {

        return res.status(404).json({
            message: "Product not found."
        });

    }


    // Remove product
    const deletedProduct =
        products.splice(productIndex, 1)[0];


    // Save products.json
    fs.writeFileSync(
        productsPath,
        JSON.stringify(products, null, 4)
    );


    // Send response
    res.json({

        message: "Product deleted successfully!",

        product: deletedProduct

    });

});

// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

    console.log(
        `Little Archive backend running at http://localhost:${PORT}`
    );

});