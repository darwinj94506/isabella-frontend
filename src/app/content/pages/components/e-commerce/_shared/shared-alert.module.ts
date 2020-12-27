import { NgModule } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';



// Core => Utils
// import { HttpUtilsService } from './_core/utils/http-utils.service';
// import { TypesUtilsService } from './_core/utils/types-utils.service';
// import { LayoutUtilsService } from './_core/utils/layout-utils.service';
// import { InterceptService } from './_core/utils/intercept.service';
// Shared
import { ActionNotificationComponent } from './action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from './delete-entity-dialog/delete-entity-dialog.component';
import { FetchEntityDialogComponent } from './fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from './update-status-dialog/update-status-dialog.component';
import { AlertComponent } from './alert/alert.component';

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
	imports: [
		MatDialogModule,
		CommonModule,
		// HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
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
	
	],
	providers: [
	
		// {
		// 	provide: MAT_DIALOG_DEFAULT_OPTIONS,
		// 	useValue: {
		// 		hasBackdrop: true,
		// 		panelClass: 'm-mat-dialog-container__wrapper',
		// 		height: 'auto',
		// 		width: '900px'
		// 	}
		// },
		// HttpUtilsService,
		// OrdersService,
		// TypesUtilsService,
		// LayoutUtilsService,

	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
        UpdateStatusDialogComponent
        
    ],
    exports:[
        ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
        AlertComponent
    ],
	declarations: [
		// Shared
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,
	
	]
})
export class SharedAlertModule { }
