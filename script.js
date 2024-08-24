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
