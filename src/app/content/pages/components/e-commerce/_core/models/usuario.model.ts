export class UsuarioModel {
    idusuario:number;
    nombres:string;
    apellidos:string;
    clave:string;
    cedula:string;
    correo:string;
    rol:number;
    direccion:string;
    referencia:string;
    ciudad:string;
    telefono:string;



    	clear() {
        this.idusuario=0;
		this.nombres='';
        this.apellidos='';
		this.clave='';
        this.cedula='';
        this.direccion='';
        this.referencia='';
        this.ciudad='';
        this.telefono='';
        this.correo='';
    
	}
}