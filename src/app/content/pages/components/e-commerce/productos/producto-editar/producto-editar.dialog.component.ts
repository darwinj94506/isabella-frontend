import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypesUtilsService } from '../../_core/utils/types-utils.service';
import { ProductoService } from '../../_core/services/index';
import { CategoriaService } from '../../_core/services/index';
import { ProductoModel, 
		 CategoriaModel, 
		 ClasificacionModel, 
		 MarcaModel, 
		 PresentacionModel} from '../../_core/models';
		 import {TALLAS, UNIDADES_MEDIDA} from '../config-prod';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import{URL_GLOBAL} from '../../_core/global';
@Component({
	selector: 'm-producto-editar-dialog',
	templateUrl: './producto-editar.dialog.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductoEditarDialogComponent implements OnInit {
	tallas = TALLAS ;
	unidades_medida = UNIDADES_MEDIDA;
	clasificaciones : ClasificacionModel[];
	categorias: any[];
	presentaciones : any[] = [];
	marcas : any [];

	producto: ProductoModel;
	productoForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	precios=[{id:1},{id:2},{id:3}];
	public url_imagenes="";

	constructor(public dialogRef: MatDialogRef<ProductoEditarDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		private fb: FormBuilder,
		private categoriaService:CategoriaService,
		private productoService: ProductoService,
		private typesUtilsService: TypesUtilsService) { }

	/** LOAD DATA */
	ngOnInit() {
		this.url_imagenes=URL_GLOBAL+"upload_images";
		this.producto = this.data.producto;
		this.categorias = [ { idcategoria:this.producto.idcategoria, 
			nombre: this.producto.categoria, clear(){} }]
		this.presentaciones = [ { idpresentacion:this.producto.idpresentacion, 
			idmarca:this.producto.idmarca, idcategoria:this.producto.idcategoria, 
			nombre: this.producto.presentacion, clear(){} }]	
		console.log(this.producto);
		this.createForm();
		// this.onChanges();
		this.categoriaService.getAllClasificaciones().subscribe(clasificaciones=>{
			this.clasificaciones = clasificaciones;
		})

		this.categoriaService.getAllMarcas().subscribe(marcas=>{
			this.marcas = marcas;
		})
	}
	
	getCategoriasByClasificacion(idclasificacion){
		// this.marcas = [];
		this.presentaciones = [];
		this.categorias = [];
		console.log(idclasificacion);
		this.categoriaService.getCategoriasByClasificaciones(idclasificacion).subscribe(categorias=>{
			console.log(categorias)
			this.categorias = categorias;
		})
	}

	getPresentacionesByMarcaAndCategoria(idmarca){
		let idcategoria = this.productoForm.get('idcategoria').value
		this.categoriaService.getPresentacionesByMarcaAndCategoria(idmarca, idcategoria).subscribe(presentaciones=>{
			console.log(presentaciones);
			this.presentaciones = presentaciones;
		})
	}

	get f() { return this.productoForm.controls; }
	createForm() {
		// //si se abre este modal desde importacion-producto entonces nos vendra el codigo de importacion de fabricante, descripcion y titulo  
		this.productoForm = this.fb.group({
			idclasificacion: [this.producto.idclasificacion, Validators.required],
			idcategoria: [ this.producto.idcategoria, Validators.required],
			idmarca : [this.producto.idmarca, Validators.required],
			idpresentacion: [this.producto.idpresentacion, Validators.required],
			titulo: [],
			descripcion: [this.producto.descripcion,Validators.compose([Validators.required,Validators.maxLength(255)])],
			pvp: [this.producto.pvp, Validators.compose([Validators.required,Validators.max(1000),Validators.min(0)])],
			codigofabricante: [this.producto.codigofabricante,Validators.compose([Validators.required,Validators.maxLength(20), Validators.pattern("^[0-9]*$")])],
			iva:[this.producto.iva, Validators.required],
			stockMinimo:[this.producto.stock_minimo], 
			talla:[this.producto.talla],
			unidadMedida:[this.producto.unidad_medida],
			cantidad:[this.producto.cantidad]
			
		});

		// this.productoForm.get('descripcion').valueChanges.subscribe(val => {
		// 	console.log(val.toUpperCase());
		// 	this.productoForm.patchValue({descripcion:val.toUpperCase()}, {emitEvent: false})
		// });
	}


	/** UI */
	getTitle(): string {
		if (this.producto.idproducto > 0) {
			return `Editar producto '${this.producto.descripcion} ${
				this.producto.codigofabricante
			}'`;
		}

		return 'Nuevo Producto';
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.productoForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS		_producto.imagenes=this.producto.imagenes;
 */
	prepareData(): ProductoModel {
		const controls = this.productoForm.controls;
		const _producto = new ProductoModel();
		_producto.idproducto = this.producto.idproducto;
		_producto.idpresentacion = controls['idpresentacion'].value;
		_producto.codigofabricante = controls['codigofabricante'].value;
		_producto.codigo = this.producto.codigo;
		_producto.titulo = '';
		_producto.descripcion = controls['descripcion'].value;
		_producto.pvp = Number.parseFloat(controls['pvp'].value);
		_producto.iva = controls['iva'].value;
		_producto.stock_minimo = controls['stockMinimo'].value;
		_producto.talla = controls['talla'].value;
		_producto.unidad_medida = controls['unidadMedida'].value;
		_producto.cantidad = controls['cantidad'].value;
		_producto.imagenes = [];
		return _producto;
	}

	onSubmit() {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.productoForm.controls;
		/** check form */
		if (this.productoForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedProducto = this.prepareData();
		if (editedProducto.idproducto > 0) {
			this.update(editedProducto);
		} else {
			this.createProducto(editedProducto);
		}
	}

	update(producto: ProductoModel) {
		console.log(producto);
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.productoService.crudProducto(producto,2).subscribe(res => {
			this.viewLoading = false;
			// this.producto.idproducto = res._idproducto;
			if(!res._info_id){
				alert(res._info_desc);
				return; 
			}
			this.dialogRef.close(res._info_id);
		},error=>{
			alert("Ha ocurrido un error en la solicitud:"+error);
			console.log(error);
			this.viewLoading = false;
		}
		);
	}
	//se ejecuta cuando se quita una imagen
	onRemoved(file: any) {
		console.log(file);
		
		//primero buscamos el indice en el array de imagenes
		let index=this.producto.imagenes.indexOf(file.name);
		//dado el indice eliminamos del array de imagenes del producto
		this.producto.imagenes.splice(index,1);
		console.log(this.producto);
	  
	}
	onUploadFinished(event){
		console.log(event);
		console.log(event.serverResponse.response.body);
		//sube imagenes al servidor
		this.producto.imagenes.push(URL_GLOBAL+"getImageProducto/"+event.serverResponse.response.body);
		console.log(this.producto);
	}
	// imageUploadedResponse(event){
	// }

	createProducto(producto: ProductoModel) { 
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		console.log(producto);
		this.productoService.crudProducto(producto,1).subscribe(res=> {
			if(res._info_id){
				this.producto.idproducto=res._idproducto;
				producto.idproducto=res._idproducto
				this.dialogRef.close(
					producto
				);
			}else{
				alert(res._info_desc);
			}
			this.viewLoading = false;
			
		},error=>{
			alert("Ha ocurrido un error en la solicitud:"+error);
			console.log(error);
			this.viewLoading = false;
		}

		);
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	onNoClick(): void {
		this.dialogRef.close();
	}
	  round(number, precision) {
		var factor = Math.pow(10, precision);
		var tempNumber = number * factor;
		var roundedTempNumber = Math.round(tempNumber);
		return roundedTempNumber / factor;
	  };
}
