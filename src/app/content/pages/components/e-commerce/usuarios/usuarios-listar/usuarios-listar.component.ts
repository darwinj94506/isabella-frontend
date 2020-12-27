import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
// Services
import { UsuarioService } from '../../_core/services/index';
import { LayoutUtilsService, MessageType } from '../../_core/utils/layout-utils.service';
import { SubheaderService } from '../../../../../../core/services/layout/subheader.service';
// Models
import { UsuarioModel } from '../../_core/models/usuario.model';

import { UsuarioDataSource } from '../../_core/models/data-sources/usuario.datasource';
import { QueryParamsModel } from '../../_core/models/query-models/query-params.model';
import{UsuariosEditarComponent} from '../usuarios-editar/usuarios-editar.component';
@Component({
  selector: 'm-usuarios-listar',
  templateUrl: './usuarios-listar.component.html'
})
export class UsuariosListarComponent implements OnInit {
// Table fields
	dataSource: UsuarioDataSource;
	displayedColumns = ['nombres', 'apellidos', 'cedula','rol', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	// Filter fields
	// @ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: string = '';
	filterCondition: string = '';
	// Selection
	// selection = new SelectionModel<UsuarioModel>(true, []);
	productsResult: UsuarioModel[] = [];

	constructor(private usuarioService: UsuarioService,
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
		this.subheaderService.setTitle('Usuarios');
		// Init DataSource
		this.dataSource = new UsuarioDataSource(this.usuarioService);
		let queryParams = new QueryParamsModel({});
		// Read from URL itemId, for restore previous state
		this.route.queryParams.subscribe(params => {
			if (params.id) {
				queryParams = this.usuarioService.lastFilter$.getValue();
				// this.restoreState(queryParams, +params.id);
			}
			// First load
			this.dataSource.loadUsuarios(queryParams);
		});
		this.dataSource.entitySubject.subscribe(res => this.productsResult = res);
	}
	deleteCustomer(_item: UsuarioModel) {
		const _title: string = 'Eliminar usuario';
		const _description: string = '¿Está seguro que desea eliminar este usuario permanentemente?';
		const _waitDesciption: string = 'Eliminando usuario...';
		const _deleteMessage = `EL usuario ha sido eliminado`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.usuarioService.crudUsuario(_item,3).subscribe((res) => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadProductsList();
			},err=>{
				alert("Ha ocurrido un error, por favor vuelva a intentarlo");

			});
		});
	}

addCustomer() {
		const newCustomer = new UsuarioModel();
		newCustomer.clear(); // Set all defaults fields
		this.editCustomer(newCustomer);
	}

	/** Edit */
	editCustomer(usuario: UsuarioModel) {
		// let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
		// saveMessageTranslateParam += usuario.idusuario > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
		const _saveMessage = usuario.idusuario > 0 ? 'USUARIO ACTUALIZADO CORRECTAMENTE' : 'USUARIO CREADO CORRECTAMENTE';
		const _messageType = usuario.idusuario > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(UsuariosEditarComponent, { data: { usuario },
			width:"90%",
			height:"90%", });
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
			null,			
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.dataSource.loadUsuarios(queryParams);
	}

	/** FILTRATION */
	// filterConfiguration(): any {
	// 	const filter: any = {};
	// 	const searchText: string = this.searchInput.nativeElement.value;

	// 	if (this.filterStatus && this.filterStatus.length > 0) {
	// 		filter.status = +this.filterStatus;
	// 	}

	// 	if (this.filterCondition && this.filterCondition.length > 0) {
	// 		filter.condition = +this.filterCondition;
	// 	}

	// 	filter.model = searchText;

	// 	filter.manufacture = searchText;
	// 	filter.color = searchText;
	// 	filter.codigo = searchText;
	// 	return filter;
	// }

	// restoreState(queryParams: QueryParamsModel, id: number) {
	// 	if (id > 0) {
	// 		this.usuarioService.getImportacionById(id).subscribe((res: UsuarioModel) => {
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
