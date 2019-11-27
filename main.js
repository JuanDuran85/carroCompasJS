'use strict'; //activando modo de uso estricto de JS

//arreglo inicial para carro
let carro = [];

//seleccionando el area del carro en el DOM
const carroDOM = document.querySelector('.cart');

//capturando todos los eventos.
const botonesDelDomACarro = document.querySelectorAll('[data-action="ADD_TO_CART"]');

//usando funcion para navegar en los botons teniendo acceso por individual a cada uno de ellos
botonesDelDomACarro.forEach(botonDomCarro => {
    botonDomCarro.addEventListener('click',() => { //se verifica cual boton fue accionado
        const productoDelDOM = botonDomCarro.parentNode;
        const producto = { //se guarda cada elemento del boton accionado
            imagen: productoDelDOM.querySelector('.product__image').getAttribute('src'),
            nombre: productoDelDOM.querySelector('.product__name').innerText,
            precio: productoDelDOM.querySelector('.product__price').innerText
        };
        
        //se revisa que productos estan el carro, si es asi, no se agrega
        const estaEnCarro = (carro.filter(carroItem =>(carroItem.nombre === producto.nombre)).length > 0);
        
        if (estaEnCarro === false) {
            //se agrega productos al carro al presionar el boton
            carroDOM.insertAdjacentHTML('beforeend',`
                <div class="cart__item">
                    <img class="cart__item__image" src="${producto.imagen}" alt="${producto.nombre}">
                    <h3 class="class__item__name">${producto.nombre}</h3>
                    <h3 class="class__item__price">${producto.precio}</h3>
                </div>
            `);
            //cargamos el arreglo del carro vacio con los productos seleccionados por boton
            carro.push(producto);
            botonDomCarro.innerText = "In Cart"; //cambiando nombre en boton
        };
    });
});



