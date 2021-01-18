import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map,catchError, filter, delay, tap, mergeMap,concatMap } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/http-utils.service';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { ProductoModel } from '../models/producto.model';
import { QueryResultsModel } from '../../../../../../core/models/query-results.model';
import{URL_GLOBAL} from '../global';
import{Translation} from '../models/translation';
import { throwError,from } from 'rxjs';

// import 'rxjs/add/observable/forkJoin';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/forkJoin';

// const URL_GLOBAL = 'api/productos';
const UPCITEMDB_URL='https://api.upcitemdb.com/prod/trial/lookup';
const URL_YANDEX='https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en-es&key=trnsl.1.1.20190223T051510Z.d6f6972c4051f952.d0cde42c8caa6b7f2ec5c2ad49aa6bcb026beb11&text=';

@Injectable()
export class ProductoService {
	
	httpOptions = this.httpUtils.getHTTPHeaders();

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { 
		}
		
	//******************************************** mis htpps**************************************************** */
	// CREATE =>  POST: add a new producto to the server
	crudProducto(producto: ProductoModel,opcion:number): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(URL_GLOBAL+'crudProducto', {...producto,opcion:opcion}, { headers: httpHeaders});
	}

	subidaMasivaProductos(productos: any[]): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(URL_GLOBAL+'subidaMasivaProductos', {data:[...productos]}, { headers: httpHeaders});
	}

	
	findProductos(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(URL_GLOBAL+'findProductos',queryParams,{ headers: httpHeaders})
	}

	findProductoByCodigoFabricante(codigoFabricante){
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<ProductoModel>(URL_GLOBAL+`findProductoByCodigoFabricante/${codigoFabricante}`,{ headers: httpHeaders})
	}
	//esta funcion se utiliza para buscar varios productos en una solo llamada
	findProductosByCodigoFabricante(productos:any[]) {
		console.log(productos);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return from(productos).pipe(concatMap(prod=>this.http.get<any>(URL_GLOBAL+`findProductosByCodigoFabricante/${prod.codigofabricante}`,{headers: httpHeaders})))
	}

	// UPDATE => PUT: update the producto on the server
	updateProducto(producto: ProductoModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(URL_GLOBAL, producto, { headers: httpHeader });
	}
	
	//busca productos en www.upcitemdb.com

	//************************************************* */

	   /**
     * Handle API errors
     * @param errorResponse error response object
     */
    private handleError(errorResponse: HttpErrorResponse): Observable<any> {
        console.error(errorResponse);
        return throwError(errorResponse.error.message || 'Please check your network connection');

	}
	getTranslation(textoTraducir): Observable<Translation> {
        console.log("aqui estoy");
        // const requestUrl = this.createRequest(word, fromLang, toLang);
        const requestUrl="https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en-es&key=trnsl.1.1.20190223T051510Z.d6f6972c4051f952.d0cde42c8caa6b7f2ec5c2ad49aa6bcb026beb11&text=";
        return this.http.get<any>(requestUrl+textoTraducir)
            .pipe(
                map(response => {
                    return new Translation(response.code, response.lang, response.text);
                }),
                catchError(err => this.handleError(err))
            );
	}
	
	getMultipleTranslate(titulo,descripcion,descripcionAlternativa){
		return forkJoin(
				this.getTranslation(titulo),
				this.getTranslation(descripcion),
				this.getTranslation(descripcionAlternativa)
			)
	}

	//para subir images
	// makeFileRequest(idproducto,params:Array<string>,files:Array<File>,name:string){
	// 	console.log(files)
	// 	return new Promise(function(resolve,reject){
	// 	  var formData:any=new FormData();
	// 	  //acronimo de ajax
	// 	  var xhr=new XMLHttpRequest();
	// 	  for(var i=0; i< files.length;i++){
	// 		formData.append(name,files[i],files[i].name);
	// 	  }
	// 	  xhr.onreadystatechange=function(){
	// 		if(xhr.readyState==4){
	// 		  if(xhr.status==200){
	// 			resolve(JSON.parse(xhr.response));
	// 		  }else{
	// 			reject(xhr.response);
	// 		  }
	// 		}
	// 	  }
	// 	  xhr.open('POST',URL_GLOBAL+'upload_images/'+idproducto,true);
	// 	//   xhr.setRequestHeader('Authorization',token);
	// 	  xhr.send(formData);
	// 	});
  
	//   }


}


