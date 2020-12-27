import { BaseModel } from './_base.model';

export class ImportacionProductoModel  extends BaseModel {
	idimportacionproducto: number;
	idproducto: number;
	idimportacion: number;
	cantidad:number;
	mec:number;

	// Refs
	_titulo:string;
    _descripcion:string;
	_codigo: string;
	_codigofabricante:string;
	_costo:number;
	_imagenes:any[];
	_stock:number;


	clear(importacionId: number) {
		this.idproducto = 0;
		this.idimportacion = importacionId;
		this.cantidad=0;
		this.mec=0;
		this._imagenes=[];
	}
}
