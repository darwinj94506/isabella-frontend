import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { TypesUtilsService } from '../components/e-commerce/_core/utils/types-utils.service';
import {  BehaviorSubject } from 'rxjs';
import { UsuarioService } from '../../components/e-commerce/_core/services/index';
import { UsuarioModel } from '../../components/e-commerce/_core/models/usuario.model';
import { LayoutUtilsService, MessageType } from '../../components/e-commerce/_core/utils/layout-utils.service';
@Component({
  selector: 'm-datos-cliente',
  templateUrl: './datos-cliente.component.html',
  styleUrls: ['./datos-cliente.component.scss']
})
export class DatosClienteComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  constructor(private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private usuarioService: UsuarioService) { }
    
    usuario: UsuarioModel;
    usuarioForm: FormGroup;
    hasFormErrors: boolean = false;
    viewLoading: boolean = false;
    loadingAfterSubmit: boolean = false;

    ngOnInit() {
      this.loadingSubject.next(true);
      this.usuario=new UsuarioModel();
      this.usuario.clear();
      console.log(this.usuario);
      this.createForm();
    //   this.viewLoading = true;
    //   	setTimeout(() => {
		// 	this.viewLoading = false;
		// }, 1000);
    }
    // convenience getter for easy access to form fields
		get f() { return this.usuarioForm.controls; }
  
    createForm() {
      this.loadingSubject.next(false);
      this.usuarioForm = this.fb.group({
			nombres: [this.usuario.nombres, Validators.compose([Validators.required,Validators.maxLength(255),Validators.minLength(3)])],
			apellidos: [this.usuario.apellidos,Validators.compose([Validators.required,Validators.maxLength(255),Validators.minLength(3)])],
			cedula: [this.usuario.cedula, Validators.compose([Validators.required,Validators.maxLength(10),  Validators.pattern("^[0-9]*$"),
				Validators.minLength(10)])],
			// clave: [this.usuario.clave, Validators.compose([Validators.required,Validators.maxLength(50)])],
			// rol: [this.usuario.rol, Validators.required],
			direccion: [this.usuario.direccion, Validators.compose([Validators.required,Validators.maxLength(255)])],
			referencia: [this.usuario.referencia, Validators.compose([Validators.required,Validators.maxLength(255)])],
			ciudad: [this.usuario.ciudad, Validators.compose([Validators.required,Validators.maxLength(255)])],
			telefono: [this.usuario.telefono, Validators.compose([Validators.required,Validators.maxLength(10),
				Validators.minLength(7),  Validators.pattern("^[0-9]*$")])],
			correo: [this.usuario.correo, [Validators.required,Validators.email,Validators.maxLength(50)]]
		});
    }

    isControlInvalid(controlName: string): boolean {
      const control = this.usuarioForm.controls[controlName];
      const result = control.invalid && control.touched;
      return result;
    }
    prepareCustomer(): UsuarioModel {
      const controls = this.usuarioForm.controls;
      const _usuario = new UsuarioModel();
      _usuario.idusuario = 0;
      _usuario.nombres = controls['nombres'].value;
      _usuario.apellidos = controls['apellidos'].value;
      _usuario.cedula = controls['cedula'].value;
      _usuario.clave = ''; //no tiene clave 
      _usuario.rol = 3; //rol 3 cliente no tiene acceso al sistema
      _usuario.direccion = controls['direccion'].value;
      _usuario.referencia = controls['referencia'].value;
      _usuario.ciudad = controls['ciudad'].value;
      _usuario.telefono = controls['telefono'].value;
      _usuario.correo = controls['correo'].value;
      return _usuario;
    }

    onSubmit() {
      this.hasFormErrors = false;
      this.loadingSubject.next(true);
      const controls = this.usuarioForm.controls;
      /** check form */
      if (this.usuarioForm.invalid) {
        this.loadingSubject.next(false);
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );
  
        this.hasFormErrors = true;
        return;
      }
      const editedProducto = this.prepareCustomer();
      this.createCustomer(editedProducto);
    }
  
    createCustomer(usuario: UsuarioModel) { 
     
      this.usuarioService.crudDatoscliente(usuario).subscribe(res=> {
        // console.log(res);
        this.loadingSubject.next(false);
        if(res._info_id){
          usuario.idusuario=res._idusuario;
          // alert(res._info_desc);
          const message = res._info_desc;
				  this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, false);
          // this.viewLoading = false;

          // this.dialogRef.close(
          //   usuario
          //   // isEdit: false
          // );
  
        }else{
          // this.viewLoading = false;
          alert(res._info_desc);
        }
      },error=>{
        this.loadingSubject.next(false);
        alert("Ha ocurrido un error en la solicitud:"+error);
        // console.log(error);
      }
      );
    }
}
