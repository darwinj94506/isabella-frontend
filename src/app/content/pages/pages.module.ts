import { LayoutModule } from '../layout/layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PartialsModule } from '../partials/partials.module';
import { PagesComponent } from './pages.component';
import { ActionComponent } from './header/action/action.component';
// import { MailModule } from './components/apps/mail/mail.module';
// import { ECommerceModule } from './components/apps/e-commerce/e-commerce.module';
import { CoreModule } from '../../core/core.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ErrorPageComponent } from './snippets/error-page/error-page.component';
// import {PrintService} from './egreso/print.service';
import { HttpUtilsService } from './components/e-commerce/_core/utils/http-utils.service';

import{UsuarioService} from './components/e-commerce/_core/services/usuario.service';
import { ProfileComponent } from './header/profile/profile.component';
import { PortletModule } from '../partials/content/general/portlet/portlet.module';

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
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
	
} from '@angular/material';




@NgModule({
	declarations: [
		PagesComponent,
		ActionComponent,
		ProfileComponent,
		ErrorPageComponent
	],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		PagesRoutingModule,
		CoreModule,
		LayoutModule,
		PartialsModule,
		// MailModule,
		// ECommerceModule,
		AngularEditorModule,
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
		MatTooltipModule,
		PortletModule
		
	],
	providers: [HttpUtilsService,UsuarioService]
})
export class PagesModule {}
