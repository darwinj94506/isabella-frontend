import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';
// import { MatTableDataSource } from '@angular/material';
import{EgresoService} from '../egreso.service';
import {FormBuilder, Validators, FormGroup } from "@angular/forms";
import { UsuarioService } from '../../components/e-commerce/_core/services/usuario.service';
import { Router } from '@angular/router';
import{ModalAlertaComponent} from './../modal-alerta/modal-alerta.component';
import { LayoutUtilsService, MessageType } from '../../components/e-commerce/_core/utils/layout-utils.service';
import {MatDialog} from '@angular/material';
import{ProductoService} from '../../components/e-commerce/_core/services/producto.service';
import{MercadoLibreService} from '../../components/e-commerce/_core/services/mercado-libre.service';
import{ModalVerDetalleComponent} from './../modal-ver-detalle/modal-ver-detalle.component';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-crud-egreso',
  templateUrl: './crud-egreso.component.html',
  styleUrls: ['./crud-egreso.component.scss']
})
export class CrudEgresoComponent implements OnInit  {
  // Loading
	loadingSubject = new BehaviorSubject<boolean>(false);
	loading$: Observable<boolean>;
  idEgreso;
  //son los productos que se van a  facturar
  itemsProductos:any[]=[];
  myForm: FormGroup; 
  //
  //se utiliza para guardar las respuestas cuando se hace una peticion con concatmap para obtener el stock de los productos guardados
  respItemstock:any[]=[];
  cargando=false;
  active = true; 
  accion:number=1;
  identity:any;

  viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

  constructor(private _egreso:EgresoService,
  private usuarioService:UsuarioService,
  // private activatedRoute: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  private layoutUtilsService: LayoutUtilsService,
  private _mec:MercadoLibreService,
  private productoService:ProductoService,
  private fb: FormBuilder){
    this.loading$ = this.loadingSubject.asObservable();
    this.identity=this._egreso.getIdentity(); 
  }
  ngOnInit(){
    this.inicializarFormulario();
  }

   //redondea un numero decimal a dos cifras decimales ejemplo: round(1234.5678, 2); // 1234.57
   round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  // para comprobar el stock, si en el detalle de la factura hay un mismo producto en varios filas, hay que agruparlas en una sola y sumar sus cantidades
  agruparProductos(){
    let arrayProd:Element[]=[];
    this.itemsProductos.forEach(el=>{
      var foundIndex=arrayProd.findIndex((item)=>{
        return item.idproducto==el.idproducto
      })
      console.log(foundIndex);
      if(foundIndex===-1){
        arrayProd.push({...el})
      }else{
        arrayProd[foundIndex].cantidad+=el.cantidad;
      } 
    })
      return arrayProd;
  }
  
  guardarFactura(){
    this.loadingSubject.next(true);
    this.viewLoading=true;
    // si se comprueba que el cuerpo de la factura es correcto, se envia a guardar la cabecera
    if(!this.verificacionVacio()){
      this._egreso.validarDetalle(this.agruparProductos()).subscribe((data)=>{
        console.log(data);
        //si existe stock envia a guardar la cabecera en crud-egreso.component        
        if(data._info_id){
          if(this.myForm.get('idsolicitante').value===null){
            const _title: string = 'Advertencia';
            const _description: string = 'Esta factura se guardará como consumidor final';
            const _waitDesciption: string = 'Creando factura...';
            // const _deleteMessage = 'Productos subidos con éxito!';
            const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
            dialogRef.afterClosed().subscribe(res => {
              // this.viewLoading=false;
              this.loadingSubject.next(false);
              if (!res) {
                return;
              }
              //cuando no llena el campo de usuarios, se guarda el egreso como consumidor final, el id de consumidor final es el que esta guardado en la bdd, en este caso 2 
              this.myForm.patchValue({idsolicitante:2});
              this.crudCabecera()
            })
            
          }else{
            this.crudCabecera()
          }
            
        }else{
          //si no existe el stock se muestra el modal con el mensaje de los productos que no cumplen stock
          this.abrirModal(data);
          this.viewLoading=false;
          this.loadingSubject.next(false);

        }
      },error=>{
        this.viewLoading=false;
        this.loadingSubject.next(false);
        alert("Error en la validacion de la factura");
      });
    }else{
      this.loadingSubject.next(false);
      this.viewLoading=false;
    }
  
}

crudCabecera(){
  this._egreso.crudEgreso(this.myForm.value).subscribe(data=>{    
    // this.loadingSubject.next(false);

    this.idEgreso=data[0]._pk;
    //si la cabera se guardo con exito entonces se guarda el cuerpo de la factura
    this.crudDetalle();
  },error=>{
    this.loadingSubject.next(false);
    alert("Error al guardar cabecera");
    this.viewLoading = false;
  })
}

//guarda el cuerpo de la factura
crudDetalle(){
  //asignamos  idegreso que nos llega a los items de detalle 
  for (let i in this.itemsProductos){
    this.itemsProductos[i].idegreso=this.idEgreso;
  }
  this._egreso.crudDetalle2(this.itemsProductos).subscribe((data)=>{ //guarda el detalle del egreso
    this.viewLoading=false;
    this.loadingSubject.next(false);
    console.log(data);
    this.abrirFactura(this.idEgreso);
    },error=>{
      this.loadingSubject.next(false);
      this.viewLoading=false;
      alert("Error Al guardar el detalle_egreso");
    })
}

abrirFactura(data=null){
  const dialogRef = this.dialog.open(ModalVerDetalleComponent , {
    hasBackdrop:true,
    width:"90%",
    height:"99%",
    data:data
  });
  dialogRef.afterClosed().subscribe(result => {
    this.router.navigate(['/egreso']);
  },error=>{
    this.router.navigate(['/egreso']);
    console.log(error);
  })
}

 //verifica que los items no sean menores que 1 ni esten vacios
 verificacionVacio(){
  if(this.itemsProductos.length < 1){
    alert("No hay productos que facturar");
    return true;
  }
  for(let j in this.itemsProductos){
    if(this.itemsProductos[j] && this.itemsProductos[j].cantidad <=0 ){
      alert("No pueden haber cantidades menores que 1 ni pueden estar vacias");
      return true;
    } 
  }
  return false;
}
abrirModal(data=null){
  const dialogRef = this.dialog.open(ModalAlertaComponent , {
    hasBackdrop:true,
    width:"70%",
    height:"80%",
    data:data
  });
}

  inicializarFormulario(){
    this.myForm = this.fb.group({
      idegreso:0,
      cedula:'',
      idusuario:this.identity.idusuario,
      idsolicitante:[null,Validators.required],
      iva:[0.12,Validators.required],
      total:[0,Validators.required],
      subTotal:[0,Validators.required],
      observacion:['',Validators.maxLength(200)],
      opcion:1,
      nombresSolicitante:[{value:'',disabled:true},Validators.required]
    })
  }
  get idsolicitante() { return this.myForm.get('idsolicitante'); }

  getErrorMessage() {
    return this.myForm.get('idsolicitante').hasError('maxlength') ? 'Máximo 50 caracteres' :  
      this.myForm.get('idsolicitante').hasError('required') ? 'Campo obligatorio' :''      
  }

//esto viene del componente detalle cada vez que se agrega un producto
  recibirProductos(productos){
    console.log(productos);
    var subTotal:number=this.round((productos.total)-(productos.total*0.12),3);
    this.myForm.patchValue({total:productos.total,subTotal:subTotal})
    this.itemsProductos=productos.productos;
  }
  

  clienteNull:boolean=false;
  buscarUsuario(cedula: string) {
    if(cedula!=""){
      this.usuarioService.findUsuarioByCedula(cedula).subscribe(usu=>{
        if(usu){
          this.clienteNull=false;
          let nombres=usu.nombres+' '+usu.apellidos;
          this.myForm.patchValue({nombresSolicitante:nombres,idsolicitante:usu.idusuario})
        }else{
          this.clienteNull=true;
          this.myForm.patchValue({nombresSolicitante:'',idsolicitante:null})
        }
        console.log(usu);
      })
    } 
  }
}


export interface Element{
  posicion:any,
  iddetalle:any,
  idegreso:any,
  idproducto:null,
  costo:number,
  precio:number,
  cantidad:number,
  opcion:any,
  codigo:any,
  precio1:number,
  precio2:number,
  precio3:number,
  preciomec:any,
  preciofacturar:number,
  total:number,
  codigofabricante:string
}
