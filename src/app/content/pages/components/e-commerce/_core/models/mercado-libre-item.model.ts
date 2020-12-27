export class MercadoLibreItem{
    title:string;
    category_id:string;
    price:number;
    currency_id:string;
    available_quantity:number;
    buying_mode:string;
    listing_type_id:string;
    description: any;
    // video_id: string;
    attributes:any[];
    pictures:any[]=[];
    constructor(titulo:string,descripcion:string,precio:number,cantidad:number,imagenes:string[]){
        this.title=titulo;
        this.price=precio;
        this.available_quantity=cantidad;
        //valores por defecto exigidos por mercado libre
        this.category_id="MEC1910";
        this.currency_id="USD";
        //concatena la descripcion propia del producto con la descripcion general de envío
        this.formarDescripcion(descripcion);
        this.buying_mode="buy_it_now";
        this.listing_type_id="free";
        this.attributes=[{"id":"ITEM_CONDITION","value_id":"2230284"}];
        
        imagenes.forEach(element =>{ 
            let im=new Object();
            im["source"]=element;
            this.pictures.push(im);            
        });
    }

    formarDescripcion(descripcionProducto){
        this.description={
            "plain_text":`
            ${descripcionProducto} \n
            Envíos a nivel nacional con cargo adicional*\n
            - Servientrega\n 
            - Urbano\n
            - Tramaco\n 
            - Laar Courier\n 
            - Transporte Cooperativa\n
            Entregas un día hábil después de realizada la compra**.\n
            Formas de pagos\n 
            - Depósitos y transferencia Bancarias**\n
            - Pagos por medio de Tiendas Mi Vecino y Servipagos\n 
            - Tarjeta de Crédito y,\n 
            - Paypal\n
            * Valores por envío, consultar una vez realizada la compra.\n 
            ** Transferencias interbancarias pueden hacerse efectivas en 24 horas\n 
            *** El tiempo de entrega por parte del courier, depende de la ciudad puede demorar hasta 48 horas en la Zona Continental, Galápagos o envíos especiales hasta 72 horas laborables
        `
        }
    }
}


// formato de json a enviar en la solicitud 
//{
//     "title":"Item de test - No Ofertar",
//     "category_id":"MEC1910",
//     "price":10,
//     "currency_id":"USD",
//     "available_quantity":1,
//     "buying_mode":"buy_it_now",
//     "listing_type_id":"free",
//     "description": "no ofertar item de prueba",
//     "video_id": "YOUTUBE_ID_HERE",
//     "attributes":[
//         {"id":"ITEM_CONDITION","value_id":"2230284"}
//         ],
//     "pictures":[
//     {"source":"http://mla-s2-p.mlstatic.com/968521-MLA20805195516_072016-O.jpg"}
//     ]
//     }
    