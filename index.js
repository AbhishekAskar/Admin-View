
let form = document.getElementById('formData');
let productDetails = document.getElementById('productDetails');
let totalAmountElement = document.getElementById('totalAmount');

const apiUrl = 'https://crudcrud.com/api/2ae924f71cba4a2399103f1422c1e1f9/products';

form.addEventListener('submit', addItem);
productDetails.addEventListener('click', removeItem);

document.addEventListener('DOMContentLoaded', loadProductDetails);

function addItem(e) {
    e.preventDefault();

    let sellingPrice = parseFloat(document.getElementById('sellingPrice').value) || 0;
    let productName = document.getElementById('productName').value;
    let productDetailsText = `${sellingPrice} - ${productName}  `;

    var li = document.createElement('li');
    li.className = 'productDetails';
    li.appendChild(document.createTextNode(productDetailsText));

    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteButton';
    deleteBtn.appendChild(document.createTextNode('Delete Product'));
    li.appendChild(deleteBtn);

    saveProductToApi(productDetailsText)
        .then(response => {
            console.log(response.data);
            productDetails.appendChild(li);

            updateTotalAmount();
        })
        .catch(error => {
            console.error('Error saving data to API:', error);
        });
}

function removeItem(e) {
    if (e.target.classList.contains('deleteButton')) {
        if (confirm('Are You Sure?')) {
            let li = e.target.parentElement;
            productDetails.removeChild(li);

            let productDetailsText = li.textContent.trim();

            deleteProductFromApi(productDetailsText)
                .then(response => {
                    console.log(response.data);

                    updateTotalAmount();
                })
                .catch(error => {
                    console.error('Error deleting data from API:', error);
                });
        }
    }
}

function saveProductToApi(productDetailsText) {
    return axios.post(apiUrl, { details: productDetailsText });
}

function deleteProductFromApi(productDetailsText) {
    let crudId = extractCrudId(productDetailsText);

    let deleteUrl = `${apiUrl}/${crudId}`;

    return axios.delete(deleteUrl);
}

function extractCrudId(productDetailsText) {
    return productDetailsText.split(' ')[0];
}

function loadProductDetails() {
    axios.get(apiUrl)
        .then(response => {
            response.data.forEach(product => {
                var li = document.createElement('li');
                li.className = 'productDetails';
                li.appendChild(document.createTextNode(product.details));

                let deleteBtn = document.createElement('button');
                deleteBtn.className = 'deleteButton';
                deleteBtn.appendChild(document.createTextNode('Delete Product'));
                li.appendChild(deleteBtn);

                productDetails.appendChild(li);
            });

            updateTotalAmount();
        })
        .catch(error => {
            console.error('Error loading data from API:', error);
        });
}

function updateTotalAmount() {
    let totalAmount = Array.from(productDetails.children)
        .map(item => parseFloat(item.textContent.split('-')[0].trim()) || 0)
        .reduce((sum, amount) => sum + amount, 0);

    totalAmountElement.textContent = totalAmount.toFixed(2);
}
