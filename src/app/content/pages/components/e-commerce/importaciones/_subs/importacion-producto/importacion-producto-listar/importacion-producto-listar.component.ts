import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
// Material
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { Observable, of, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Services
import { LayoutUtilsService, MessageType } from '../../../../_core/utils/layout-utils.service';
import { ImportacionProductoService } from '../../../../_core/services/index';
import { ProductoService } from '../../../../_core/services/index';
import{MercadoLibreService} from '../../../../_core/services/index';
// Models
import { ImportacionProductoModel } from '../../../../_core/models/importacion-producto.model';
import { ImportacionProductoDataSource } from '../../../../_core/models/data-sources/importacion-producto.datasource';
import { QueryParamsModel } from '../../../../_core/models/query-models/query-params.model';
import { ListStateModel, StateActions } from '../../../../_core/utils/list-state.model';
import { ProductoModel } from '../../../../_core/models/producto.model';
// Components
import { ImportacionProductoEditarDialogComponent } from '../importacion-producto-editar/importacion-producto-editar-dialog.component';
import {MercadoLibreItem} from '../../../../_core/models/mercado-libre-item.model';
import {  Router } from '@angular/router';



@Component({
	selector: 'm-importacion-producto-listar',
	templateUrl: './importacion-producto-listar.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportacionProductoListarComponent implements OnInit {
	// Incoming data
	@Input() loadingSubject = new BehaviorSubject<boolean>(false);
	@Input() specsListState: ListStateModel;
	@Input() idimportacion: number;
	// Table fields
	dataSource: ImportacionProductoDataSource;
	displayedColumns = ['select', '_codigo', '_titulo','_codigofabricante','cantidad','mec','actions'];
	productos: ProductoModel[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	// Filter fields
	// @ViewChild('searchInput') searchInput: ElementRef;
	// Selection
	selection = new SelectionModel<ImportacionProductoModel>(true, []);
	importacionProductoResult: ImportacionProductoModel[] = [];


	constructor(private importacionProductoService: ImportacionProductoService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private mercadoLibreService:MercadoLibreService,
		private productoService: ProductoService) {

		 }

	/** LOAD DATA */
	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(() => {
					this.loadSpecsList();
				})
			)
			.subscribe();

		// Filtration, bind to searchInput
		// fromEvent(this.searchInput.nativeElement, 'keyup')
		// 	.pipe(
		// 		debounceTime(150),
		// 		distinctUntilChanged(),
		// 		tap(() => {
		// 			this.paginator.pageIndex = 0;
		// 			this.loadSpecsList();
		// 		})
		// 	)
		// 	.subscribe();

		// Init DataSource
		this.dataSource = new ImportacionProductoDataSource(this.importacionProductoService);
		// this loading binded to parent component loading
		this.dataSource.loading$.subscribe(res => {
			this.loadingSubject.next(res);
		});
		this.loadSpecsList();
		this.dataSource.entitySubject.subscribe(res => this.importacionProductoResult = res);
	
	}

	loadSpecsList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			null,
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		
		this.dataSource.loadProductos(queryParams, this.idimportacion);
	}




	// filterConfiguration(): any {
	// 	const filter: any = {};
	// 	const searchText: string = this.searchInput.nativeElement.value;

	// 	filter._specificationName = searchText;
	// 	filter.value = searchText;
	// 	return filter;
	// }

	/** SELECTION */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.importacionProductoResult.length;
		return numSelected === numRows;
	}

	 /** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		if (this.isAllSelected()) {
			this.selection.clear();
		} else {
			this.importacionProductoResult.forEach(row => this.selection.select(row));
		}
	}

	/** ACTIONS */
	/** Delete */
	delete(_item: ImportacionProductoModel) {
		if(_item.mec!=1){ //si el producto aun no ha sido publicado
			const _title: string = 'Eliminar item';
			const _description: string = '¿Está seguro que desea eliminar este item permanentemente?';
			const _waitDesciption: string = 'Eliminando item...';
			const _deleteMessage = `El item ha sido eliminado`;
	
			const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
	
				// _item._isdeleted = true;
				// this.specsListState.setItem(_item, StateActions.DELETE);
				this.importacionProductoService.crudImportacionProducto(_item,3).subscribe(res=>{
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.loadSpecsList();
			
				},err=>{
					alert("Ha ocurrido un error, por favor vuelva a intentarlo");
				});
				
			});
		}else{
			alert("No se puede eliminar porque ya ha sido publicado en mercado libre");
		}
		
	}

	publicarProductosSeleccionados() {
		// var itemsPublicar=arra[]
		const _title: string = 'Producto a publicar';
		const _description: string = '¿Está seguro que desea publicar estos productos?';
		const _waitDesciption: string = 'Publicando en Mercado Libre...';
		const _deleteMessage = 'Productos subidos con éxito!';
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			var itemMercadoLibre:MercadoLibreItem;
			var array=[];
			
			const length = this.selection.selected.length;
			for (let i = 0; i < length; i++) {
				//tomo todos los items seleccionados y los guardo en un nuevo array con la forma que pide mercadolibre para luego enviarselos al servicio 
				itemMercadoLibre=new MercadoLibreItem(this.selection.selected[i]._titulo,this.selection.selected[i]._descripcion,this.selection.selected[i]._costo,this.selection.selected[i]._stock,this.selection.selected[i]._imagenes)
                console.log(itemMercadoLibre);
				array.push({item:itemMercadoLibre,
							//estos dos campos son para crear las publicaciones en la bdd local, no son exigisdos por mec
							idproducto:this.selection.selected[i].idproducto,
							idimportacionproducto:this.selection.selected[i].idimportacionproducto 
							//campo necesario para actualizar mec de importacion_producto (cambia a 1 cuando este item ha sido publicado en mec)
						})
			}
			let respuestasMec:any []=[];

			this.mercadoLibreService.publicarItem2(array).pipe( catchError((err) => {
				console.log(err);
				//manejo de errores ERROR_MEC
				if(err.error.result && err.error.result!="TOKEN_REQUERIDO"){ //cundo hay un error en mec o cuando hay un error de coneccion o el bakend
					// let mensajeError=err.error.message ? "" :"";
					respuestasMec.push({
						text: `${err.error.titulo}`,
						status: 0,
						error:err.error.message ? err.error.message : "error de conexión"
					})
					return of([]) //retorna un arreglo vacio
				}	
				else if(err.error.result && err.error.result=="TOKEN_REQUERIDO"){
					return throwError(err);
				}

			}))
			.subscribe(res=>{
				if(res.titulo){
					//guardo todas las respuestas que devuelve mec
					respuestasMec.push({
						text: `${res.titulo}`,
						status: 1
					})					
				}							
							
			},err=>{
				//solo se ejecutara cuando sea un error de token
				// if(err.error.result && err.error.result=="TOKEN_REQUERIDO"){
					let _urlAuthMercadoLibre = err.error.message;		
					console.log(_urlAuthMercadoLibre);	
					window.open(_urlAuthMercadoLibre,"_blank");
				// }				
			},()=>{
				this.loadSpecsList();
				// this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.selection.clear();
				this.mostrarRespuestas(respuestasMec);
			})
		});
	}


	/** Los mensajes son las respuestas del servidor de mercado libre*/
	mostrarRespuestas(mensajes:any[]) {
		this.layoutUtilsService.fetchElements(mensajes);
	}

	addSpec() {
		let importacionProducto = new ImportacionProductoModel();
		importacionProducto.clear(this.idimportacion);
		const dialogRef = this.dialog.open(ImportacionProductoEditarDialogComponent, {
			data: {
				...importacionProducto
			},
			width:"90%",
			height:"90%",
		});
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (res && res._info_id) {
				
				this.loadSpecsList();
				const saveMessage = `Specification has been created`;
				this.layoutUtilsService.showActionNotification(res._info_titulo, res.info_desc, 10000, true, false);
			}
		});
	}

	editSpec(importacionProducto: ImportacionProductoModel) {
		const dialogRef = this.dialog.open(ImportacionProductoEditarDialogComponent, {
			data: {
				...importacionProducto
			},
			width:"90%",
			height:"90%",
		});
		dialogRef.afterClosed().subscribe(res => {
			if (res && res._info_id) {
				this.loadSpecsList();
				const saveMessage = `Specification has been updated`;
				this.layoutUtilsService.showActionNotification(saveMessage, MessageType.Update, 10000, true, false);
			}
		});
	}
	
}
