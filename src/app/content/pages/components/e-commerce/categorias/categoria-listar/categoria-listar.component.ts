import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
// Services
import { CategoriaService } from '../../_core/services/index';
import { LayoutUtilsService, MessageType } from '../../_core/utils/layout-utils.service';
import { SubheaderService } from '../../../../../../core/services/layout/subheader.service';
// Models
import { CategoriaModel } from '../../_core/models/categoria.model';

import { CategoriaDataSource } from '../../_core/models/data-sources/categoria.datasource';
import { QueryParamsModel } from '../../_core/models/query-models/query-params.model';
import{CategoriaEditarComponent} from '../categoria-editar/categoria-editar.component';
@Component({
  selector: 'm-categoria-listar',
  templateUrl: './categoria-listar.component.html'
})
export class CategoriaListarComponent implements OnInit {
// Table fields
	dataSource: CategoriaDataSource;
	displayedColumns = ['id', 'nombre', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: string = '';
	filterCondition: string = '';
	// Selection
	// selection = new SelectionModel<CategoriaModel>(true, []);
	productsResult: CategoriaModel[] = [];

	constructor(private categoriaService: CategoriaService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private subheaderService: SubheaderService,
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

		// Filtration, bind to searchInput
		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(
				debounceTime(150),
				distinctUntilChanged(),
				tap(() => {
					this.paginator.pageIndex = 0;
					this.loadProductsList();
				})
			)
			.subscribe();

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Categorias');
		// Init DataSource
		this.dataSource = new CategoriaDataSource(this.categoriaService);
		let queryParams = new QueryParamsModel({});
		// Read from URL itemId, for restore previous state
		this.route.queryParams.subscribe(params => {
			if (params.id) {
				queryParams = this.categoriaService.lastFilter$.getValue();
				// this.restoreState(queryParams, +params.id);
			}
			// First load
			this.dataSource.loadCategorias(queryParams);
		});
		this.dataSource.entitySubject.subscribe(res => this.productsResult = res);
	}

addCustomer() {
		const newCustomer = new CategoriaModel();
		newCustomer.clear(); // Set all defaults fields
		this.editCustomer(newCustomer);
	}

	/** Edit */
	editCustomer(categoria: CategoriaModel) {
		let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
		saveMessageTranslateParam += categoria.idcategoria > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
		const _saveMessage = 'guardado';
		const _messageType = categoria.idcategoria > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(CategoriaEditarComponent, { data: { categoria } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, false);
			this.loadProductsList();
		});
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
		this.dataSource.loadCategorias(queryParams);
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

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

	// restoreState(queryParams: QueryParamsModel, id: number) {
	// 	if (id > 0) {
	// 		this.categoriaService.getImportacionById(id).subscribe((res: CategoriaModel) => {
	// 			const message = res._createddate === res._updateddate ?
	// 				`New product successfully has been added.` :
	// 				`Product successfully has been saved.`;
	// 			this.layoutUtilsService.showActionNotification(message, res._isNew ? MessageType.Create : MessageType.Update, 10000, true, false);
	// 		});
	// 	}

	// 	if (!queryParams.filter) {
	// 		return;
	// 	}

	// 	if ('condition' in queryParams.filter) {
	// 		this.filterCondition = queryParams.filter.condition.toString();
	// 	}

	// 	if ('status' in queryParams.filter) {
	// 		this.filterStatus = queryParams.filter.status.toString();
	// 	}

	// 	if (queryParams.filter.model) {
	// 		this.searchInput.nativeElement.value = queryParams.filter.model;
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
