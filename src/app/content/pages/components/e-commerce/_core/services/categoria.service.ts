
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/http-utils.service';
import { CategoriaModel } from '../models/categoria.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import{URL_GLOBAL}  from '../global';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	
	
	crudCategoria(categoria: CategoriaModel,opcion:number): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(URL_GLOBAL+'crudTipo', {...categoria,opcion:opcion}, { headers: httpHeaders});
	}
  findCategorias(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		return this.http.post<any>(URL_GLOBAL+ 'findTipos',queryParams,{ headers: httpHeaders })
	}
	getCategorias(): Observable<CategoriaModel[]> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<CategoriaModel[]>(URL_GLOBAL+ 'getCategorias',{ headers: httpHeaders })
	}



}
