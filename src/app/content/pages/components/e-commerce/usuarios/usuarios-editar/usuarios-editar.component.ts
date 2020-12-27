import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypesUtilsService } from '../../_core/utils/types-utils.service';
import { UsuarioService } from '../../_core/services/index';
import { UsuarioModel } from '../../_core/models/usuario.model';

@Component({
  selector: 'm-usuarios-editar',
	templateUrl: './usuarios-editar.component.html',
	styleUrls:['./usuarios-editar.component.css']
})
export class UsuariosEditarComponent implements OnInit {

    usuario: UsuarioModel;
	usuarioForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

  roles=[{id:1,nombre:"Administrador"},{id:2,nombre:"Empleado"},{id:3,nombre:"Cliente"}]
	oldPassword:string
	constructor(public dialogRef: MatDialogRef<UsuariosEditarComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private usuarioService: UsuarioService,
		private typesUtilsService: TypesUtilsService) { }

	/** LOAD DATA */
	ngOnInit() {
		this.usuario = this.data.usuario;
		console.log(this.usuario);
		this.createForm();
		this.oldPassword=this.data.usuario.clave;		
		this.comprobarRol();
		console.log(this.usuario.clave);

		/* Server loading imitation. Remove this on real code */
		// this.viewLoading = true;
		// setTimeout(() => {
		// 	this.viewLoading = false;
		// }, 1000);
	}

	  // convenience getter for easy access to form fields
		get f() { return this.usuarioForm.controls; }
		
	createForm() {
		this.usuarioForm = this.fb.group({
			nombres: [this.usuario.nombres, Validators.compose([Validators.required,Validators.maxLength(255),Validators.minLength(3)])],
			apellidos: [this.usuario.apellidos,Validators.compose([Validators.required,Validators.maxLength(255),Validators.minLength(3)])],
			cedula: [this.usuario.cedula, Validators.compose([Validators.required,Validators.maxLength(10),  Validators.pattern("^[0-9]*$"),
				Validators.minLength(10)])],
			clave: [this.usuario.clave, Validators.compose([Validators.required,Validators.maxLength(50)])],
			rol: [this.usuario.rol, Validators.required],
			direccion: [this.usuario.direccion, Validators.compose([Validators.required,Validators.maxLength(255)])],
			referencia: [this.usuario.referencia, Validators.compose([Validators.required,Validators.maxLength(255)])],
			ciudad: [this.usuario.ciudad, Validators.compose([Validators.required,Validators.maxLength(255)])],
			telefono: [this.usuario.telefono, Validators.compose([Validators.required,Validators.maxLength(10),
				Validators.minLength(7),  Validators.pattern("^[0-9]*$")])],
			correo: [this.usuario.correo, [Validators.required,Validators.email,Validators.maxLength(50)]]
		});
	}

	/** UI */
	getTitle(): string {
		if (this.usuario.idusuario > 0) {
			return `Editar usuario: ' ${this.usuario.nombres} ${this.usuario.apellidos}'`;
		}

		return 'Nuevo usuario';
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.usuarioForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */
	prepareCustomer(): UsuarioModel {
		const controls = this.usuarioForm.controls;
		const _usuario = new UsuarioModel();
		_usuario.idusuario = this.usuario.idusuario;
		console.log('_usuario', _usuario);
		_usuario.nombres = controls['nombres'].value;
		_usuario.apellidos = controls['apellidos'].value;
		_usuario.cedula = controls['cedula'].value;
		_usuario.clave = controls['clave'].value;
		_usuario.rol = controls['rol'].value;
		_usuario.direccion = controls['direccion'].value;
		_usuario.referencia = controls['referencia'].value;
		_usuario.ciudad = controls['ciudad'].value;
		_usuario.telefono = controls['telefono'].value;
		_usuario.correo = controls['correo'].value;
		return _usuario;
	}

	onSubmit() {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.usuarioForm.controls;
		/** check form */
		if (this.usuarioForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedProducto = this.prepareCustomer();
		if (editedProducto.idusuario > 0) {
			this.updateCustomer(editedProducto);
		} else {
			this.createCustomer(editedProducto);
		}
	}

	updateCustomer(usuario: UsuarioModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.usuarioService.crudUsuario(usuario,2).subscribe(res => {
			/* Server loading imitation. Remove this on real code */
			this.viewLoading = false;
			this.viewLoading = false;
			this.dialogRef.close(
				usuario
				// isEdit: truetrue
			);
		},error=>{
			alert("Ha ocurrido un error en la solicitud:"+error);
			console.log(error);
			this.viewLoading = false;
		}
		);
	}

	createCustomer(usuario: UsuarioModel) { 
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.usuarioService.crudUsuario(usuario,1).subscribe(res=> {
			console.log(res);

			if(res._info_id){
				usuario.idusuario=res._idusuario
				this.dialogRef.close(
					usuario
					// isEdit: false
				);

			}else{
				alert(res._info_desc);
			}
			this.viewLoading = false;
			
		},error=>{
			alert("Ha ocurrido un error en la solicitud:"+error);
			console.log(error);
			this.viewLoading = false;
		}

		);
	}

	esCliente=false;
	comprobarRol(){
		/*cuando el rol es cliente se desactiva el campo contraseña xq ese usuario no tiene acceso al sistema, se asigana una
		  clave por default (123) porque para otros roles es obligatorio poner una clave.
		*/
		
		if(this.usuarioForm.controls['rol'].value==3){ 
			this.esCliente=true;
			this.usuarioForm.patchValue({clave:"123"})
		}else{
			this.esCliente=false;
			this.usuarioForm.patchValue({clave:this.oldPassword})
		}
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	onNoClick(): void {
		this.dialogRef.close();
	}
}
