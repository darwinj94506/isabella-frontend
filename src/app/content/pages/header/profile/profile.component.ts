import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {UsuarioModel} from '../../components/e-commerce/_core/models/usuario.model';
import {UsuarioService} from '../../components/e-commerce/_core/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'm-profile',
	templateUrl: './profile.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
	loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();

  usuario:UsuarioModel;
  identity:any;
  usuarioForm: FormGroup;
  viewLoading=false;
  constructor(private _usuarioService:UsuarioService,private fb: FormBuilder,) {
   }

  ngOnInit() {
		this.getIdentity();
		console.log(this.usuario);
    this.createForm();
    this._usuarioService.findUsuarioByCedula(this.identity.cedula).subscribe(res=>{
			this.usuario=res;
			this.llenarCampos();
	    },error=>{
	      console.log(error);
	      alert("Ha ocurrido un error, vuelva a cargar la pagina");
	    })

  }
  getIdentity(){
    let identity=JSON.parse(localStorage.getItem('identity'));
    if(identity!="undefined"){
      this.identity=identity;
    }else{
      this.identity=null;
    }
	}
	
	get f() { return this.usuarioForm.controls; }

	llenarCampos(){
		// console.log(this.usuario);
		this.usuarioForm.patchValue({
			nombres:this.usuario.nombres,
			apellidos:this.usuario.apellidos,
			cedula: this.usuario.cedula,
			clave: this.usuario.clave,
			direccion: this.usuario.direccion,
			referencia: this.usuario.referencia,
			ciudad: this.usuario.ciudad,
			telefono :this.usuario.telefono,
			correo: this.usuario.correo

		})
	}
		
	createForm() {
		this.usuarioForm = this.fb.group({
			nombres: ['', Validators.compose([Validators.required,Validators.maxLength(255),Validators.minLength(3)])],
			apellidos: ['',Validators.compose([Validators.required,Validators.maxLength(255),Validators.minLength(3)])],
			cedula: ['', Validators.compose([Validators.required,Validators.maxLength(10),  Validators.pattern("^[0-9]*$"),
				Validators.minLength(10)])],
			clave: ['', Validators.compose([Validators.required,Validators.maxLength(50)])],
			// rol: [this.usuario.rol, Validators.required],
			direccion: ['', Validators.compose([Validators.required,Validators.maxLength(255)])],
			referencia: ['', Validators.compose([Validators.required,Validators.maxLength(255)])],
			ciudad: ['', Validators.compose([Validators.required,Validators.maxLength(255)])],
			telefono: ['', Validators.compose([Validators.required,Validators.maxLength(10),
				Validators.minLength(7),  Validators.pattern("^[0-9]*$")])],
			correo: ['', [Validators.required,Validators.email,Validators.maxLength(50)]]
		});
	}
	// createForm() {
	// 	this.usuarioForm = this.fb.group({
	// 		nombres: [this.usuario.nombres, Validators.compose([Validators.required,Validators.maxLength(255),Validators.minLength(3)])],
	// 		apellidos: [this.usuario.apellidos,Validators.compose([Validators.required,Validators.maxLength(255),Validators.minLength(3)])],
	// 		cedula: [this.usuario.cedula, Validators.compose([Validators.required,Validators.maxLength(10),  Validators.pattern("^[0-9]*$"),
	// 			Validators.minLength(10)])],
	// 		clave: [this.usuario.clave, Validators.compose([Validators.required,Validators.maxLength(50)])],
	// 		// rol: [this.usuario.rol, Validators.required],
	// 		direccion: [this.usuario.direccion, Validators.compose([Validators.required,Validators.maxLength(255)])],
	// 		referencia: [this.usuario.referencia, Validators.compose([Validators.required,Validators.maxLength(255)])],
	// 		ciudad: [this.usuario.ciudad, Validators.compose([Validators.required,Validators.maxLength(255)])],
	// 		telefono: [this.usuario.telefono, Validators.compose([Validators.required,Validators.maxLength(10),
	// 			Validators.minLength(7),  Validators.pattern("^[0-9]*$")])],
	// 		correo: [this.usuario.correo, [Validators.required,Validators.email,Validators.maxLength(50)]]
	// 	});
  // }
  prepareCustomer(): UsuarioModel {
		const controls = this.usuarioForm.controls;
		const _usuario = new UsuarioModel();
		_usuario.idusuario = this.usuario.idusuario;
		// console.log('_usuario', _usuario);
		_usuario.nombres = controls['nombres'].value;
		_usuario.apellidos = controls['apellidos'].value;
		_usuario.cedula = controls['cedula'].value;
		_usuario.clave = controls['clave'].value;
		_usuario.rol = this.usuario.rol;
		_usuario.direccion = controls['direccion'].value;
		_usuario.referencia = controls['referencia'].value;
		_usuario.ciudad = controls['ciudad'].value;
		_usuario.telefono = controls['telefono'].value;
		_usuario.correo = controls['correo'].value;
		return _usuario;
  }

  onSubmit() {
		// this.hasFormErrors = false;
		this.viewLoading = true;
		const controls = this.usuarioForm.controls;
		/** check form */
		if (this.usuarioForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
      );
      alert("Corrija los errores, e inténtelo nuevamente");

			// this.hasFormErrors = true;
			return;
    }
    const user = this.prepareCustomer();
    this._usuarioService.crudUsuario(user,2).subscribe(res => {
			alert("Datos actualizados");
			this.viewLoading = false;
		},error=>{
			alert("Ha ocurrido un error en la solicitud:"+error);
			// console.log(error);
			this.viewLoading = false;
		}
		);


}
}