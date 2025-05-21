const socket = io();
const productList = document.getElementById("products");
const messageDiv = document.getElementById("message");

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
  li.className = "border-b py-4";
  const thumbnail =
    Array.isArray(product.thumbnails) && product.thumbnails.length > 0
      ? product.thumbnails[0]
      : "https://via.placeholder.com/150";
  li.innerHTML = `
        <img src="${thumbnail}" alt="Imagen de ${
    product.title
  }" class="w-32 mb-2 rounded">
        <h2 class="text-lg font-semibold">${product.title}</h2>
        <p class="text-gray-700">${product.description || ""}</p>
        <p class="text-gray-700">Precio: $${product.price}</p>
        <p class="text-gray-500">Stock: ${product.stock} unidades</p>
        <button class="edit-btn bg-yellow-500 text-white px-2 py-1 rounded mt-2" data-id="${
          product._id
        }">Editar</button>
    `;
  li.querySelector(".edit-btn").addEventListener("click", () => {
    alert(`proximamente`);
  });

  return li;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addProductForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.thumbnails) {
      data.thumbnails = [data.thumbnails];
    } else {
      data.thumbnails = [];
    }
    console.log(data);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 400) {
        messageDiv.textContent = "El producto ya existe";
        setTimeout(() => {
          messageDiv.textContent = "";
        }, 3000);
        return;
      }

      if (response.ok) {
        form.reset();
        console.log("Producto agregado correctamente");
      } else {
        const error = await response.json();
        console.log(
          "Error: " + (error.error || "No se pudo agregar el producto")
        );
      }
    } catch (err) {
      console.log("Error de red");
    }
  });
});
