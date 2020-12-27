import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { TipoMaterialComponent } from './tipo-material/tipo-material.component';
import{ListarEgresoComponent} from './listar-egreso/listar-egreso.component';
import{CrudEgresoComponent} from './crud-egreso/crud-egreso.component';

const routes: Routes = [
  
    {
        path: '',
        component: ListarEgresoComponent
    },
    {
        path: 'crud-egreso',
        component: CrudEgresoComponent
    }
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EgresoRoutingModule {}
