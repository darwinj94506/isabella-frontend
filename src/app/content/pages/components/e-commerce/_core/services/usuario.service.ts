
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/http-utils.service';
import { UsuarioModel } from '../models/usuario.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import{URL_GLOBAL}  from '../global';

@Injectable()
export class UsuarioService {
lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { 
			console.log("servicio usuario");
		}

	
	

	// getImportacionById(importacionId: number): Observable<UsuarioModel> {
	// 	return this.http.get<UsuarioModel>(API_IMPORTACIONES_URL + `/${importacionId}`);
	// }
	getImportacionById(importacionId: number): Observable<UsuarioModel> {
		return this.http.get<UsuarioModel>(URL_GLOBAL + `findImportacionById/${importacionId}`);
	}

	
	crudUsuario(usuario: UsuarioModel,opcion:number): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		console.log(usuario);
		let user=usuario;
		if(user.rol===3){
			user.clave=null;
		}
		return this.http.post<any>(URL_GLOBAL+'crudUsuario', {...user,opcion:opcion}, { headers: httpHeaders});
	}

	crudDatoscliente(usuario: UsuarioModel): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		console.log(usuario);
		return this.http.post<any>(URL_GLOBAL+'datosPersonalesCliente', {...usuario}, { headers: httpHeaders});
	}

	findUsuarios(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		return this.http.post<any>(URL_GLOBAL+ 'findUsuarios',queryParams,{ headers: httpHeaders })
	}

	findUsuarioByCedula(cedula){
		console.log(cedula);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(URL_GLOBAL+ 'findUsuarioByCedula',{cedula},{ headers: httpHeaders })
	}	


}
