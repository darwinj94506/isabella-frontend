import { Component, OnInit,OnChanges,AfterViewInit,OnDestroy,EventEmitter, Input, Output, ElementRef, ViewChild,ViewChildren,QueryList } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import{EgresoService} from '../egreso.service';
import { FormControl, Validators,FormBuilder, FormGroup, FormArray  } from '@angular/forms';
// import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import{ModalAlertaComponent} from './../modal-alerta/modal-alerta.component';
import {MatDialog, MatDialogRef, 
  MAT_DIALOG_DATA, MatDialogConfig,MatSnackBar} from '@angular/material';
import { Router,ActivatedRoute,Params } from '@angular/router';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge, forkJoin } from 'rxjs';
import{ProductoService} from '../../components/e-commerce/_core/services/producto.service';
import{MercadoLibreService} from '../../components/e-commerce/_core/services/mercado-libre.service';
import{ModalVerDetalleComponent} from './../modal-ver-detalle/modal-ver-detalle.component';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: ['.rojo { color:red; }']
})
export class DetalleComponent implements OnInit,AfterViewInit {
  displayedColumns = ['posicion','descripcion', 'cantidad', 'precio', 'total', 'actions'];
  codigofabricante = new FormControl('', Validators.required);
  @Output() OutputProductos=new EventEmitter();
  @ViewChild('searchInput') searchInput: ElementRef;
  noExisteProducto:boolean=false;
 ELEMENT_DATA: Element[] = [
];

//se utiliza para guardar las respuestas cuando se hace una peticion con concatmap para obtener el stock de los productos guardados
respItemstock:any[]=[];

dataSource = new MatTableDataSource(this.ELEMENT_DATA);
 //
  numero:number=1;
  materiales:any[]=[];
  myFormDetalle: FormGroup;
  constructor(private _egreso:EgresoService,
    private fb: FormBuilder,private _route:ActivatedRoute, 
    private router:Router,private _mec:MercadoLibreService,
    public dialog: MatDialog,private productoService:ProductoService){}
    ngAfterViewInit() {

      //llamada al evento de busqueda de productos, (se activa cada vez que se teclee un letra)
      fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
        distinctUntilChanged(), // This operator will eliminate duplicate values
        tap(() => {
          this.productoService.findProductoByCodigoFabricante(this.searchInput.nativeElement.value).subscribe((producto:any)=>{
            // si encuentra el producto en la bdd se muestra el formulario con los datos del producto para llenar la cantidad a ingresar
            // console.log(producto);
            if(producto){
              this.searchInput.nativeElement.value="";	
              this.noExisteProducto=false;
              let preciofacturar:number=Number.parseFloat(producto.preciofacturar);
              let precio:number;
              //calculo de los precios ya que en la bdd solo se guarda el porcentaje del costo 
              let precio1:number= this.redondear(Number.parseFloat(producto.precio1)*Number.parseFloat(producto.costo)+Number.parseFloat(producto.costo));  
              
              //establecer el precio de mercado libre
              let precioML:number= this.round(Number.parseFloat(producto.preciomercadolibre),2);
              let valorPrecioML:number;
              if(precioML==1){
                valorPrecioML=precio1;
              }
              
              let total:number; 

              //para establecer el valor por defecto del precio del producto, al agregar un nuevo item del detalle de venta
              if(preciofacturar==1){
                precio=precio1;
                total=precio1;
              }

              this.ELEMENT_DATA.push({
                 posicion:this.contador,
                 iddetalle: null,
                 descripcion:producto.descripcion,
                 idegreso: null,
                 idproducto:producto.idproducto,
                 costo:producto.costo,
                 precio:precio,
                 cantidad:1,
                 opcion:1,
                 precio1:precio1,
                 precio2:0,
                 precio3:0,
                 preciomec:valorPrecioML,
                 preciofacturar:this.redondear(Number.parseFloat(producto.preciofacturar)),
                 total:total,
                 codigofabricante:producto.codigofabricante
                });
              this.dataSource.data=this.ELEMENT_DATA;
              //envia el total y productos a la cabecera
              this.OutputProductos.emit({total:this.calcularTotalPagar(),productos:this.ELEMENT_DATA});
              //cada vez que se añade un nuevo item se se envia todo el 

            }else{
              console.log("no existe este producto")
              this.noExisteProducto=true;
            }
          });
        })
      )
      .subscribe();
    }
  
    ngOnInit() {
    
  }

  //redondea un numero decimal a dos cifras decimales ejemplo: round(1234.5678, 2); // 1234.57
  round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };
  
  eliminar(element,i){
    console.log(this.ELEMENT_DATA[i])
    this.ELEMENT_DATA.splice(i,1);
    console.log(this.ELEMENT_DATA);
    this.dataSource.data=this.ELEMENT_DATA;
    this.OutputProductos.emit({total:this.calcularTotalPagar(),productos:this.ELEMENT_DATA});
  }
  productos:any[]=[];
  //validar cantiades en blanco o que esten en cero

  //calcula el total cuando se cambia el precio del select y cuando se cambia la cantidad, i es del indice del registro en la tabla, op indica si el evento viene del select o del input
  calcularTotal($event,i,op:number){
    if(op==1){ //cuando cambia el select
      this.ELEMENT_DATA[i].total=this.ELEMENT_DATA[i].cantidad*this.ELEMENT_DATA[i].precio;
    }else{ //cuando cambia la cantidad del input
      let cant=Number.parseFloat($event);
      console.log(cant);
      console.log(this.ELEMENT_DATA[i]);
      this.ELEMENT_DATA[i].total=cant*this.ELEMENT_DATA[i].precio;
    }
    this.dataSource.data=this.ELEMENT_DATA;
    //envia el total a pagar al componente crud egreso (que es la cabecera de la factura)
    this.OutputProductos.emit({total:this.calcularTotalPagar(),productos:this.ELEMENT_DATA});
    //envia todo el arreglo de productos a crud-egreso.component
  }

  calcularTotalPagar(){
    let suma=0;
    this.ELEMENT_DATA.forEach((producto)=>{
      suma+=producto.total;
    })
    return suma;
  }
  
  contador=1;
  verificador=0;
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

  abrirModal(data=null){
    const dialogRef = this.dialog.open(ModalAlertaComponent , {
      hasBackdrop:true,
      width:"70%",
      height:"80%",
      data:data
    });
 }

 onAlertClose($event) {
  this.noExisteProducto = false;
}

  redondear(num):number{
    return Number.parseFloat(num.toFixed(2))
  }
}
export interface Element{
  posicion:any,
  iddetalle:any
  idegreso:any,
  idproducto:null,
  costo:number,
  precio:number,
  cantidad:number,
  opcion:any,
  descripcion:any,
  precio1:number,
  precio2:number,
  precio3:number,
  preciomec:any,
  preciofacturar:number,
  total:number,
  // descripcionfabricante:string,
  codigofabricante:string
}