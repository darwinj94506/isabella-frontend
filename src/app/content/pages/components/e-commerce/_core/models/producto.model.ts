import { BaseModel } from './_base.model';
export class ProductoModel extends BaseModel {
	idproducto: number = 0;
	idpresentacion:number = 0;
    codigo:string = "";
	titulo: string = "";
	descripcion: string ="";
	pvp:number = 0;
	codigofabricante: string ="";
	imagenes:string[] = [];
	iva:number = 1;
	stock_minimo:number = 4;
	talla: number = null;
	unidad_medida: string = null;
	cantidad:number = null;
	estado:number;

	_stock: number;
	idcategoria: number;
	categoria: string;
	idclasificacion: number;
	clasificacion:string;
	idmarca:number;
	marca:string;
	presentacion:string;

	clear() {
		this.idpresentacion = 0;
		this.codigo='';
		this.titulo='';
		this.descripcion='';
		this.pvp=null;
		this.codigofabricante='';
		this.imagenes=[];
		this.iva=null;
		this.stock_minimo=4;
		this.talla=null;
		this.unidad_medida=null;
		this.cantidad=null;
		this.estado=null;

		this.idcategoria = 0;
		this.categoria = ""
		this.idclasificacion = 0;
		this.clasificacion = ""
		this.idmarca = 0;
		this.marca = "";
		this.presentacion = "";


	}
}
