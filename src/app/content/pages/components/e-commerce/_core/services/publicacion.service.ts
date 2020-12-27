import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/http-utils.service';
import { PublicacionModel } from '../models/publicacion.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import{URL_GLOBAL}  from '../global';
@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  constructor() {}
  
}
