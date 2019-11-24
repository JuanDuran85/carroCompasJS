'use strict'; //activando modo de uso estricto de JS

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
        console.table(producto);
    });
});



