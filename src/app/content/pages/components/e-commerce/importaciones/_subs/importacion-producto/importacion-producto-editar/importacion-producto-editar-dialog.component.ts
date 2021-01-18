import {Component, Inject, Input, OnInit,OnDestroy} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators,FormBuilder, FormGroup, FormArray  } from '@angular/forms';
import * as _ from 'lodash';
import { ProductoModel } from '../../../../_core/models/producto.model';
import {UpcItemModel} from '../../../../_core/models/upc-item.model';
import {ImportacionProductoService} from '../../../../_core/services/importacion-producto.service';
import { ProductoService } from '../../../../_core/services';
import{ProductoEditarDialogComponent} from '../../../../productos/producto-editar/producto-editar.dialog.component';
import { ImportacionProductoModel } from '../../../../_core/models/importacion-producto.model';
import { Translation } from '../../../../_core/models/translation';
import { throwError } from 'rxjs';
import {  catchError } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
	selector: 'm-importacion-producto-editar-dialog',
	templateUrl: './importacion-producto-editar-dialog.component.html',
	styleUrls: ['./imagen.css']

})

export class ImportacionProductoEditarDialogComponent implements OnInit, OnDestroy {

	//propiedades del form del producto de la base de datos local
	codigofabricante = new FormControl('', Validators.required);
	titulo = new FormControl('');
	descripcion = new FormControl('');
	codigo = new FormControl('');
	// propiedad del form para la cantidad del objeto  importacionProducto 
	cantidad = new FormControl(null,Validators.compose([Validators.required,Validators.min(1)]));

	//propiedades del form del producto de la api externa, AE= abreviatura de api externa
	
	tituloAE = new FormControl('');
	descripcionAE = new FormControl(''); //campo para almacenar la descripcion tal cual viene de la api externa
	imagenesForm:FormGroup;
	//la titulo alternativa se la forma de la union de brand,model,color,size,dimension,weight que vienen de la api externa
	descripcionAlternativaAE = new FormControl('');
	//forms para traducir lo que viene de la api externa, la abreviatura AET es de api externa traducido
	tituloAET = new FormControl('');
	descripcionAET = new FormControl('');
	descripcionAlternativaAET = new FormControl('');
	
	productos: ProductoModel[] = [];
	buscandoItem:boolean=false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	mostrarItemUpcDb:boolean=false;
	mostrarGuardarImportacionProducto:boolean=false;
	// 
	ItemUPCItemDb:UpcItemModel;
	importacionProducto:ImportacionProductoModel;

	constructor(
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<ImportacionProductoEditarDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private importacionProductoService:ImportacionProductoService,
		private productoService:ProductoService,
		private fb: FormBuilder
	) {
	
	}

	ngOnInit() {
		console.log(this.data);
		// console.log(this.data);
		this.importacionProducto=this.data;
		// opcion para editar un item
		if(this.data && this.data.idimportacionproducto >0){
			this.mostrarGuardarImportacionProducto=true;
			
			this.cantidad.setValue(this.importacionProducto.cantidad);
			this.codigofabricante.setValue(this.importacionProducto._codigofabricante);
			this.codigo.setValue(this.importacionProducto._codigo);
			this.titulo.setValue(this.importacionProducto._titulo);
		}
		
	}
	ngOnDestroy() {
		// To protect you, we'll throw an error if it doesn't exist.
	  }

	//busca un producto en la base de datos local
	buscarProducto(){
		if (this.codigofabricante.invalid) {
			this.codigofabricante.markAsTouched();
			return;
		}
		this.buscandoItem=true;
		this.productoService.findProductoByCodigoFabricante(this.codigofabricante.value).subscribe((producto:any)=>{
			// si encuentra el producto en la bdd se muestra el formulario con los datos del producto para llenar la cantidad a ingresar
			if(producto){	
				console.log(producto);	
				this.mostrarGuardarImportacionProducto=true;
				this.descripcion.setValue(producto.descripcion);
				this.codigofabricante.setValue(producto.codigofabricante);
				this.codigo.setValue(producto.codigo);
				this.titulo.setValue(producto.titulo);


				//asigno a mi objeto importacionproducto el id del producto que me llega de la consulta
				this.importacionProducto.idproducto=producto.idproducto;
				this.importacionProducto._imagenes=producto.imagenes;

			}else{
				// si no existe registrado ese producto se busca en una api externa
				alert("No existe un producto con este código registrado")
			}
		});
	}
	// si el producto no esta en la bdd local, se abre un nuevo modal para ingresar ese producto al inventario y luego si para ingresar en una importacion 
	guardarProductoBddLocal(){
		// descripcionAET
		const producto = new ProductoModel();
		//toma los valores del formulario y los pasa al objeto producto
		producto.titulo=this.descripcionAlternativaAET.value;
		producto.codigofabricante=this.codigofabricante.value;
		producto.descripcion=this.descripcionAET.value;
		console.log(this.descripcionAlternativaAET.value);
		console.log(this.descripcionAET.value);

		const imagenesSeleccionadas = this.imagenesForm.value.imagenesElegidas
		.map((v, i) => v ? this.ItemUPCItemDb.images[i] : null)
		.filter(v => v !== null);
		producto.imagenes=imagenesSeleccionadas;
		console.log(imagenesSeleccionadas);
		const dialogRef = this.dialog.open( ProductoEditarDialogComponent, {data:{producto}});
		//se ejecuta cuando el modal de creacion de producto se cierra 
		dialogRef.afterClosed().subscribe((producto:any) => {
			
			//cierro el modal actual y envio el id del producto que acabo de guardar en mi bdd local, esto me viene del modal de crear producto
			if(producto){
				console.log(producto);
				this.importacionProducto.idproducto=producto.idproducto;
				this.importacionProducto._imagenes=producto.imagenes;
				this.codigofabricante.setValue(producto.codigofabricante);
				this.codigo.setValue(producto.codigo);
				this.titulo.setValue(producto.titulo);
				this.mostrarItemUpcDb=false;
				this.mostrarGuardarImportacionProducto=true;
			}	
		},error=>{
		  console.log(error);
		  //si ocourre un 
		  alert("Ha ocurrido un error al crear el producto")
		  this.dialogRef.close();

		})
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	save(){
		var opcion;
		console.log(this.importacionProducto);
		
		this.importacionProducto.mec=0;//valor por defauth, cuando este item ha sifo publicado a mec cambia a 1
		this.importacionProducto.cantidad=this.cantidad.value;
		 // va cero porque recien se crea este item en mi bdd y aun no ha sido publicado a mec
		if(this.importacionProducto.idimportacionproducto && this.importacionProducto.idimportacionproducto>0){
			opcion=2; //editar
		}else{
			opcion=1; //nuevo
		}
		this.crudImportacionProducto(opcion);
	}

	crudImportacionProducto(opcion) {
		if (this.cantidad.invalid) {
			this.cantidad.markAsTouched();
			return;
		}

		this.importacionProductoService.crudImportacionProducto(this.importacionProducto,opcion)
			.subscribe(res=>{
				console.log(res);
				if(res._info_id){
					this.dialogRef.close(res);
	
				}else{
					alert(res._info_desc);
				}
			},error=>{
				alert(error);
			})
		
	}
	
	//code es el mesaje que viene de upcItemdb si es OK es que si existe ese producto, id es del producto de la bdd local
	closeDialog(code?:string,id?:number) {
		this.dialogRef.close();
	}



}
