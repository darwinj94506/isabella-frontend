import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpUtilsService } from '../utils/http-utils.service';
import{URL_GLOBAL} from '../global';
import { concatMap, delay, mergeMap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';

@Injectable()
export class MercadoLibreService {
	
	httpOptions = this.httpUtils.getHTTPHeaders();

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) {

		}

	publicarItem(producto){
		console.log(producto);
		var publicar={
			item:producto.item,
			idproducto:producto.idproducto
		};

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(URL_GLOBAL+'publicarMec',publicar,{ headers: httpHeaders})
	}
 
	//publica productos en mercado libre
	publicarItem2(producto:any[]){
	
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return from(producto).pipe(concatMap(producto=>this.http.post<any>(URL_GLOBAL+'publicarMec',{item:producto.item,
																									idproducto:producto.idproducto,
																									idimportacionproducto:producto.idimportacionproducto},
																									{ headers: httpHeaders})))
	}
	actualizarStock(producto:any[]){
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return from(producto).pipe(mergeMap(producto=>this.http.post<any>(URL_GLOBAL+'actualizarStockMec',{stock:producto._stock,
																									idproducto:producto.idproducto},
																									{ headers: httpHeaders})))
	}

	// public getSomethingFromAnAPI(ids: number[]): any {
	// 	return this.from(ids).pipe(
	// 	   concatMap(id => <Observable<any>> this.http.get('https://jsonplaceholder.typicode.com/posts/' + id))
	// 	   ); 
	//   }
	// from(ids2){
	// 	let ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	// 	return this.getSomethingFromAnAPI(ids).subscribe(response => {
	// 	 this.data.push({
	// 	  body: response.body, 
	// 	  title: response.title, 
	// 	  id: response.id
	// 	 });
	// 	}, error => {
	// 	 console.error(error);
	// 	});

	// }

	

}


