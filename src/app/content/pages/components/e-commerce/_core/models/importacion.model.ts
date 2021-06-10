import { BaseModel } from './_base.model';
import { ProductoModel } from './producto.model';

export class ImportacionModel extends BaseModel {
	idimportacion: number;
	idusuario:number;
	numerofactura:string;
	fecha: Date;
	descripcion:string;
	
	productos: ProductoModel[];

	clear() {
		
        this.fecha=new Date();
		this.descripcion='';
		this.numerofactura='';

	}
}
