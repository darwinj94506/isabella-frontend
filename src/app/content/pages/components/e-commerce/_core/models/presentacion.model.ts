import { BaseModel } from './_base.model';
export class PresentacionModel extends BaseModel {
	idpresentacion: number;
    idcategoria: number;
    idmarca: number;
    nombre: string;
	clear() {
		this.idpresentacion = 0;
		this.idcategoria=0;
		this.idcategoria=0;
		this.nombre='';
	}
}