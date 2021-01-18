import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, concatMap} from 'rxjs/operators';
import { fromEvent, merge, forkJoin, from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
import { ProductoService } from '../../_core/services/index';
import { LayoutUtilsService, MessageType } from '../../_core/utils/layout-utils.service';
import { HttpUtilsService } from '../../_core/utils/http-utils.service';
// Models
import { QueryParamsModel } from '../../_core/models/query-models/query-params.model';
import { ProductoModel } from '../../_core/models/producto.model';
import { ProductoDataSource } from '../../_core/models/data-sources/producto.datasource';
// Components
import { ProductoEditarDialogComponent } from '../producto-editar/producto-editar.dialog.component';
import { ModalProductsComponent } from '../../_shared/modal-products/modal-products.component';
import * as XLSX from "xlsx";

type AOA = any[][];

@Component({
	selector: 'm-producto-listar',
	templateUrl: './producto-listar.component.html',
	styleUrls: ['./producto-listar.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductoListarComponent implements OnInit {

	// Table fields
	dataSource: ProductoDataSource;
	displayedColumns = ['codigo', 'descripcion', 'codigofabricante', '_stock', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	// Filter fields
	// @ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: string = '';
	filterType: string = '';
	// Selection
	selection = new SelectionModel<ProductoModel>(true, []);
	products: ProductoModel[] = [];
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	data: AOA = [[1, 2], [3, 4]];
	wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "array" };
	fileName: string = "SheetJS.xlsx";

	constructor(
		private productoService: ProductoService,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		// private productoService: ProductoService,
	) {}

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

		// // Filtration, bind to searchInput
		// fromEvent(this.searchInput.nativeElement, 'keyup')
		// 	.pipe(
		// 		// tslint:disable-next-line:max-line-length
		// 		debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
		// 		distinctUntilChanged(), // This operator will eliminate duplicate values
		// 		tap(() => {
		// 			this.paginator.pageIndex = 0;
		// 			this.load();
		// 		})
		// 	)
		// 	.subscribe();

		// Init DataSource
		const queryParams = new QueryParamsModel(this.filterConfiguration(false));
		this.dataSource = new ProductoDataSource(this.productoService);
		// First load
		this.dataSource.load(queryParams);
		this.dataSource.entitySubject.subscribe(res => (this.products = res));

	}

	load() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(true),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.dataSource.load(queryParams);
		this.selection.clear();
	}

	/** FILTRATION */
	filterConfiguration(isGeneralSearch: boolean = true): any {
		const filter: any = {};
		// const searchText: string = this.searchInput.nativeElement.value;
	    const searchText: string = '';


		if (this.filterStatus && this.filterStatus.length > 0) {
			filter.status = +this.filterStatus;
		}

		if (this.filterType && this.filterType.length > 0) {
			filter.type = +this.filterType;
		}

		filter.lastName = searchText;
		if (!isGeneralSearch) {
			return filter;
		}

		filter.firstName = searchText;
		filter.email = searchText;
		filter.ipAddress = searchText;
		return filter;
	}

	/** ACTIONS */
	/** Delete */
	deleteCustomer(_item: ProductoModel) {
		const _title: string = 'Eliminar producto';
		const _description: string = '¿Está seguro que desea eliminar este producto permanentemente?';
		const _waitDesciption: string = 'Eliminando producto...';
		const _deleteMessage = `El producto ha sido eliminado`;

	 	const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
	 	dialogRef.afterClosed().subscribe(res => {
	 		if (!res) {
	 			return;
	 		}

	 		this.productoService.crudProducto(_item,3).subscribe((res) => {
	 			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
	 			this.load();
	 		},err=>{
				alert("Ha ocurrido un error, por favor vuelva a intentarlo");

			 });
	 	});
	 }

	add() {
		const newProduct = new ProductoModel();
		newProduct.clear(); // Set all defaults fields
		this.edit(newProduct);
	}
	

	/** Edit */
	edit(producto: ProductoModel) {
		const _saveMessage =  producto.idproducto > 0 ? 'PRODUCTO ACTUALIZADO CORRECTAMENTE' : 'PRODUCTO CREADO CORRECTAMENTE';
		const _messageType = producto.idproducto > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(ProductoEditarDialogComponent, { data: { producto },
			width:"70%",
			height:"90%", });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, false);
			this.load();
		});
	}

	/** SELECTION */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.products.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.products.length) {
			this.selection.clear();
		} else {
			this.products.forEach(row => this.selection.select(row));
		}
	}

	/** UI */
	getItemCssClassByStatus(status: number = 0): string {
		switch (status) {
			case 0:
				return 'metal';
			case 1:
				return 'success';
			case 2:
				return 'danger';
		}
		return '';
	}

	getItemStatusString(status: number = 0): string {
		switch (status) {
			case 0:
				return 'Suspended';
			case 1:
				return 'Active';
			case 2:
				return 'Pending';
		}
		return '';
	}

	getItemCssClassByType(status: number = 0): string {
		switch (status) {
			case 0:
				return 'accent';
			case 1:
				return 'primary';
			case 2:
				return '';
		}
		return '';
	}

	getItemTypeString(status: number = 0): string {
		switch (status) {
			case 0:
				return 'Business';
			case 1:
				return 'Individual';
		}
		return '';
	}

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
				let producto = {
					descripcion: i[0],
					precio1: this.round(this.calculoRentabilidad(i[2], i[1]),4),
					codigofabricante: i[3],
					idtipo: parseInt(i[4], 10),
					costo: this.round(i[1],2),
					iva: i[6]
				}
				if(this.isValid({...producto})){
					array.push({index:count, ...producto});
					count++;
				}
			}
		  });
		  this.abrirModal(array);
		};
		reader.readAsBinaryString(target.files[0]);
	}
	
	export(): void {
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

		/* save to file */
		XLSX.writeFile(wb, this.fileName);
	}
	
	calculoRentabilidad(pvp, costo) {
		return (pvp - costo) / costo;
	}
	isValid(producto):boolean{
		// console.log(producto);
		if(producto.codigofabricante && producto.descripcion!="" && producto.precio1>0 && producto.precio1 && producto.costo && producto.idtipo){
			return true
		}
		return false;
	}

	round(number, precision) {
		var factor = Math.pow(10, precision);
		var tempNumber = number * factor;
		var roundedTempNumber = Math.round(tempNumber);
		return roundedTempNumber / factor;
	};
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
				this.createProductos(data);
			}
		})
	}

	createProductos(productos: ProductoModel[]) { 
		let respuestas = [];
		let cont = 0;
		
		from(productos).pipe(
			concatMap(i=>this.productoService.crudProducto(i,1))
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

