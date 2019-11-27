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
            precio: productoDelDOM.querySelector('.product__price').innerText,
            cantidad: 1
        };
        
        //se revisa que productos estan el carro, si es asi, no se agrega
        const estaEnCarro = (carro.filter(carroItem =>(carroItem.nombre === producto.nombre)).length > 0);
        
        if (estaEnCarro === false) {
            //se agrega productos al carro al presionar el boton
            carroDOM.insertAdjacentHTML('beforeend',`
                <div class="cart__item">
                    <img class="cart__item__image" src="${producto.imagen}" alt="${producto.nombre}">
                    <h3 class="cart__item__name">${producto.nombre}</h3>
                    <h3 class="cart__item__price">${producto.precio}</h3>
                    <button class="btn btn--primary btn--small btn--danger" data-action="DECRESE_ITEM">&minus;</button>
                    <h3 class="cart__item__quantity">${producto.cantidad}</h3>
                    <button class="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button>
                    <button class="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button>
                </div>
            `);
            //cargamos el arreglo del carro vacio con los productos seleccionados por boton
            carro.push(producto);
            botonDomCarro.innerText = "In Cart"; //cambiando nombre en boton
            botonDomCarro.disabled = true; //desactivando boton

            //leyendo botones presionados en el carro y actuando segun el boton activado
            const carroItemsDOM = carroDOM.querySelectorAll('.cart__item');
            carroItemsDOM.forEach(carroItemDom => {
                
                if (carroItemDom.querySelector('.cart__item__name').innerText === producto.nombre) {

                    //incrementado cantidadcon boton +
                    carroItemDom.querySelector('[data-action="INCREASE_ITEM"]').addEventListener('click', ()=>{
                        producto.cantidad++;
                        carroItemDom.querySelector('.cart__item__quantity').innerText = producto.cantidad;
                        carroItemDom.querySelector('[data-action="DECRESE_ITEM"]').classList.remove('btn--danger');
                    });

                    //disminuyendo cantidadcon boton -
                    carroItemDom.querySelector('[data-action="DECRESE_ITEM"]').addEventListener('click', ()=>{
                        if (producto.cantidad > 1) {
                            producto.cantidad--;
                            carroItemDom.querySelector('.cart__item__quantity').innerText = producto.cantidad;
                        } else {
                            carroItemDom.classList.add('cart__item--removed');
                            setTimeout(()=>carroItemDom.remove(),290);
                            carro = carro.filter(carroItem => (carroItem.nombre !== producto.nombre));
                            botonDomCarro.innerText = "Add to Cart"; //cambiando nombre en boton
                            botonDomCarro.disabled = false; //reactivando boton
                            
                        };
                        if (producto.cantidad === 1) {
                            carroItemDom.querySelector('[data-action="DECRESE_ITEM"]').classList.add('btn--danger');
                        }
                    });

                    //Eliminando producto del carro con boton X
                    carroItemDom.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', ()=>{
                        carroItemDom.classList.add('cart__item--removed');
                        setTimeout(()=>carroItemDom.remove(),290);
                        carro = carro.filter(carroItem => (carroItem.nombre !== producto.nombre));
                        botonDomCarro.innerText = "Add to Cart"; //cambiando nombre en boton
                        botonDomCarro.disabled = false; //reactivando boton
                    });
                };
            });
        };
    });
});



