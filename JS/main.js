
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
let catalogo = []

const lista = document.getElementById("lista")
const total = document.getElementById("total")
const btnAgregar = document.getElementById("agregar")
const btnVaciar = document.getElementById("vaciar")
const catalogoHTML = document.getElementById("catalogo")


function Producto(nombre, precio){
  this.nombre = nombre
  this.precio = precio
}


async function cargarCatalogo() {
  try {
    const respuesta = await fetch("./DATA/productos.json")
    catalogo = await respuesta.json()
    renderizarCatalogo()
  } catch (error) {
    console.error("Error cargando JSON:", error)
  }
}

function renderizarCatalogo() {
  catalogoHTML.innerHTML = ""

  catalogo.forEach((prod, index) => {
    const lista = document.createElement("li")

    lista.innerHTML = `
      ${prod.nombre} - $${prod.precio}
      <button class="catalogo-btn" data-id="${index}">Agregar</button>
    `

    catalogoHTML.appendChild(lista);
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
    const lista = document.createElement("li")

    lista.innerHTML = `
      ${producto.nombre} - $${producto.precio}
      <button class="eliminar" data-id="${index}">X</button>
    `

    lista.appendChild(lista);
    suma += producto.precio;
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

  const nombre = nombreInput.value
  const precio = parseFloat(precioInput.value)

  if (nombre === "" || isNaN(precio) || precio <= 0) {
    alert("Ingresá datos válidos")
    return
  }

  carrito.push(new Producto(nombre, precio))

  nombreInput.value = ""
  precioInput.value = ""

  renderizarCarrito();
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