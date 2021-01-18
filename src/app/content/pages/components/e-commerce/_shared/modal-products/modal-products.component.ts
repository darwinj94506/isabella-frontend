import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource} from '@angular/material';
import {FormBuilder, Validators, FormGroup,FormControl } from "@angular/forms";

@Component({
  selector: 'm-modal-products',
  templateUrl: './modal-products.component.html',
  styleUrls: ['./modal-products.component.scss']
})
export class ModalProductsComponent implements OnInit {
  para;

  displayedColumns: string[] = ['INDEX','PRODUCTO','CODIGOBARRAS','COSTO','PRECIO','TIPO'];
  ELEMENT_DATA: any[] = [];
  titulo='ESTOS PRODUCTOS SE CREARÁN EN EL SISTEMA';
  constructor( private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) {
     }

  ngOnInit() {
    console.log(this.data);
    this.ELEMENT_DATA=this.data;
    
  }

  subirProductos(){
    this.dialogRef.close(this.data);
  }

}
