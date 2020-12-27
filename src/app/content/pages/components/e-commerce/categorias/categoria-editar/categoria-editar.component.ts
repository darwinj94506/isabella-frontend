import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypesUtilsService } from '../../_core/utils/types-utils.service';
import { CategoriaService } from '../../_core/services/index';
import { CategoriaModel } from '../../_core/models/categoria.model';

@Component({
  selector: 'm-categoria-editar',
  templateUrl: './categoria-editar.component.html'
})
export class CategoriaEditarComponent implements OnInit {

  categoria: CategoriaModel;
	categoriaForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  
	constructor(public dialogRef: MatDialogRef<CategoriaEditarComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private categoriaService: CategoriaService,
		private typesUtilsService: TypesUtilsService) { }

	/** LOAD DATA */
	ngOnInit() {
		this.categoria = this.data.categoria;
		console.log(this.categoria);
		this.createForm();

		/* Server loading imitation. Remove this on real code */
		this.viewLoading = true;
		setTimeout(() => {
			this.viewLoading = false;
		}, 1000);
	}

	createForm() {
	
		this.categoriaForm = this.fb.group({
			nombre: [this.categoria.nombre, Validators.required],

		});
	}

	/** UI */
	getTitle(): string {
		if (this.categoria.idtipo > 0) {
			return `Editar categoria '${this.categoria.nombre}'`;
		}

		return 'Nueva categoria';
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.categoriaForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */
	prepareCustomer(): CategoriaModel {
		const controls = this.categoriaForm.controls;
		const _categoria = new CategoriaModel();
    _categoria.idtipo = this.categoria.idtipo;
    _categoria.nombre = controls['nombre'].value;
		console.log('_categoria', _categoria);
		return _categoria;
	}

	onSubmit() {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.categoriaForm.controls;
		/** check form */
		if (this.categoriaForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedCategoria = this.prepareCustomer();
		if (editedCategoria.idtipo > 0) {
			this.updateCustomer(editedCategoria);
		} else {
			this.createCustomer(editedCategoria);
		}
	}

	updateCustomer(categoria: CategoriaModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.categoriaService.crudCategoria(categoria,2).subscribe(res => {
			/* Server loading imitation. Remove this on real code */
			this.viewLoading = false;
			this.viewLoading = false;
			this.dialogRef.close(
				categoria
				// isEdit: truetrue
			);
		},error=>{
			alert("Ha ocurrido un error en la solicitud:"+error);
			console.log(error);
			this.viewLoading = false;
		}
		);
	}

	createCustomer(categoria: CategoriaModel) { 
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.categoriaService.crudCategoria(categoria,1).subscribe(res=> {
			console.log(res);

			if(res._info_id){
				categoria.idtipo=res._idtipo
				this.dialogRef.close(
					categoria
					// isEdit: false
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
}
