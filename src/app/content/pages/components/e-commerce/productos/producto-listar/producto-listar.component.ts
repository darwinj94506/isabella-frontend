import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge, forkJoin } from 'rxjs';
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

@Component({
	selector: 'm-producto-listar',
	templateUrl: './producto-listar.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductoListarComponent implements OnInit {
	// Table fields
	dataSource: ProductoDataSource;
	displayedColumns = ['codigo', 'titulo', 'codigofabricante', '_stock', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	// Filter fields
	// @ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: string = '';
	filterType: string = '';
	// Selection
	selection = new SelectionModel<ProductoModel>(true, []);
	customersResult: ProductoModel[] = [];

	constructor(
		private productoService: ProductoService,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService
	) {}

	/** LOAD DATA */
	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(() => {
					this.loadCustomersList();
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
		// 			this.loadCustomersList();
		// 		})
		// 	)
		// 	.subscribe();

		// Init DataSource
		const queryParams = new QueryParamsModel(this.filterConfiguration(false));
		this.dataSource = new ProductoDataSource(this.productoService);
		// First load
		this.dataSource.loadCustomers(queryParams);
		this.dataSource.entitySubject.subscribe(res => (this.customersResult = res));

	}

	loadCustomersList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(true),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.dataSource.loadCustomers(queryParams);
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
	 			this.loadCustomersList();
	 		},err=>{
				alert("Ha ocurrido un error, por favor vuelva a intentarlo");

			 });
	 	});
	 }

	// deleteCustomers() {
	// 	const _title: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.TITLE');
	// 	const _description: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.DESCRIPTION');
	// 	const _waitDesciption: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.WAIT_DESCRIPTION');
	// 	const _deleteMessage = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.MESSAGE');

	// 	const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 			return;
	// 		}

	// 		const idsForDeletion: number[] = [];
	// 		for (let i = 0; i < this.selection.selected.length; i++) {
	// 			idsForDeletion.push(this.selection.selected[i].id);
	// 		}
	// 		this.productoService
	// 			.deleteCustomers(idsForDeletion)
	// 			.subscribe(() => {
	// 				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
	// 				this.loadCustomersList();
	// 				this.selection.clear();
	// 			});
	// 	});
	// }

	/** Fetch */
	// fetchCustomers() {
	// 	const messages = [];
	// 	this.selection.selected.forEach(elem => {
	// 		messages.push({
	// 			text: `${elem.lastName}, ${elem.firstName}`,
	// 			id: elem.id.toString(),
	// 			status: elem.status
	// 		});
	// 	});
	// 	this.layoutUtilsService.fetchElements(messages);
	// }

	/** Update Status */
	// updateStatusForCustomers() {
	// 	const _title = this.translate.instant('ECOMMERCE.CUSTOMERS.UPDATE_STATUS.TITLE');
	// 	const _updateMessage = this.translate.instant('ECOMMERCE.CUSTOMERS.UPDATE_STATUS.MESSAGE');
	// 	const _statuses = [{ value: 0, text: 'Suspended' }, { value: 1, text: 'Active' }, { value: 2, text: 'Pending' }];
	// 	const _messages = [];

	// 	this.selection.selected.forEach(elem => {
	// 		_messages.push({
	// 			text: `${elem.lastName}, ${elem.firstName}`,
	// 			id: elem.id.toString(),
	// 			status: elem.status,
	// 			statusTitle: this.getItemStatusString(elem.status),
	// 			statusCssClass: this.getItemCssClassByStatus(elem.status)
	// 		});
	// 	});

	// 	const dialogRef = this.layoutUtilsService.updateStatusForCustomers(_title, _statuses, _messages);
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 			this.selection.clear();
	// 			return;
	// 		}

	// 		this.productoService
	// 			.updateStatusForCustomer(this.selection.selected, +res)
	// 			.subscribe(() => {
	// 				this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
	// 				this.loadCustomersList();
	// 				this.selection.clear();
	// 			});
	// 	});
	// }

	addCustomer() {
		const newCustomer = new ProductoModel();
		newCustomer.clear(); // Set all defaults fields
		this.editCustomer(newCustomer);
	}
	

	/** Edit */
	editCustomer(producto: ProductoModel) {
		// let saveMessageTranslateParam = '';
		// saveMessageTranslateParam += producto.idproducto > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
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
			this.loadCustomersList();
		});
	}

	/** SELECTION */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.customersResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.customersResult.length) {
			this.selection.clear();
		} else {
			this.customersResult.forEach(row => this.selection.select(row));
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
}

