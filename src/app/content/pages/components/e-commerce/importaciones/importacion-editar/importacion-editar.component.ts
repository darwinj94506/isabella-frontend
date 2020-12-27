import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  BehaviorSubject } from 'rxjs';
// import { map, startWith} from 'rxjs/operators';
import { ImportacionService } from '../../_core/services/index';

import { ImportacionModel } from '../../_core/models/importacion.model';
// import { SpecificationModel } from '../../_core/models/specification.model';
// import { TypesUtilsService } from '../../_core/utils/types-utils.service';
import { ListStateModel } from '../../_core/utils/list-state.model';
import { SubheaderService } from '../../../../../../core/services/layout/subheader.service';
import { LayoutUtilsService, MessageType } from '../../_core/utils/layout-utils.service';
// import { ImportacionProductoService } from '../../_core/services/importacion-producto.service';

@Component({
	selector: 'm-importacion-editar',
	templateUrl: './importacion-editar.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportacionEditarComponent implements OnInit {
	productosListState: ListStateModel;
	importacion: ImportacionModel;
	oldImportacion: ImportacionModel;
	selectedTab: number = 0;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	importacionForm: FormGroup;
	hasFormErrors: boolean = false;
	remarksListState: ListStateModel;
	availableYears: number[] = [];
	// filteredColors: Observable<string[]>;
	// filteredManufactures: Observable<string[]>;

	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private importacionsService: ImportacionService,
		// private importacionProductoService:ImportacionProductoService,
		// private typesUtilsService: TypesUtilsService,
		private importacionFB: FormBuilder,
		public dialog: MatDialog,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService) { }

	ngOnInit() {
		this.loadingSubject.next(true);
		this.activatedRoute.queryParams.subscribe(params => {
			const id = +params.id;
			if (id && id > 0) {
				this.importacionsService.getImportacionById(id).subscribe(res => {
					console.log(res);
					this.importacion = res;
					this.oldImportacion = Object.assign({}, res);
					this.initImportacion();
				},error=>{
					alert(error);
					this.loadingSubject.next(false);
				}
				);
			} else {
				const newImportacion = new ImportacionModel();
				newImportacion.clear();
				this.importacion = newImportacion;
				this.oldImportacion = Object.assign({}, newImportacion);
				this.initImportacion();
			}
		},error=>{
			// alert(error.message);
			this.loadingSubject.next(false);
		}
		);
		// for (let i = 2018; i > 1945; i--) {
		// 	this.availableYears.push(i);
		// }
	}

	initImportacion() {
		this.createForm();
		this.loadLists();
		this.loadingSubject.next(false);
		if (!this.importacion.idimportacion) {
			this.subheaderService.setBreadcrumbs([
				{ title: 'eCommerce', page: '/ecommerce' },
				{ title: 'Products',  page: '/ecommerce/products' },
				{ title: 'Subir Nueva Importación', page: '/products/add' }
			]);
			return;
		}
		this.subheaderService.setTitle('Editar Importación');
		this.subheaderService.setBreadcrumbs([
			{ title: 'eCommerce', page: '/ecommerce' },
			{ title: 'Products',  page: '/ecommerce/products' },
			{ title: 'Editar Importación', page: '/products/edit', queryParams: { id: this.importacion.idimportacion } }
		]);
	}
		// 'codigo', 'fechaImportacion', 'fechaSubida', 'precio', 'estado',

// convenience getter for easy access to form fields
	get f() { return this.importacionForm.controls; }
	createForm() {
		this.importacionForm = this.importacionFB.group({
			fecha: [this.importacion.fecha, Validators.required],
			numerodocumento:[this.importacion.numerodocumento,Validators.compose([Validators.required,Validators.maxLength(50)])],
			
			// precio: [this.importacion.precio.toString(), [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
			// estado: [this.importacion.estado.toString(), [Validators.required, Validators.min(0), Validators.max(1)]],
			descripcion:[this.importacion.descripcion,Validators.maxLength(255)]
		});

		// this.filteredManufactures = this.importacionForm.controls.manufacture.valueChanges
		// 	.pipe(
		// 		startWith(''),
		// 		map(val => this.filterManufacture(val.toString()))
		// 	);
		// this.filteredColors = this.importacionForm.controls.color.valueChanges
		// 	.pipe(
		// 		startWith(''),
		// 		map(val => this.filterColor(val.toString()))
		// );

	}

	loadLists() {
		this.productosListState = new ListStateModel(this.importacion.idimportacion);
	}

	// filterManufacture(val: string): string[] {
	// 	return this.availableManufactures.filter(option =>
	// 		option.toLowerCase().includes(val.toLowerCase()));
	// }

	// filterColor(val: string): string[] {
	// 	return this.availableColors.filter(option =>
	// 		option.toLowerCase().includes(val.toLowerCase()));
	// }

	goBack(id = 0) {
		let _backUrl = 'products';
		if (id > 0) {
			_backUrl += '?id=' + id;
		}
		this.router.navigateByUrl(_backUrl);
	}

	refreshImportacion(id = 0) {
		// console.log(" se refresca");
		const _refreshUrl = 'products/edit?id=' + id;
		this.router.navigateByUrl(_refreshUrl);
	}

	reset() {
		this.importacion = Object.assign({}, this.oldImportacion);
		this.createForm();
		this.hasFormErrors = false;
		this.importacionForm.markAsPristine();
        this.importacionForm.markAsUntouched();
        this.importacionForm.updateValueAndValidity();
	}

	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.importacionForm.controls;
		/** check form */
		if (this.importacionForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		// tslint:disable-next-line:prefer-const
		let editedImportacion = this.prepareImportacion();

		if (editedImportacion.idimportacion > 0) {
			this.updateImportacion(editedImportacion, withBack);
			return;
		}
		this.addImportacion(editedImportacion, withBack);
	}

	prepareImportacion(): ImportacionModel {
		const controls = this.importacionForm.controls;
		const _importacion = new ImportacionModel();
		_importacion.idimportacion = this.importacion.idimportacion;
		_importacion.fecha = controls['fecha'].value;
		_importacion.descripcion = controls['descripcion'].value;
		_importacion.numerodocumento = controls['numerodocumento'].value;
		//valores de la interfaz

		_importacion.idusuario = 1; // TODO: get version from userId
		// _importacion._createddate = this.importacion._createddate;
		// _importacion._updateddate = this.importacion._updateddate;
		this.productosListState.prepareState();
		

		_importacion._isNew = this.importacion.idimportacion > 0 ? false : true;
		_importacion._isUpdated = this.importacion.idimportacion > 0;
		return _importacion;
	}

	addImportacion(_importacion: ImportacionModel, withBack: boolean = false) {
		this.loadingSubject.next(true);
		console.log(_importacion);
		this.importacionsService.crudImportacion(_importacion,1).subscribe(res => {
			console.log(res);
			this.loadingSubject.next(false);
			if (withBack) {
				this.goBack(res._idimportacion);
			} else {
				const message = `Importación creada correctamente`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, false);
				this.refreshImportacion(res._idimportacion);
			}
		});
	}

	updateImportacion(_importacion: ImportacionModel, withBack: boolean = false) {
		this.loadingSubject.next(true);

		this.importacionsService.crudImportacion(_importacion,2).subscribe(res => {
			this.loadingSubject.next(false);
			if (withBack) {
				this.goBack(_importacion.idimportacion);
			} else {
				const message = `Impotación actualizada exitosamente.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, false);
				this.refreshImportacion(_importacion.idimportacion);
			}
		});
	}

	getComponentTitle() {
		let result = 'Nueva Importación';
		if (!this.importacion || !this.importacion.idimportacion) {
			return result;
		}

		result = `Editar Importación - ${this.importacion.idimportacion}`;
		return result;
	}

	// onAlertClose($event) {
	// 	this.hasFormErrors = false;
	// }
}
