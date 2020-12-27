import { BaseModel } from './_base.model';
export class PublicacionModel extends BaseModel {
	idpublicacion: number=0;
	plataforma: string;
	idplataforma:number;
    fechavencimiento:number;
    idproducto:number;
    estado:number;	
}
