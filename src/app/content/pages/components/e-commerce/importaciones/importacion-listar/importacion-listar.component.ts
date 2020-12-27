import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
// Services
import { ImportacionService } from '../../_core/services/index';
import { LayoutUtilsService, MessageType } from '../../_core/utils/layout-utils.service';
import { SubheaderService } from '../../../../../../core/services/layout/subheader.service';
// Models
import { ProductoModel } from '../../_core/models/producto.model';
import { ImportacionModel } from '../../_core/models/importacion.model';

import { ImportacionDataSource } from '../../_core/models/data-sources/importacion.datasource';
import { QueryParamsModel } from '../../_core/models/query-models/query-params.model';
import{ImportacionProductoService} from '../../_core/services/index';
// Table with EDIT item in new page
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	selector: 'm-importacion-listar',
	templateUrl: './importacion-listar.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportacionListarComponent implements OnInit {
	// Table fields
	dataSource: ImportacionDataSource;
	displayedColumns = ['idimportacion', 'usuario', 'numerodocumento','fecha', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	// Filter fields
	// @ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: string = '';
	filterCondition: string = '';
	// Selection
	// selection = new SelectionModel<ImportacionModel>(true, []);
	productsResult: ImportacionModel[] = [];

	constructor(private importacionService: ImportacionService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private subheaderService: SubheaderService,
		private importacionProductoService:ImportacionProductoService,
		private layoutUtilsService: LayoutUtilsService) { }

	/** LOAD DATA */
	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(() => {
					this.loadProductsList();
				})
			)
			.subscribe();

		// // Filtration, bind to searchInput
		// fromEvent(this.searchInput.nativeElement, 'keyup')
		// 	.pipe(
		// 		debounceTime(150),
		// 		distinctUntilChanged(),
		// 		tap(() => {
		// 			this.paginator.pageIndex = 0;
		// 			this.loadProductsList();
		// 		})
		// 	)
		// 	.subscribe();

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Importaciones');
		// Init DataSource
		this.dataSource = new ImportacionDataSource(this.importacionService);
		let queryParams = new QueryParamsModel({});
		// Read from URL itemId, for restore previous state
		this.route.queryParams.subscribe(params => {
			if (params.id) {
				queryParams = this.importacionService.lastFilter$.getValue();
				this.restoreState(queryParams, +params.id);
			}
			// First load
			this.dataSource.loadProducts(queryParams);
		});
		this.dataSource.entitySubject.subscribe(res => this.productsResult = res);
	}

	loadProductsList() {
		// this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.dataSource.loadProducts(queryParams);
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		// const searchText: string = this.searchInput.nativeElement.value;
		const searchText: string = '';

		if (this.filterStatus && this.filterStatus.length > 0) {
			filter.status = +this.filterStatus;
		}

		if (this.filterCondition && this.filterCondition.length > 0) {
			filter.condition = +this.filterCondition;
		}

		filter.model = searchText;

		filter.manufacture = searchText;
		filter.color = searchText;
		filter.codigo = searchText;
		return filter;
	}

	restoreState(queryParams: QueryParamsModel, id: number) {
		if (id > 0) {
			this.importacionService.getImportacionById(id).subscribe((res: ImportacionModel) => {
				const message = res._createddate === res._updateddate ?
					`New product successfully has been added.` :
					`Product successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, res._isNew ? MessageType.Create : MessageType.Update, 10000, true, false);
			});
		}

		if (!queryParams.filter) {
			return;
		}

		if ('condition' in queryParams.filter) {
			this.filterCondition = queryParams.filter.condition.toString();
		}

		if ('status' in queryParams.filter) {
			this.filterStatus = queryParams.filter.status.toString();
		}

		if (queryParams.filter.model) {
			// this.searchInput.nativeElement.value = queryParams.filter.model;
		}
	}

	/** ACTIONS */
	/** Delete */
	deleteProduct(_item: ImportacionModel) {
		const _title: string = 'Eliminar producto';
		const _description: string = '¿Está seguro que desea eliminar este producto permanentemente?';
		const _waitDesciption: string = 'Eliminando importación...';
		const _deleteMessage = `La importación ha sido eliminada`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.importacionService.crudImportacion(_item,3).subscribe((res) => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadProductsList();
			},err=>{
				alert("Ha ocurrido un error, por favor vuelva a intentarlo");

			});
		});
	}

	// deleteProducts() {
	// 	const _title: string = 'Products Delete';
	// 	const _description: string = 'Are you sure to permanently delete selected products?';
	// 	const _waitDesciption: string = 'Products are deleting...';
	// 	const _deleteMessage = 'Selected products have been deleted';

	// 	const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 			return;
	// 		}

	// 		const idsForDeletion: number[] = [];
	// 		for (let i = 0; i < this.selection.selected.length; i++) {
	// 			idsForDeletion.push(this.selection.selected[i].id);
	// 		}
	// 		this.importacionService.deleteImportaciones(idsForDeletion).subscribe(() => {
	// 			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
	// 			this.loadProductsList();
	// 			this.selection.clear();
	// 		});
	// 	});
	// }

	/** Fetch 
	fetchProducts() {
		let messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.manufacture} ${elem.model} ${elem.modelYear}`,
				id: elem.codigo,
				status: elem.status
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}
	*/

	/** Update Product 
	updateStatusForProducts() {
		const _title = 'Update status for selected products';
		const _updateMessage = 'Status has been updated for selected products';
		const _statuses = [{ value: 0, text: 'Selling' }, { value: 1, text: 'Sold' }];
		const _messages = [];

		this.selection.selected.forEach(elem => {
			_messages.push({
				text: `${elem.manufacture} ${elem.model} ${elem.modelYear}`,
				id: elem.codigo,
				status: elem.status,
				statusTitle: this.getItemStatusString(elem.status),
				statusCssClass: this.getItemCssClassByStatus(elem.status)
			});
		});

		const dialogRef = this.layoutUtilsService.updateStatusForCustomers(_title, _statuses, _messages);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.selection.clear();
				return;
			}

			this.importacionService.updateStatusForProduct(this.selection.selected, +res).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
				this.loadProductsList();
				this.selection.clear();
			});
		});
	}
	*/

	/** SELECTION */
	// isAllSelected() {
	// 	const numSelected = this.selection.selected.length;
	// 	const numRows = this.productsResult.length;
	// 	return numSelected === numRows;
	// }

	 /** Selects all rows if they are not all selected; otherwise clear selection. */
	// masterToggle() {
	// 	if (this.isAllSelected()) {
	// 		this.selection.clear();
	// 	} else {
	// 		this.productsResult.forEach(row => this.selection.select(row));
	// 	}
	// }

	/* UI */
	getItemStatusString(status: number = 0): string {
		switch (status) {
			case 0:
				return 'En espera';
			case 1:
				return 'Publicado';
		}
		return '';
	}

	getItemCssClassByStatus(status: number = 0): string {
		switch (status) {
			case 0:
				return 'metal';
			case 1:
				return 'success';
		}
		return '';
	}

	getItemConditionString(condition: number = 0): string {
		switch (condition) {
			case 0:
				return 'New';
			case 1:
				return 'Used';
		}
		return '';
	}

	getItemCssClassByCondition(condition: number = 0): string {
		switch (condition) {
			case 0:
				return 'primary';
			case 1:
				return 'accent';
		}
		return '';
	}
}
