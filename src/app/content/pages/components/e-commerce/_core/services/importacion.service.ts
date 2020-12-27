import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{Http,Headers,} from '@angular/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import {map} from 'rxjs/operators'; 

import { mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/http-utils.service';
import { ImportacionModel } from '../models/importacion.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import{URL_GLOBAL}  from '../global';
const API_IMPORTACIONES_URL = 'api/importaciones';
@Injectable()
export class ImportacionService {
	public identity;
  	public token;
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService,private _http:Http) { }

	// CREATE =>  POST: add a new product to the server
	createImportacion(importacion): Observable<ImportacionModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ImportacionModel>(API_IMPORTACIONES_URL, importacion, { headers: httpHeaders });
	}

	// READ
	getAllImportaciones(): Observable<ImportacionModel[]> {
		return this.http.get<ImportacionModel[]>(API_IMPORTACIONES_URL);
	}

	// getImportacionById(importacionId: number): Observable<ImportacionModel> {
	// 	return this.http.get<ImportacionModel>(API_IMPORTACIONES_URL + `/${importacionId}`);
	// }
	getImportacionById(importacionId: number): Observable<ImportacionModel> {
		return this.http.get<ImportacionModel>(URL_GLOBAL + `findImportacionById/${importacionId}`);
	}

	
	crudImportacion(importacion: ImportacionModel,opcion:number): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		// const httpHeaders = this.httpUtils.getHTTPHeaders();
		let headers=new Headers({'Content-Type':'application/json','Authorization':this.getToken()});
		return this._http.post(URL_GLOBAL+'crudImportacion', {...importacion,opcion:opcion}, { headers: headers}).pipe(map( res => res.json()));
	}

	findImportaciones(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		return this.http.post<any>(URL_GLOBAL+ 'findImportaciones',queryParams,{ headers: httpHeaders })
	}

	// UPDATE => PUT: update the product on the server
	updateImportacion(importacion: ImportacionModel): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_IMPORTACIONES_URL, importacion, { headers: httpHeaders });
	}

	

	// DELETE => delete the product from the server
	deleteImportacion(importacionId: number): Observable<ImportacionModel> {
		const url = `${API_IMPORTACIONES_URL}/${importacionId}`;
		return this.http.delete<ImportacionModel>(url);
	}

	deleteImportaciones(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteImportacion(ids[i]));
		}
		return forkJoin(tasks$);
	}
	getIdentity(){
		let identity=JSON.parse(localStorage.getItem('identity'));
		if(identity!="undefined"){
		  this.identity=identity;
		}else{
		  this.identity=null;
		}
		return this.identity;
	  }
	  getToken(){
        let token=localStorage.getItem('token');
        if(token!="undefined"){
          this.token=token;
        }else{
          this.token=null;
        }
        return this.token;
      }

}
