document.addEventListener('DOMContentLoaded', () => {
    // Load product data from localStorage on page load
    loadProductData();
    updateIndexes(); // Ensure index numbers are correctly updated
    calculateTotal(); // Recalculate total when data is loaded
});

// Function to add a new product input box
function addProduct(button, position) {
    const container = document.getElementById('product-container');
    const currentBox = button.parentNode.parentNode;

    const newBox = document.createElement('div');
    newBox.className = 'product-box';
    newBox.innerHTML = `
        <div class="index-number"></div>
        <div class="buttons">
            <button onclick="addProduct(this, 'above')">Add Above</button>
            <button onclick="addProduct(this, 'below')">Add Below</button>
            <button onclick="removeProduct(this)">Remove</button>
        </div>
        <input type="text" class="description" placeholder="Product Description" oninput="saveProductData()">
        <span class="small-screen"></span>
        <input type="text" class="price" placeholder="Price (e.g. 12+2*3)" oninput="calculateTotal(); saveProductData();">
    `;

    if (position === 'above') {
        container.insertBefore(newBox, currentBox);
    } else if (position === 'below') {
        container.insertBefore(newBox, currentBox.nextSibling);
    }

    updateIndexes();
    saveProductData(); // Save data after adding a new product box
}

// Function to remove the specific product input box
function removeProduct(button) {
    const container = document.getElementById('product-container');
    const currentBox = button.parentNode.parentNode;
    const boxes = container.getElementsByClassName('product-box');

    if (boxes.length > 1) { // Always keep at least one box
        container.removeChild(currentBox);
        calculateTotal(); // Recalculate total after removing a box
        updateIndexes();  // Update the index numbers
        saveProductData(); // Save data after removing a product box
    }
}

// Function to calculate the total sum of all prices with math operations
function calculateTotal() {
    const prices = document.getElementsByClassName('price');
    let total = 0;
    let error = '';

    for (let i = 0; i < prices.length; i++) {
        const priceExpression = prices[i].value;
        if (priceExpression.trim() !== '') {
            try {
                // Evaluate the math expression from the input
                const evaluatedPrice = eval(priceExpression);
                if (!isNaN(evaluatedPrice)) {
                    total += evaluatedPrice;
                } else {
                    error = 'Invalid price entry in one of the fields.';
                }
            } catch (e) {
                error = 'Error in price cell no (' + (i + 1).toString() + ') Please fix it.';
            }
        }
    }

    // Update the total price
    document.getElementById('totalPrice').textContent = total.toFixed(2);

    // Show error message if any
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.textContent = error;

    // Save updated data after calculating total
    saveProductData();
}

// Function to update the index numbers for each product box
function updateIndexes() {
    const boxes = document.getElementsByClassName('product-box');
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].getElementsByClassName('index-number')[0].textContent = i + 1;
    }
}

// Function to save product data to localStorage
function saveProductData() {
    const productBoxes = document.getElementsByClassName('product-box');
    const productData = [];

    for (let box of productBoxes) {
        const description = box.getElementsByClassName('description')[0].value;
        const price = box.getElementsByClassName('price')[0].value;

        productData.push({ description, price });
    }

    localStorage.setItem('productData', JSON.stringify(productData));
}

// Function to load product data from localStorage
function loadProductData() {
    const storedData = JSON.parse(localStorage.getItem('productData'));

    if (storedData && storedData.length > 0) {
        const container = document.getElementById('product-container');
        container.innerHTML = ''; // Clear existing product boxes

        storedData.forEach((product, index) => {
            const newBox = document.createElement('div');
            newBox.className = 'product-box';
            newBox.innerHTML = `
                <div class="index-number">${index + 1}</div>
                <div class="buttons">
                    <button onclick="addProduct(this, 'above')">Add Above</button>
                    <button onclick="addProduct(this, 'below')">Add Below</button>
                    <button onclick="removeProduct(this)">Remove</button>
                </div>
                <input type="text" class="description" placeholder="Product Description" value="${product.description}" oninput="saveProductData()">
                <span class="small-screen"></span>
                <input type="text" class="price" placeholder="Price (e.g. 12+2*3)" value="${product.price}" oninput="calculateTotal(); saveProductData();">
            `;
            container.appendChild(newBox);
        });
    }
}

// Function to reset the form to its initial state with confirmation popup
function resetForm() {
    // Display a confirmation dialog
    const confirmation = confirm("Are you sure you want to reset the calculator? This will clear all inputs.");

    if (confirmation) {
        // Clear localStorage
        localStorage.removeItem('productData');

        // Reset the product container to its original single product box
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = `
            <div class="product-box">
                <div class="index-number">1</div>
                <div class="buttons">
                    <button onclick="addProduct(this, 'above')">Add Above</button>
                    <button onclick="addProduct(this, 'below')">Add Below</button>
                    <button onclick="removeProduct(this)">Remove</button>
                </div>
                <input type="text" class="description" placeholder="Product Description" oninput="saveProductData()">
                <span class="small-screen"></span>
                <input type="text" class="price" placeholder="Price (e.g. 12+2*3)" oninput="calculateTotal(); saveProductData();">
            </div>
        `;

        // Reset total price and clear error messages
        document.getElementById('totalPrice').textContent = '0.00';
        document.getElementById('errorMessage').textContent = '';

        updateIndexes();
        saveProductData();
    }
}

// Initial index update
updateIndexes();
