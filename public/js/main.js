const socket = io();


const productList = document.getElementById("products");

socket.on("init", (products) => {
    productList.innerHTML = ""; 
    products.forEach((product) => {
        const li = createProduct(product);
        productList.appendChild(li);
    });
});

socket.on("new-product", (product) => {
    const li = createProduct(product);
    productList.appendChild(li);
});

socket.on("delete-product", (product) => {
    const li = [...productList.children].find((li) => {
        return li.querySelector("h2").textContent === product.title;
    });
    if (li) {
        productList.removeChild(li);
    }
});

socket.on("update-product", (product) => {
    const li = [...productList.children].find((li) => {
        return li.querySelector("h2").textContent === product.title;
    });
    if (li) {
        li.innerHTML = `
            <h2 class="text-lg font-semibold">${product.title}</h2>
            <p class="text-gray-700">Precio: $${product.price}</p>
            <p class="text-gray-500">Stock: ${product.stock} unidades</p>
        `;
    }
});

function createProduct(product) {
    const li = document.createElement("li");
    li.className = "border-b py-4"
    li.innerHTML = `
        <h2 class="text-lg font-semibold">${product.title}</h2>
        <p class="text-gray-700">Precio: $${product.price}</p>
        <p class="text-gray-500">Stock: ${product.stock} unidades</p>
        `;

    return li;
}
