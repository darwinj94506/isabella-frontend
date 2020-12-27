import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/http-utils.service';
import { ProductoService } from './producto.service';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { ImportacionProductoModel } from '../models/importacion-producto.model';
import{UpcItemModel} from '../models/upc-item.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import * as _ from 'lodash';
import { Body } from '@angular/http/src/body';
import{URL_GLOBAL} from '../global';
const API_IMPORTACION_PRODUCTOS_URL = 'api/importacionProductos';

// Fake REST API (Mock)  http://localhost:3002/api/
// This code emulates server calls
@Injectable()
export class ImportacionProductoService {
	constructor(
		private http: HttpClient,
		private httpUtils: HttpUtilsService,
		private ProductoService: ProductoService
	) {
		
	}


	findProductosByIdImportacion(queryParams: QueryParamsModel,	idimportacion: number){
		return this.http.post<QueryResultsModel>(URL_GLOBAL+`findProductosByImportacion`,{...queryParams,idimportacion:idimportacion})
	}


	//buscar producto de upcitemdb

	bucarProductoUpcItemDb(upc){
		let body={
			"upc":upc
		}
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(URL_GLOBAL+'buscarupc',body,{headers:httpHeaders});  		
	}

	crudImportacionProducto(importacionProducto: ImportacionProductoModel,opcion:number): Observable<any> {
		console.log(importacionProducto);
		return this.http.post<any>(URL_GLOBAL+'crudImportacionProducto', {...importacionProducto,opcion:opcion});
	}


	

}
