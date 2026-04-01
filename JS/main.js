
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
let catalogo = []

const lista = document.getElementById("lista")
const total = document.getElementById("total")
const btnAgregar = document.getElementById("agregar")
const btnVaciar = document.getElementById("vaciar")
const catalogoHTML = document.getElementById("catalogo")

class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre
    this.precio = precio
  }
}

async function cargarCatalogo() {
  try {
    const response = await fetch("./data/productos.json")
    catalogo = await response.json()
    renderizarCatalogo()
  } catch (error) {
    console.error("Error cargando JSON:", error)
  }
}

function renderizarCatalogo() {
  catalogoHTML.innerHTML = ""

  catalogo.forEach((prod, index) => {
    const li = document.createElement("li")

    li.innerHTML = `
      ${prod.nombre} - $${prod.precio}
      <button class="catalogo-btn" data-id="${index}">Agregar</button>
    `;

    catalogoHTML.appendChild(li)
  })

  document.querySelectorAll(".catalogo-btn").forEach(btn => {
    btn.addEventListener("click", agregarDesdeCatalogo)
  })
}

function agregarDesdeCatalogo(e) {
  const index = e.target.getAttribute("data-id")
  const prod = catalogo[index]

  carrito.push(new Producto(prod.nombre, prod.precio))
  renderizarCarrito()
}

function renderizarCarrito() {
  lista.innerHTML = ""
  let suma = 0

  carrito.forEach((producto, index) => {
    const li = document.createElement("li")

    li.innerHTML = `
      ${producto.nombre} - $${producto.precio}
      <button class="eliminar" data-id="${index}">X</button>
    `

    lista.appendChild(li)
    suma += producto.precio
  })

  total.innerText = "Total: $" + suma

  localStorage.setItem("carrito", JSON.stringify(carrito))

  document.querySelectorAll(".eliminar").forEach(btn => {
    btn.addEventListener("click", eliminarProducto)
  })
}

function agregarProducto() {
  const nombreInput = document.getElementById("nombre")
  const precioInput = document.getElementById("precio")

  const nombre = nombreInput.value.trim()
  const precio = parseFloat(precioInput.value)

  if (nombre === "" || isNaN(precio) || precio <= 0) {
    alert("Ingresá datos válidos")
    return
  }

  carrito.push(new Producto(nombre, precio))

  nombreInput.value = ""
  precioInput.value = ""

  renderizarCarrito()
}

function eliminarProducto(e) {
  const index = e.target.getAttribute("data-id")
  carrito.splice(index, 1)
  renderizarCarrito()
}

function vaciarCarrito() {
  carrito = []
  renderizarCarrito()
}

btnAgregar.addEventListener("click", agregarProducto)
btnVaciar.addEventListener("click", vaciarCarrito)

cargarCatalogo()
renderizarCarrito()
