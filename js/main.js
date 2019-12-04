'use strict'; //activando modo de uso estricto de JS

//arreglo inicial para carro
let carro = [];
//se comprueba si existe un valor nulo para no asiganar al carro
if (JSON.parse(localStorage.getItem('carroLS')) !== null) {
    carro = JSON.parse(localStorage.getItem('carroLS'));
};

//seleccionando el area del carro en el DOM
const carroDOM = document.querySelector('.cart');

//capturando todos los eventos.
const botonesDelDomACarro = document.querySelectorAll('[data-action="ADD_TO_CART"]');

if (carro.length > 0) {
  carro.forEach(producto => {
     //se agrega productos al carro al presionar el boton (llamado a funcion)
     insertandoItemDom(producto)
     cuentaCarroTotal();

    //se bloquean los botones de los productos que estan el carro y vienen del local storage
    botonesDelDomACarro.forEach(botonDomCarro => {
        const productoDelDOM = botonDomCarro.parentNode;
        if (productoDelDOM.querySelector('.product__name').innerText === producto.nombre) {
            //llamando a funcion de manejo de botones
            manejoDeBotones(botonDomCarro,producto);
        };
    });
  });  
};

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
            //se agrega productos al carro al presionar el boton (llamado a funcion)
            insertandoItemDom(producto)

            //cargamos el arreglo del carro vacio con los productos seleccionados por boton
            carro.push(producto);

            //guardando en localstorege los resultados del carro
            localStorage.setItem('carroLS',JSON.stringify(carro));
            cuentaCarroTotal();
            
            //llamando a funcion de manejo de botones
            manejoDeBotones(botonDomCarro,producto);
        };
    });
});

/* =============================================================
                            Funciones 
============================================================= */
function insertandoItemDom(producto) {
    carroDOM.insertAdjacentHTML('beforeend',`
        <div class="cart__item">
            <img class="cart__item__image" src="${producto.imagen}" alt="${producto.nombre}">
            <h3 class="cart__item__name">${producto.nombre}</h3>
            <h3 class="cart__item__price">${producto.precio}</h3>
            <button class="btn btn--primary btn--small ${(producto.cantidad === 1 ? 'btn--danger':'')}"" data-action="DECRESE_ITEM">&minus;</button>
            <h3 class="cart__item__quantity">${producto.cantidad}</h3>
            <button class="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button>
            <button class="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button>
        </div>
    `);

        //se agregan los botenes al carro de borrar y pagar
    if (document.querySelector(".cart-footer") === null) {
        carroDOM.insertAdjacentHTML('afterend',`
            <div class="cart-footer">
                <button class="btn btn--danger" data-action="CLEAR_CART">Clear Cart</button>
                <button class="btn btn--primary" data-action="PAY_CART">Pay</button>
            </div>
        `);
        
        //usando el boton de borrar o clear
        document.querySelector('[data-action="CLEAR_CART"]').addEventListener('click',()=>{
            carroDOM.querySelectorAll('.cart__item').forEach(carroItemDom => {
                carroItemDom.classList.add('cart__item--removed');
                setTimeout(()=>carroItemDom.remove(),250);
            });
    
            carro = [];
            localStorage.removeItem('carroLS');
            cuentaCarroTotal();
            document.querySelector(".cart-footer").remove();
            botonesDelDomACarro.forEach(botonDomCarro => {
                botonDomCarro.innerText = "Add to Cart"; //cambiando nombre en boton
                botonDomCarro.disabled = false; //reactivando boton
            });
        });
        
        //usando el boton de pagar cuenta total
        document.querySelector('[data-action="PAY_CART"]').addEventListener('click',()=>{
            let paypalHTML = `
                <form id="paypalFomulario" action="https://www.paypal.com/cgi-bin/webscr" method="post">
                    <input type="hidden" name="cmd" value="_cart">
                    <input type="hidden" name="upload" value="1">
                    <input type="hidden" name="business" value="duran_juan@hotmail.com">
                `;   
                
                carro.forEach((carroItem,numero) => {
                    ++numero;
                    paypalHTML += `
                        <input type="hidden" name="item_name_${numero}" value="${carroItem.nombre}">
                        <input type="hidden" name="amount_${numero}" value="${carroItem.precio}">
                        <input type="hidden" name="quantity_${numero}" value="${carroItem.cantidad}">
                    `;
                });

                paypalHTML += `        
                    <input type="submit" value="PayPal">
                </form>
                <div class="overlay"></div>
                `;

                document.querySelector('body').insertAdjacentHTML('beforeend',paypalHTML);
                document.getElementById('paypalFomulario').submit();
        });
    };
};

function manejoDeBotones(botonDomCarro,producto) {
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
                localStorage.setItem('carroLS',JSON.stringify(carro));
                cuentaCarroTotal();
            });

            //disminuyendo cantidadcon boton -
            carroItemDom.querySelector('[data-action="DECRESE_ITEM"]').addEventListener('click', ()=>{
                if (producto.cantidad > 1) {
                    producto.cantidad--;
                    carroItemDom.querySelector('.cart__item__quantity').innerText = producto.cantidad;
                    localStorage.setItem('carroLS',JSON.stringify(carro));
                    cuentaCarroTotal();
                } else {
                    botonX(carroItemDom,producto,botonDomCarro); //llamando a funcion del boton x                         
                };
                if (producto.cantidad === 1) {
                    carroItemDom.querySelector('[data-action="DECRESE_ITEM"]').classList.add('btn--danger');
                };
            });

            //Eliminando producto del carro con boton X
            carroItemDom.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', ()=>{
                botonX(carroItemDom,producto,botonDomCarro); //llamando a funcion del boton x 
            });
        };
    });    
};

function botonX(carroItemDom,producto,botonDomCarro) {
    carroItemDom.classList.add('cart__item--removed');
    setTimeout(()=>carroItemDom.remove(),290);
    carro = carro.filter(carroItem => (carroItem.nombre !== producto.nombre));
    localStorage.setItem('carroLS',JSON.stringify(carro));
    cuentaCarroTotal();
    botonDomCarro.innerText = "Add to Cart"; //cambiando nombre en boton
    botonDomCarro.disabled = false; //reactivando boton
    if (carro.length < 1) {
        document.querySelector(".cart-footer").remove();
    };
};

// funcion para totalizar el costo del pedido en el carro
function cuentaCarroTotal() {
    let carroTotal = 0;
    carro.forEach(carroItem => {
        carroTotal = carroTotal + (carroItem.cantidad * carroItem.precio);
    });

    if (carro.length >= 1) {
        document.querySelector('[data-action="PAY_CART"]').innerText = `Pay $${carroTotal}`;
    };
    console.log(carroTotal);
};


