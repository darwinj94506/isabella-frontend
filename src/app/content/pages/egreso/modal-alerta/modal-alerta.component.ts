import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatTableDataSource} from '@angular/material';
import {FormBuilder, Validators, FormGroup,FormControl } from "@angular/forms";
@Component({
  selector: 'app-modal-alerta',
  templateUrl: './modal-alerta.component.html',
  styleUrls: ['./modal-alerta.component.scss']
})
export class ModalAlertaComponent implements OnInit {
  displayedColumns: string[] = ['nombre','cantidad','stock'];
  ELEMENT_DATA: any[] = [];
  titulo='';
  constructor( private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalAlertaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) {
      console.log(data);
     }

  ngOnInit() {
    console.log(this.data);
    if(this.data._info_lista){
      this.ELEMENT_DATA=this.data._info_lista;
      this.titulo=this.data._info_desc;
    }else{
      this.titulo='Error';
    }
  }

}
