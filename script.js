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
        <input type="text" class="description" placeholder="Product Description">
        <span class="small-screen"></span>
        <input type="text" class="price" placeholder="Price (e.g. 12+2*3)" oninput="calculateTotal()">
    `;

    if (position === 'above') {
        container.insertBefore(newBox, currentBox);
    } else if (position === 'below') {
        container.insertBefore(newBox, currentBox.nextSibling);
    }

    updateIndexes();
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
                error = 'Error in one of the price expressions. Please correct it.';
            }
        }
    }

    // Update the total price
    document.getElementById('totalPrice').textContent = total.toFixed(2);

    // Show error message if any
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.textContent = error;
}

// Function to update the index numbers for each product box
function updateIndexes() {
    const boxes = document.getElementsByClassName('product-box');
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].getElementsByClassName('index-number')[0].textContent = i + 1;
    }
}

// Initial index update
updateIndexes();






// ------save data when enabling or disabling desktop mode on mobile device----

window.onload = function() {
    restoreFormData();  // Restore the product data when the page loads
    calculateTotal();    // Recalculate the total
};

// Save form data to localStorage
function saveData() {
    const productData = [];
    const productBoxes = document.querySelectorAll('.product-box');

    productBoxes.forEach(box => {
        const description = box.querySelector('.description').value;
        const price = box.querySelector('.price').value;
        productData.push({ description, price });
    });

    localStorage.setItem('productData', JSON.stringify(productData));  // Save data in JSON format
}

// Restore form data from localStorage
function restoreFormData() {
    const savedData = JSON.parse(localStorage.getItem('productData'));

    if (savedData) {
        const productContainer = document.getElementById('product-container');
        savedData.forEach((product, index) => {
            if (index > 0) {
                addProduct(document.querySelector('.product-box'), 'below');
            }

            const productBoxes = document.querySelectorAll('.product-box');
            const lastBox = productBoxes[productBoxes.length - 1];

            lastBox.querySelector('.description').value = product.description;
            lastBox.querySelector('.price').value = product.price;
        });
    }
}

// Calculate total price and save data
function calculateTotal() {
    let total = 0;
    const prices = document.querySelectorAll('.price');
    
    prices.forEach(price => {
        try {
            total += eval(price.value) || 0;
        } catch {
            document.getElementById('errorMessage').textContent = "Invalid expression!";
            return;
        }
    });

    document.getElementById('totalPrice').textContent = total.toFixed(2);
    document.getElementById('errorMessage').textContent = ''; // Clear error message

    saveData();  // Save form data on every calculation
}

// Function to add a new product
function addProduct(button, position) {
    const productContainer = document.getElementById('product-container');
    const productBox = button.closest('.product-box');
    const newProductBox = productBox.cloneNode(true);
    
    newProductBox.querySelector('.description').value = '';
    newProductBox.querySelector('.price').value = '';

    if (position === 'above') {
        productContainer.insertBefore(newProductBox, productBox);
    } else {
        productContainer.insertBefore(newProductBox, productBox.nextSibling);
    }

    updateIndexNumbers();
    saveData(); // Save form data when adding a product
}

// Function to remove a product
function removeProduct(button) {
    const productContainer = document.getElementById('product-container');
    const productBox = button.closest('.product-box');
    
    if (document.querySelectorAll('.product-box').length > 1) {
        productContainer.removeChild(productBox);
    }

    updateIndexNumbers();
    saveData(); // Save form data when removing a product
}



// Function to update index numbers
function updateIndexNumbers() {
    const productBoxes = document.querySelectorAll('.product-box .index-number');
    
    productBoxes.forEach((box, index) => {
        box.textContent = index + 1;
    });
}


// -------------reset button----------
// Reset form to its initial state with confirmation popup
function resetForm() {
    // Display a confirmation dialog
    const confirmation = confirm("Are you sure you want to reset the calculator? This will clear all inputs.");
    
    // If the user confirms, proceed with resetting the form
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
                <input type="text" class="description" placeholder="Product Description">
                <span class="small-screen"></span>
                <input type="text" class="price" placeholder="Price (e.g. 12+2*3)" oninput="calculateTotal()">
            </div>
        `;

        // Reset total price and clear error messages
        document.getElementById('totalPrice').textContent = '0.00';
        document.getElementById('errorMessage').textContent = '';
    }
}
