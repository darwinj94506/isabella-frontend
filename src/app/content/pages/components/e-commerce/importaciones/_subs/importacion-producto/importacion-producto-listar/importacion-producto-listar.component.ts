import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
// Material
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { from, Observable, of, throwError } from 'rxjs';
import { concatMap, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
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
import * as XLSX from "xlsx";
import { ModalProductsComponent } from '../../../../_shared/modal-products/modal-products.component';

type AOA = any[][];


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
	displayedColumns = ['select', '_codigo', '_descripcion','_codigofabricante','cantidad','actions'];
	productos: ProductoModel[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	selection = new SelectionModel<ImportacionProductoModel>(true, []);
	importacionProductoResult: ImportacionProductoModel[] = [];

	data: AOA = [[1, 2], [3, 4]];
	wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "array" };
	fileName: string = "SheetJS.xlsx";


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
					this.load();
				})
			)
			.subscribe();
		// Init DataSource
		this.dataSource = new ImportacionProductoDataSource(this.importacionProductoService);
		// this loading binded to parent component loading
		this.dataSource.loading$.subscribe(res => {
			this.loadingSubject.next(res);
		});
		this.load();
		this.dataSource.entitySubject.subscribe(res => this.importacionProductoResult = res);
	
	}

	load() {
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
					this.load();
			
				},err=>{
					alert("Ha ocurrido un error, por favor vuelva a intentarlo");
				});
				
			});
		}else{
			alert("No se puede eliminar porque ya ha sido publicado en mercado libre");
		}
		
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
				
				this.load();
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
				this.load();
				const saveMessage = `Specification has been updated`;
				this.layoutUtilsService.showActionNotification(saveMessage, MessageType.Update, 10000, true, false);
			}
		});
	}
	//subida masiva de ingresos
	onFileChange(evt: any) {
		let count = 1;
		/* wire up file reader */
		const target: DataTransfer = <DataTransfer>evt.target;
		if (target.files.length !== 1) throw new Error("Cannot use multiple files");
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			/* read workbook */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
	
			/* grab first sheet */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];
	
			/* save data */
			this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
			let array = [];
			this.data.map((i, index) => {
			if (index != 0 && i[0]!=undefined) 
			{
				let item = {
					idimportacion: 0,
					codigofabricante: i[3],
					idtipo: parseInt(i[4], 10),
					iva: i[6]
				}
				if(this.isValid({...item})){
					array.push({index:count, ...item});
					count++;
				}
			}
			});
			this.abrirModal(array);
		};
		reader.readAsBinaryString(target.files[0]);
	}
		
		abrirModal(data=null){
		const dialogRef = this.dialog.open(ModalProductsComponent , {
			hasBackdrop:true,
			width:"70%",
			height:"80%",
			data:data
		});
		// console.log(.);
		dialogRef.afterClosed().subscribe(data=>{
			if(data){
				this.crearItems(data);
			}
		})
	}

	isValid(producto):boolean{
		// console.log(producto);
		if(producto.codigofabricante && producto.descripcion!="" && producto.precio1>0 && producto.precio1 && producto.costo && producto.idtipo){
			return true
		}
		return false;
	}


	crearItems(productos: any[]) { 
		let respuestas = [];
		let cont = 0;
		from(productos).pipe(
			concatMap(i=>this.importacionProductoService.crudImportacionProducto(i,1))
		).subscribe(res=>{
			if(res._info_id){
				respuestas.push({
					descripcion: productos[cont].descripcion,
					codigoFabricante:  productos[cont].codigofabricante,
					estado: 'CREADO CORRECTAMENTE',
				})
			}else{
				respuestas.push({
					descripcion: productos[cont].descripcion,
					codigoFabricante:  productos[cont].codigofabricante,
					estado: res._info_desc
				})
			}
			if(cont == productos.length-1){
				this.load();
			}
			cont++;
		},
		error=>{
			alert("Ha ocurrido un error");
		})
	}

}
