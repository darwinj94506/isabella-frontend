import{Injectable} from '@angular/core';
import{Http,Headers,} from '@angular/http';
import { HttpClient } from '@angular/common/http';
// import 'rxjs/add/operator/map';
import {map} from 'rxjs/operators'; 
// import{URL_GLOBAL} from '../components/e-commerce/_core/global';
import { environment } from '../../../../environments/environment';
import { Observable, from } from 'rxjs';
import { concatMap, delay, mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from '../components/e-commerce/_core/utils/http-utils.service';

const URL_API = environment.URL_GLOBAL;

@Injectable()
export class EgresoService{
  public url:string;
  public identity;
  public token;

  constructor(private _http:Http,private http: HttpClient,private httpUtils: HttpUtilsService){
    }
    getDetalleEgreso(idegreso){
      return this._http.get(URL_API+'getDetalleEgreso/'+idegreso).pipe(map(res=>res.json()));      
    }
    
    getStock(idmaterial){
      return this._http.get(URL_API+'getStock/'+idmaterial).pipe(map(res=>res.json()));
    }
    getDetalles(idegreso){
      return this._http.get(URL_API+'getDetalles/'+idegreso).pipe(map(res=>res.json()));
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
    getPaginarIngresos(parametros){
      let params=JSON.stringify(parametros);
      let headers=new Headers({'Content-Type':'application/json'});
      return this._http.post( URL_API +'getIngresos',params, {headers:headers})
      .pipe(map( res => res.json()));          
    }
    getPaginarEgresos(parametros){
      let params=JSON.stringify(parametros);
      let headers=new Headers({'Content-Type':'application/json'});
      return this._http.post( URL_API +'getEgresosPaginacion',params, {headers:headers})
      .pipe(map( res => res.json()));          
    }

    validarDetalle(cuerpo){
      let params=JSON.stringify(cuerpo);
      let headers=new Headers({'Content-Type':'application/json'});
      return this._http.post( URL_API +'validarDetalle',params, {headers:headers})
      .pipe(map( res => res.json()));          
    }

    crudEgreso(egreso) {
      console.log(egreso);
      let params=JSON.stringify(egreso);
      let headers=new Headers({'Content-Type':'application/json','Authorization':this.getToken()});
      return this._http.post(URL_API + 'crudEgreso',params, {headers:headers})
                        .pipe(map( res => res.json()));               
    }

    crudDetalle2(detalle:any[]) {
      // console.log(detalle);
      // let params=JSON.stringify(detalle);
      let headers=new Headers({'Content-Type':'application/json','Authorization':this.getToken()});
      // return this._http.post(this.url+'crudDetalle',params, {headers:headers})
      //                   .pipe(map( res => res.json()));               
      const httpHeaders = this.httpUtils.getHTTPHeaders();
      console.log(detalle);
      //
      return from(detalle).pipe(concatMap(det=>this.http.post<any>(URL_API +'crudDetalle',{...det},{ headers: httpHeaders})))
    }
  
  
    getTotalEgreso() {
    // router.post('/api/getTotalTipos', db.getTotalTipos); 
      let headers=new Headers({'Content-Type':'application/json'});
      return this._http.post(URL_API + 'getTotalEgresos', {headers:headers})
                        .pipe(map( res => res.json()));
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



