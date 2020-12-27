// import { Component, OnInit } from '@angular/core';
import {Component,OnInit,Inject, ViewChild} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { Router } from '@angular/router';
import{EgresoService} from '../egreso.service';
import {MatDialog, MatDialogRef, 
  MAT_DIALOG_DATA, MatDialogConfig,MatSnackBar} from '@angular/material';
import{ModalVerDetalleComponent} from './../modal-ver-detalle/modal-ver-detalle.component';
import{ModalInstruccionesComponent} from './../modal-instrucciones/modal-instrucciones.component';
@Component({
  selector: 'app-listar-egreso',
  templateUrl: './listar-egreso.component.html',
  styleUrls: ['./listar-egreso.component.scss']
})
export class ListarEgresoComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  bufferValue = 50;
  cargando=false;
  displayedColumns: string[] = [ 'idegreso','usuario','cliente' ,'fecha', 'actions'];
  ELEMENT_DATA: any[] = [];
  length=0;
  pageEvent: PageEvent;
  fecha:Date;


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _egreso:EgresoService,public router: Router,
    public dialog: MatDialog, public snackBar: MatSnackBar) {}
  ngOnInit() {
    this.paginator.pageIndex=0;
    this.cargarTabla();    
  }
  cargarTabla(){
    this.cargando=true;
    this._egreso.getTotalEgreso().
      subscribe((data)=>{
        this.length=data.data[0].count;
        console.log(data.data[0].count);
      });
    this._egreso.getPaginarEgresos({"page":0,"itemsPerPage":10}).subscribe((data)=>{
    this.ELEMENT_DATA=data.data;
     this.mode="determinate";
      this.cargando=false;
     console.log(this.ELEMENT_DATA);
    },error=>{
      this.mode="determinate";
      this.cargando=false;
      alert("Ha ocurrido un error");
    }
  )
    
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
paginar(evento){
  this.pageEvent = evento;
  console.log(this.pageEvent.pageIndex);
  console.log(this.pageEvent.pageSize);
  this._egreso.getPaginarEgresos({"page":this.pageEvent.pageIndex,
                              "itemsPerPage":this.pageEvent.pageSize})
                              .subscribe((data)=>{
                                this.ELEMENT_DATA=data.data;
                                console.log(this.ELEMENT_DATA);                               
                              })
  }


  abrirModalVerDetalle(data=null){
     
       const dialogRef = this.dialog.open(ModalVerDetalleComponent , {
         hasBackdrop:true,
         width:"90%",
         height:"99%",
         data:data.idegreso
       });
       dialogRef.afterClosed().subscribe(result => {
         if(result){
            console.log(result);
            if(result[0]._info_id){
             this.cargarTabla();
           }
           this.openSnackBar(result[0]._info_desc,result[0]._info_titulo);
         }     
       },error=>{
       console.log(error);
     })
    }

    abrirModalInstrucciones(data=null){
     console.log(data);
       const dialogRef = this.dialog.open(ModalInstruccionesComponent , {
         hasBackdrop:true,
         width:"90%",
         height:"99%",
         data:data
       });
       dialogRef.afterClosed().subscribe(result => {
        //  if(result){
        //     console.log(result);
        //     if(result[0]._info_id){
        //      this.cargarTabla();
        //    }
        //    this.openSnackBar(result[0]._info_desc,result[0]._info_titulo);
        //  }     
       },error=>{
      //  console.log(error);
     })
    }
}





