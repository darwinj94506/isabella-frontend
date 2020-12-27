import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, Validators, FormGroup,FormControl } from "@angular/forms";
import {EgresoService} from '../egreso.service';

@Component({
  selector: 'app-modal-ver-detalle',
  templateUrl: './modal-ver-detalle.component.html',
  styleUrls: ['./modal-ver-detalle.component.scss']
})
export class ModalVerDetalleComponent implements OnInit {
  // displayedColumns: string[] = ['nombre' ,'sum'];
  // detailColumns: string[] = ['Producto' ,'cantidad','preciounitario','total','star'];

  ELEMENT_DATA: any[] = [];
  DETAIL_DATA: any[] = [];
  myForm: FormGroup; 
  length=0;
  numeroRegistro=0;
  cabeceraFactura:any={
    total:null,
    iva:null,
    nombres:'',
    apellidos:'',
    fecha:null,
    direccion:'',
    cedula:'',
    idegreso:null
  };
  idEgreso:any;
  
  constructor( private fb: FormBuilder,private  _egreso:EgresoService,
    public dialogRef: MatDialogRef<ModalVerDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) {
      // this.identity=this._ingreso.getIdentity();
      console.log(data);
      // this.cabeceraFactura=data;
      this.idEgreso=data;
     }

  ngOnInit() {
    // this.inicializarFormulario();
    // console.log(this.data);
    // this.getDetallesGlobal();
    this.getDetalleEgreso();
    // this.numeroRegistro=this.data.idegreso+1000;
  }
    onNoClick(): void {
        this.dialogRef.close(null);
    }
    imprimir(){
      window.print();
    }

  getDetalleEgreso(){
    this._egreso.getDetalleEgreso(this.idEgreso).subscribe((data)=>{
      console.log(data);
      this.DETAIL_DATA=data.data;
      this.cabeceraFactura.total=this.DETAIL_DATA[0].total;
      this.cabeceraFactura.iva=this.DETAIL_DATA[0].iva;
      this.cabeceraFactura.fecha=this.DETAIL_DATA[0].fecha;
      this.cabeceraFactura.idegreso=this.DETAIL_DATA[0].idegreso;
      this.cabeceraFactura.nombres=this.DETAIL_DATA[0].nombres;
      this.cabeceraFactura.apellidos=this.DETAIL_DATA[0].apellidos;
      this.cabeceraFactura.cedula=this.DETAIL_DATA[0].cedula;
      this.cabeceraFactura.direccion=this.DETAIL_DATA[0].direccion;
      
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

  round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  
  

}
