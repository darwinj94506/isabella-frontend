import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, Validators, FormGroup,FormControl } from "@angular/forms";
import {EgresoService} from '../egreso.service';

@Component({
  selector: 'app-modal-instrucciones',
  templateUrl: './modal-instrucciones.component.html',
  styleUrls: ['./modal-instrucciones.component.scss']
})
export class ModalInstruccionesComponent implements OnInit {
  // displayedColumns: string[] = ['nombre' ,'sum'];
  // detailColumns: string[] = ['Producto' ,'cantidad','preciounitario','total','star'];

  ELEMENT_DATA: any[] = [];
  DETAIL_DATA: any[] = [];
  myForm: FormGroup; 
  length=0;
  numeroRegistro=0;
  datosUsuario:any;
  constructor( private fb: FormBuilder,private  _egreso:EgresoService,
    public dialogRef: MatDialogRef<ModalInstruccionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) {
      // this.identity=this._ingreso.getIdentity();
      console.log(data);
      this.datosUsuario=data;
      
     }

  ngOnInit() {
    // this.inicializarFormulario();
    // console.log(this.data);
    // this.getDetallesGlobal();
    // this.getDetalleEgreso();
    // this.numeroRegistro=this.data.idegreso+1000;
  }
    onNoClick(): void {
        this.dialogRef.close(null);
    }

  getDetalleEgreso(){
    this._egreso.getDetalleEgreso(this.data.idegreso).subscribe((data)=>{
      console.log(data);
      this.DETAIL_DATA=data.data;
    })
  }
  close(data) {
    this.dialogRef.close(data);
  }

  inicializarFormulario(){
    //Datos de la cabecera del egreso,vienen como parametros de la tabla listar 
    this.myForm = this.fb.group({
      nombressolicitante:this.data.nombresSolicitante,
      cedula:this.data.cedula,
      direccion:this.data.direccion,
      iva:this.data.iva,
      subtotal:this.data.total,
      total:this.data.total,
      fecha:this.data.fecha,
    })
  }
  imprimir(){
    window.print();
  }
 




  
  

}
