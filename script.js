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