import { BaseModel } from './_base.model';
export class ProductoModel extends BaseModel {
	idproducto: number=0;
	idtipo:number;
    codigo:string;
	titulo: string;
	descripcion: string;
	precio1:number=0.5;
	precio2:number=0.4;
	precio3:number=0.3;
	costo:number;
	codigofabricante:string;
	preciofacturar:number;
	preciomercadolibre:number;
	imagenes:string[]=[];
	_stock:number;
	
	clear() {
		this.codigo='';
		this.titulo='';
		this.descripcion='';
		this.idtipo=0;
		this.precio1=0.5;
		this.precio2=0.4;
		this.precio3=0.3;
		this.costo=null;
		this.codigofabricante='';
		this.preciofacturar=null;
		this.preciomercadolibre=null;
		this.imagenes=[];

	}
}
