import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypesUtilsService } from '../../_core/utils/types-utils.service';
import { ProductoService } from '../../_core/services/index';
import { CategoriaService } from '../../_core/services/index';
import { ProductoModel } from '../../_core/models/producto.model';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import {CategoriaModel} from '../../_core/models/categoria.model';
import{URL_GLOBAL} from '../../_core/global';
@Component({
	selector: 'm-producto-editar-dialog',
	templateUrl: './producto-editar.dialog.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductoEditarDialogComponent implements OnInit {
	producto: ProductoModel;
	productoForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	categorias:CategoriaModel[];
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
		// console.log(this.url_imagenes);
		this.producto = this.data.producto;
		console.log(this.producto);
		this.createForm();
		this.onChanges();

	
		//llamar a todas las categorias (tipos)
		this.categoriaService.getCategorias().subscribe(categorias=>{
			console.log(categorias);
			this.categorias=categorias;
		})
	}

	get f() { return this.productoForm.controls; }
	createForm() {
		// //si se abre este modal desde importacion-producto entonces nos vendra el codigo de importacion de fabricante, descripcion y titulo  
		this.productoForm = this.fb.group({
			idtipo: [this.producto.idtipo, Validators.required],
			titulo: [],
			descripcion: [this.producto.descripcion,Validators.compose([Validators.required,Validators.maxLength(255)])],
			precio1: [this.producto.precio1, Validators.compose([Validators.required,Validators.max(1000),Validators.min(0)])],
			precio2: [],
			precio3: [],
			costo: [this.producto.costo, Validators.compose([Validators.required,Validators.min(0)])],
			codigofabricante: [this.producto.codigofabricante,Validators.compose([Validators.required,Validators.maxLength(20), Validators.pattern("^[0-9]*$")])],
			preciofacturar: [],
			preciomercadolibre: [],
		});
		this.productoForm.get('descripcion').valueChanges.subscribe(val => {
			console.log(val.toUpperCase());
			this.productoForm.patchValue({descripcion:val.toUpperCase()}, {emitEvent: false})
		});
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
		_producto.idtipo = controls['idtipo'].value;
		_producto.codigo = this.producto.codigo;
		_producto.titulo = '';
		_producto.descripcion = controls['descripcion'].value;
		_producto.precio1 = Number.parseFloat(controls['precio1'].value)/100;
		_producto.precio2 = 0
		_producto.precio3 = 0
		_producto.costo = controls['costo'].value;
		_producto.imagenes = []
		_producto.codigofabricante = controls['codigofabricante'].value;
		_producto.preciofacturar = 1;
		_producto.preciomercadolibre = 1;
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
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.productoService.crudProducto(producto,2).subscribe(res => {
			/* Server loading imitation. Remove this on real code */
			this.viewLoading = false;
			this.producto.idproducto=res._idproducto;
			this.dialogRef.close(
				producto
				// isEdit: truetrue
			);
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

	public valorPrecio1;
	public valorPrecio2;
	public valorPrecio3;

	//funcion para calcular el valor de los porcentajes
	onChanges(): void {
		const controls = this.productoForm.controls;
	
		if(controls['costo'].value){
			let costo=Number.parseFloat(controls['costo'].value);
			if(this.productoForm.get('precio1').value){
				let precio1 =  Number.parseFloat(controls['precio1'].value)/100;
				this.valorPrecio1=this.round(costo + costo*precio1,2);
			}
			if(this.productoForm.get('precio2').value){
				let precio2 = Number.parseFloat(controls['precio2'].value)/100;
				this.valorPrecio2=this.round(costo + costo*precio2,2);
				
			}
			if(this.productoForm.get('precio3').value){
				let precio3 = Number.parseFloat(controls['precio3'].value)/100;
				this.valorPrecio3= this.round(costo + costo*precio3,2);
			}
		}

		this.productoForm.get('costo').valueChanges.subscribe((costo:number) => {

			if(this.productoForm.get('precio1').value){
				let precio1 =  Number.parseFloat(controls['precio1'].value)/100;
				this.valorPrecio1=this.round(costo + costo*precio1,2);
			}
			if(this.productoForm.get('precio2').value){
				let precio2 = Number.parseFloat(controls['precio2'].value)/100;
				this.valorPrecio2=this.round(costo + costo*precio2,2);
				
			}
			if(this.productoForm.get('precio3').value){
				let precio3 = Number.parseFloat(controls['precio3'].value)/100;
				this.valorPrecio3= this.round(costo + costo*precio3,2);
			}
		});

		this.productoForm.get('precio1').valueChanges.subscribe((precio1:number) => {

			if(this.productoForm.get('costo').value){
				let costo =  Number.parseFloat(controls['costo'].value);
				this.valorPrecio1=this.round(costo + costo*(precio1/100),2);
			}
		
		});

		this.productoForm.get('precio2').valueChanges.subscribe((precio2:number) => {
			
			if(this.productoForm.get('costo').value){
				let costo =  Number.parseFloat(controls['costo'].value);
				this.valorPrecio2=this.round(costo + costo*(precio2/100),2);
			}
		
		});

		this.productoForm.get('precio3').valueChanges.subscribe((precio3:number) => {

			if(this.productoForm.get('precio3').value){
				let costo =  Number.parseFloat(controls['costo'].value);
				this.valorPrecio3=this.round(costo + costo*(precio3/100),2);
			}
		
		});
	  }

	  round(number, precision) {
		var factor = Math.pow(10, precision);
		var tempNumber = number * factor;
		var roundedTempNumber = Math.round(tempNumber);
		return roundedTempNumber / factor;
	  };
}
