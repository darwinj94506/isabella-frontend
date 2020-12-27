import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarEgresoComponent } from './listar-egreso/listar-egreso.component';
import { CrudEgresoComponent } from './crud-egreso/crud-egreso.component';
import{EgresoRoutingModule} from './egreso-routing.module';
import{ComponentesAngularMaterialModule} from './componentes-angular-material.module'; 
import{EgresoService} from './egreso.service';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import {HttpModule} from '@angular/http';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
// import { FlexLayoutModule } from '@angular/flex-layout';

registerLocaleData(localeEs)
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'
// import { ModalCrudIngresoComponent } from './modal-crud-ingreso/modal-crud-ingreso.component';
import { DetalleComponent } from './detalle/detalle.component';
import { ModalVerDetalleComponent } from './modal-ver-detalle/modal-ver-detalle.component';
import { ModalAlertaComponent } from './modal-alerta/modal-alerta.component';
import { HttpUtilsService } from '../components/e-commerce/_core/utils/http-utils.service';
import { ProductoService } from '../components/e-commerce/_core/services/producto.service';
import { UsuarioService } from '../components/e-commerce/_core/services/usuario.service';
import { MercadoLibreService } from '../components/e-commerce/_core/services/mercado-libre.service';

import { PortletModule } from '../../partials/content/general/portlet/portlet.module';
//modales
import { SharedAlertModule } from '../components/e-commerce/_shared/shared-alert.module';
import { LayoutUtilsService } from '../components/e-commerce/_core/utils/layout-utils.service';

// import { AlertComponent } from '../components/apps/e-commerce/_shared/alert/alert.component';
import {PrintService} from './print.service';
import{ModalInstruccionesComponent} from './modal-instrucciones/modal-instrucciones.component';

@NgModule({
  imports: [
    CommonModule,
    EgresoRoutingModule,
    ComponentesAngularMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    PortletModule,
    CustomFormsModule,
    SharedAlertModule
    // FlexLayoutModule
  ], entryComponents: [
    ModalVerDetalleComponent,ModalAlertaComponent,ModalInstruccionesComponent
  ],
  providers:[EgresoService,
    HttpUtilsService,
    ProductoService,
    UsuarioService,
    MercadoLibreService,
    LayoutUtilsService,
    PrintService,{
    provide:LOCALE_ID, useValue: 'es'
  }],
  declarations: [ListarEgresoComponent, CrudEgresoComponent,
     DetalleComponent,ModalInstruccionesComponent,
     ModalVerDetalleComponent, ModalAlertaComponent]
})
export class EgresoModule { }
