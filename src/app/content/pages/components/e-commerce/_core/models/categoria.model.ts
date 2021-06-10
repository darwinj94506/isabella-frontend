import { BaseModel } from './_base.model';
export class CategoriaModel extends BaseModel {
	idcategoria: number=0;
    nombre:string;
    fecha?:Date;
	estado?: number;
	clear() {
		this.nombre='';
	}
}
