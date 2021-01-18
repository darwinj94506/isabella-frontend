import { NgModule } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpModule} from '@angular/http';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs)
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../../partials/partials.module';
import { ECommerceComponent } from './e-commerce.component';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// Core
// import { FakeApiService } from './_core/_server/fake-api.service';
// Core => Services
import { OrdersService } from './_core/services/orders.service';

import { MercadoLibreService } from './_core/services/mercado-libre.service';

// Core => Utils
import { HttpUtilsService } from './_core/utils/http-utils.service';
import { TypesUtilsService } from './_core/utils/types-utils.service';
import { LayoutUtilsService } from './_core/utils/layout-utils.service';
import { InterceptService } from './_core/utils/intercept.service';
// Shared
// import { ActionNotificationComponent } from './_shared/action-natification/action-notification.component';
// import { DeleteEntityDialogComponent } from './_shared/delete-entity-dialog/delete-entity-dialog.component';
// import { FetchEntityDialogComponent } from './_shared/fetch-entity-dialog/fetch-entity-dialog.component';
// import { UpdateStatusDialogComponent } from './_shared/update-status-dialog/update-status-dialog.component';
// import { AlertComponent } from './_shared/alert/alert.component';
import { SharedAlertModule } from './_shared/shared-alert.module';

// Productos
import { ProductoListarComponent } from './productos/producto-listar/producto-listar.component';
import { ProductoEditarDialogComponent } from './productos/producto-editar/producto-editar.dialog.component';
// Importaciones -producst - especifications
import { ImportacionListarComponent } from './importaciones/importacion-listar/importacion-listar.component';
import { ImportacionEditarComponent } from './importaciones/importacion-editar/importacion-editar.component';
import { ImportacionProductoListarComponent } from './importaciones/_subs/importacion-producto/importacion-producto-listar/importacion-producto-listar.component';
import { ImportacionProductoEditarDialogComponent } from './importaciones/_subs/importacion-producto/importacion-producto-editar/importacion-producto-editar-dialog.component';
// Orders
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { OrderEditComponent } from './orders/order-edit/order-edit.component';
//para imagenes
import { ImageUploadModule } from "angular2-image-upload";
// Material
import{RolAdminGuard} from './rolAdmin.guard';
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
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
	
} from '@angular/material';
import { environment } from '../../../../../environments/environment';
import { ImportacionService } from './_core/services/importacion.service';
import { ImportacionProductoService } from './_core/services/importacion-producto.service';
import { ProductoService } from './_core/services/producto.service';
import { UsuarioService } from './_core/services/usuario.service';

import { UsuariosListarComponent } from './usuarios/usuarios-listar/usuarios-listar.component';
import { UsuariosEditarComponent } from './usuarios/usuarios-editar/usuarios-editar.component';
import { CategoriaListarComponent } from './categorias/categoria-listar/categoria-listar.component';
import { CategoriaEditarComponent } from './categorias/categoria-editar/categoria-editar.component';
import { CategoriaService } from './_core/services';
// import { ModalProductsComponent } from './_shared/modal-products/modal-products.component';

const routes: Routes = [
	{
		path: '',
		component: ECommerceComponent,
		children: [
			{
				path: '',
				redirectTo: 'customers',
				pathMatch: 'full'
			},
			{
				path: 'customers',
				component: ProductoListarComponent
			},
			{
				path: 'orders',
				component: OrdersListComponent
			},
			{
				path: 'products',
				component: ImportacionListarComponent,
			},
			{
				path: 'products/add',
				component: ImportacionEditarComponent
			},
			{
				path: 'products/edit',
				component: ImportacionEditarComponent
			},
			{
				path: 'usuarios',
				component: UsuariosListarComponent,
				canActivate:[RolAdminGuard]
			},
			{
				path: 'usuarios/add',
				component: UsuariosEditarComponent
			},
			{
				path: 'usuarios/edit',
				component: UsuariosEditarComponent
			},
			{
				path: 'products/edit/:id',
				component: ImportacionEditarComponent
			},
			{
				path: 'categorias',
				component: CategoriaListarComponent
			},
			{
				path: 'categorias/add',
				component: CategoriaEditarComponent
			},
			{
				path: 'categorias/edit',
				component: CategoriaEditarComponent
			},
			{
				path: 'categorias/edit/:id',
				component: CategoriaEditarComponent
			},
		]
	}
];

@NgModule({
	imports: [
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
        MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
		HttpModule,
		ImageUploadModule.forRoot(),
		SharedAlertModule
		// environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService) : []
	],
	providers: [
		// InterceptService,
      	// {
        // 	provide: HTTP_INTERCEPTORS,
       	//  	useClass: InterceptService,
        // 	multi: true
      	// },
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'm-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		OrdersService,
		TypesUtilsService,
		LayoutUtilsService,
		ImportacionService,
		ImportacionProductoService,
		ProductoService,
		MercadoLibreService,
		UsuarioService,
		CategoriaService,
		RolAdminGuard
	],
	entryComponents: [
		// ActionNotificationComponent,
		ProductoEditarDialogComponent,
		// DeleteEntityDialogComponent,
		// FetchEntityDialogComponent,
		// UpdateStatusDialogComponent,
		ImportacionProductoEditarDialogComponent,
		UsuariosEditarComponent,
		CategoriaEditarComponent
	],
	declarations: [
		ECommerceComponent,
		// Shared
		// ActionNotificationComponent,
		// DeleteEntityDialogComponent,
		// FetchEntityDialogComponent,
		// UpdateStatusDialogComponent,
		// AlertComponent,
		// productos
		ProductoListarComponent,
		ProductoEditarDialogComponent,
		// Orders
		OrdersListComponent,
		OrderEditComponent,
		// importaciones
		ImportacionListarComponent,
		ImportacionEditarComponent,
		ImportacionProductoListarComponent,
		ImportacionProductoEditarDialogComponent,
		UsuariosListarComponent,
		UsuariosEditarComponent,
		CategoriaListarComponent,
		CategoriaEditarComponent,
		// ModalProductsComponent	
	]
})
export class ECommerceModule { }
