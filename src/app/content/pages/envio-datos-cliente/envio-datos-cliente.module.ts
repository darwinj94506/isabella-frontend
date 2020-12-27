import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosClienteComponent } from './datos-cliente/datos-cliente.component'
import {UsuarioService} from '../components/e-commerce/_core/services/usuario.service';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PartialsModule } from '../../partials/partials.module';
import { HttpUtilsService } from '../components/e-commerce/_core/utils/http-utils.service';
import {LayoutModule} from '../../layout/layout.module';
import { LayoutUtilsService} from '../components/e-commerce/_core/utils/layout-utils.service';
import { SharedAlertModule } from '../components/e-commerce/_shared/shared-alert.module';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	// MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
  MatTooltipModule
  
	
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PartialsModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTabsModule,
    MatNativeDateModule,
    MatCardModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    LayoutModule,
    
    // MAT_DIALOG_DEFAULT_OPTIONS,
    MatSnackBarModule,
    MatTooltipModule,
    SharedAlertModule,
    RouterModule.forChild([
			{
				path: '',
				component: DatosClienteComponent
			}
		])
  ],
  declarations: [DatosClienteComponent],
  providers:[UsuarioService,HttpUtilsService,LayoutUtilsService]
})
export class EnvioDatosClienteModule { }
