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
        <input type="text" class="description" placeholder="Enter Product Description" oninput="saveProductData()">
        <span class="small-screen"></span>
        <input type="text" class="price" placeholder="Enter Price (e.g. 12+2*3)" oninput="calculateTotal(); saveProductData();">
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
                <input type="text" class="description" placeholder="Enter Product Description" value="${product.description}" oninput="saveProductData()">
                <span class="small-screen"></span>
                <input type="text" class="price" placeholder="Enter Price (e.g. 12+2*3)" value="${product.price}" oninput="calculateTotal(); saveProductData();">
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
                <input type="text" class="description" placeholder="Enter Product Description" oninput="saveProductData()">
                <span class="small-screen"></span>
                <input type="text" class="price" placeholder="Enter Price (e.g. 12+2*3)" oninput="calculateTotal(); saveProductData();">
            </div>
        `;

        // Reset total price and clear error messages
        document.getElementById('totalPrice').textContent = '0.00';
        document.getElementById('errorMessage').textContent = '';

        updateIndexes();
        saveProductData();
    }
}




function downloadDataTxt() {
    const productBoxes = document.querySelectorAll('.product-box');
    let data = '';

    // Add current date and time at the top
    const currentDate = new Date().toLocaleString();
    data += `Date and Time: ${currentDate}\n\n`;

    // Gather all the product data into a formatted string
    data += 'Product Description:                        Price:\n';
    data += '---------------------------------------------------\n';

    productBoxes.forEach((box, index) => {
        const description = box.querySelector('.description').value;
        const price = box.querySelector('.price').value;
        data += `${index + 1}. ${description.padEnd(40)} ${price} tk\n`;
        data += '---------------------------------------------------\n';
    });

    // Calculate and append the total price
    const totalPrice = document.getElementById('totalPrice').textContent;
    data += '**************************************************\n';
    data += `*             Total Price = ${totalPrice} tk            *\n`;
    data += '**************************************************\n';

    // Create a blob with the data
    const blob = new Blob([data], { type: 'text/plain' });

    // Create a link element for the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'product-prices.txt';

    // Simulate a click on the link to trigger the download
    link.click();

    // Clean up by revoking the object URL
    URL.revokeObjectURL(link.href);
}

function downloadDataPdf() {
    const productBoxes = document.querySelectorAll('.product-box');
    
    // Create a new jsPDF instance
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add current date and time at the top
    const currentDate = new Date().toLocaleString();
    doc.text(`Date and Time: ${currentDate}`, 10, 10);

    // Move to the next line
    doc.text('\n', 10, 20);

    // Add headers
    doc.text('Product Description:                        Price:', 10, 30);
    doc.text('---------------------------------------------------', 10, 35);

    // Gather and format the product data
    let yOffset = 45;
    productBoxes.forEach((box, index) => {
        const description = box.querySelector('.description').value;
        const price = box.querySelector('.price').value;
        doc.text(`${index + 1}. ${description.padEnd(40)} ${price} tk`, 10, yOffset);
        yOffset += 10;
        doc.text('---------------------------------------------------', 10, yOffset);
        yOffset += 10;
    });

    // Calculate and append the total price
    const totalPrice = document.getElementById('totalPrice').textContent;
    yOffset += 10;
    doc.text('**************************************************', 10, yOffset);
    yOffset += 10;
    doc.text(`*             Total Price = ${totalPrice} tk            *`, 10, yOffset);
    yOffset += 10;
    doc.text('**************************************************', 10, yOffset);

    // Save the PDF with the filename 'product-prices.pdf'
    doc.save('product-prices.pdf');
}


// Initial index update
updateIndexes();


// --------------calculation based on price or amount---------------
function calculateAmountOrPrice() {
    // Get input values
    const pricePerUnit = parseFloat(document.getElementById('price-for-one-unit').value);
    const amountOrPrice = parseFloat(document.getElementById('amount-or-price').value);
    const unit = document.getElementById('unit').value;

    // Get the result paragraph
    const resultElement = document.getElementById('result');

    // Check if input is valid
    if (isNaN(pricePerUnit) || isNaN(amountOrPrice)) {
        resultElement.textContent = "Please enter valid numbers for both inputs.";
        return;
    }

    let resultText = "";

    if (unit === 'g') {
        // Calculate the price for the given grams
        const amountInKg = amountOrPrice / 1000; // Convert grams to kilograms
        const price = amountInKg * pricePerUnit;
        resultText = `Price for ${amountOrPrice} grams is: ${price.toFixed(2)} Taka.`;
    } else if (unit === 'kg') {
        // Calculate the price for the given kilograms
        const price = amountOrPrice * pricePerUnit;
        resultText = `Price for ${amountOrPrice} kg is: ${price.toFixed(2)} Taka.`;
    } else if (unit === 'tk') {
        // Calculate the amount of product for the given price
        const amountInKg = amountOrPrice / pricePerUnit;
        const amountInGrams = amountInKg * 1000;
        resultText = `For ${amountOrPrice} Taka, you can buy: ${amountInKg.toFixed(2)} kg (${amountInGrams.toFixed(0)} grams).`;
    }

    // Display the result in the paragraph
    resultElement.textContent = resultText;
}


// ------show or hide advanced optuion

function toggleAdvancedOption() {
    const advancedOptionNode = document.getElementById('advanced-option-node');
    const toggleButton = document.getElementById('advanced-option-button-id');

    if (advancedOptionNode.style.display === 'none' || advancedOptionNode.style.display === '') {
        advancedOptionNode.style.display = 'block'; // Show the advanced options
        toggleButton.textContent = 'Hide advanced option';
    } else {
        advancedOptionNode.style.display = 'none'; // Hide the advanced options
        toggleButton.textContent = 'Show advanced option';
    }
}

function resetValues() {
    document.getElementById("amount-or-price").value='';
    document.getElementById("price-for-one-unit").value='';
    document.getElementById("result").textContent='Result will be shown here';
}

