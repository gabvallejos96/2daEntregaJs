if(localStorage.length>0){
    var carrito = JSON.parse(localStorage.getItem("arreglo"));
}else{
    var carrito = [];
}


$(document).ready(function(){

	// AGREGANDO CLASE ACTIVE AL PRIMER ENLACE ====================
	$('.new-categories .new-category_item[category="all"]').addClass('newcls');

	// FILTRANDO PRODUCTOS  ============================================

	$('.new-category_item').click(function(){
		var catProduct = $(this).attr('category');
		

		// AGREGANDO CLASE ACTIVE AL ENLACE SELECCIONADO
		$('.new-category_item').removeClass('newcls');
		$(this).addClass('newcls');

		// OCULTANDO PRODUCTOS =========================
		$('.new-prod').css('transform', 'scale(0)');
		function hideProduct(){
			$('.new-prod').hide();
		} setTimeout(hideProduct,650);

		// MOSTRANDO PRODUCTOS =========================
		function showProduct(){
			$('.new-prod[category="'+catProduct+'"]').show();
			$('.new-prod[category="'+catProduct+'"]').css('transform', 'scale(1)');
		} setTimeout(showProduct,650);
	});

	// MOSTRANDO TODOS LOS PRODUCTOS =======================

	$('.new-category_item[category="all"]').click(function(){
		function showAll(){
            imprimirProductos();
			$('.new-prod').show();
			$('.new-prod').css('transform', 'scale(1)');
		} setTimeout(showAll,650);
	});

let botonComprar = document.getElementById('comprarProductos');
botonComprar.addEventListener("click", () => comprar());

// carrito
var carrito = [];
localStorage.setItem("arreglo", JSON.stringify(carrito));

let botonCarrito = document.getElementById("carritoDeCompras");
botonCarrito.addEventListener("click", () => cargarCarrito());

let vaciarCarrito = document.getElementById("vaciarCarrito");
vaciarCarrito.addEventListener("click", () => vaciarElCarrito());




imprimirProductos();

let form = document.getElementById("barraDeBusqueda");
form.addEventListener("submit", (e) => {
e.preventDefault();
let inp = e.target.children;
console.log(inp[0].value);
buscarProductos(inp[0].value);

})

})

//Funciones

// Imprimir productos

const imprimirProductos = () => {
fetch("data.json")
.then(response => response.json())
.then(data => {
    let contenedor = document.getElementById("contenedor");
    contenedor.innerHTML="";
data.forEach(product => {
    
    let div = document.createElement("div");
        div.innerHTML= `
        <div class="new-prod" category=${product.cat}>
                            <div class="new-prod-img">
                                <img class="new-prodimg" src="${product.imagen}" alt="${product.nombre}">
                            </div>
                            <div class="new-text-prod">
                                <p class="new-title-product">${product.nombre}</p>
                                <p class="new-price-product">${product.precio}</p>
                                <div class="">
                                <button id="boton${product.id}" type="button" class="new-buy-text">Agregar</button>
                                </div>
                            </div>
                            
                        </div>
        `;
        contenedor.append(div);
        let boton = document.getElementById(`boton${product.id}`);
        boton.addEventListener("click", () => ejecutar(product.id));
});
})
}

function comprar(){
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Compra realizada con exito',
        showConfirmButton: false,
        timer: 2000
      })
      vaciarElCarrito();
      cargarCarrito();
}

// Buscar productos

function buscarProductos(name){
	let busqueda = [];

	fetch("data.json")
.then(response => response.json())
.then(data => {
    data.forEach(item=>{
        if(item.nombre.toLocaleUpperCase().includes(name.toLocaleUpperCase())){
            busqueda.push(item);
        }
    })
    cargarProductos(busqueda);
})


}

const cargarProductos = (product) => {
    let contenedor = document.getElementById("contenedor");
    contenedor.innerHTML="";
    product.forEach(product =>{
        let div = document.createElement("div");
        div.innerHTML = `
        <div class="new-prod" category=${product.cat}>
                            <div class="new-prod-img">
                                <img class="new-prodimg" src="${product.imagen}" alt="${product.nombre}">
                            </div>
                            <div class="new-text-prod">
                                <p class="new-title-product">${product.nombre}</p>
                                <p class="new-price-product">${product.precio}</p>
                                <div class="">
                                <button id="boton${product.id}" type="button" class="new-buy-text">Agregar</button>
                                </div>
                            </div>
                            <p class="contadorproducts">${contador(product.id)}</p>
                        </div>
        `;
        contenedor.append(div);

        let boton = document.getElementById(`boton${product.id}`);
        boton.addEventListener("click", () => ejecutar(product.id));
        });
}

const contador = (id) => {
    let cont = 0;
    let arrdom = JSON.parse(localStorage.getItem("arreglo"));

    arrdom.forEach(num =>{
        if(num == id){
            cont++;
        }
    })
    
    console.log(cont);
    if(cont>0){
        return String(cont);
    } else {
        return "";
    }
}


function ejecutar(id){

    

   if(carrito.length === 0){
    carrito.push({producto:id, cantidad:1});
   } else if(carrito.some(pedido => pedido.producto===id)){
    console.log('ya hay un elemento en el carrito con esta id');
    const indice = carrito.findIndex(item=> item.producto===id);
    carrito[indice].cantidad++;
   
   }  else {
    carrito.push({producto:id, cantidad:1});
    
   }

    localStorage.setItem("arreglo", JSON.stringify(carrito));
    
   
   
   
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'El producto ha sido agregado al carrito exitosamente',
        showConfirmButton: false,
        timer: 1000
      })

   }

function vaciarElCarrito(){
    localStorage.clear();
    cargarCarrito();
    carrito = [];
}

function eliminar(id) {
const indice = carrito.findIndex(carrito => carrito.producto === id);
console.log(indice);
carrito.splice(indice,1);
if(carrito.length===0){
    console.log('carrito vacio');
    vaciarElCarrito();
} else{
    localStorage.setItem("arreglo", JSON.stringify(carrito));
    cargarCarrito();
}

}


function cargarCarrito(){
    let carritoDeCompras = JSON.parse(localStorage.getItem("arreglo"));
    let contenido = document.getElementById("modalBody");
    contenido.innerHTML="";
   

    if(carritoDeCompras == null){
        contenido.innerHTML=`El carrito esta vacio`;   
       }else{
           let vectorTemp = [];

        fetch("data.json")
        .then(response =>response.json())
        .then(data => {
            let total = 0;
            carritoDeCompras.forEach(id => {
                vectorTemp.push(data.find(item => item.id === id.producto));

                let prod = data.find(item => item.id === id.producto);
                

                let str = prod.precio;
                        str = str.replace("$","");
                        str = str.replace(".","");
                        str = str.replace(",00","");
                        price = parseFloat(str);
                        price = price*id.cantidad;


                        let tr = document.createElement("tr");
                        tr.innerHTML=`
                        <th>${prod.nombre}</th>
                        <th><img src="${prod.imagen}" class="imgmodal" alt=""></th>
                        <th>${id.cantidad}</th>
                        <th>$${price}</th>
                        <th><button id="eliminar${prod.id}" type="button" class="new-buy-text"><img src="../media/faticon/eliminar.png" class="faticon" alt=""></button></th>
                        `;
                        total+=price;
                        contenido.append(tr);
                });
                
                contenido.innerHTML+=`
                <p>Total: $${total}</p>`;

                carritoDeCompras.forEach(prod => {
                    console.log(prod);
                    let botoncitoDeEliminar = document.getElementById(`eliminar${prod.producto}`);
                    botoncitoDeEliminar.addEventListener("click", () => eliminar(prod.producto));
                })
                
            })
        } 
           
   
       } 


    