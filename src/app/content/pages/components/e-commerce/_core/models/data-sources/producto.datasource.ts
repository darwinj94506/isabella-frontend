import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ProductoService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-models/query-results.model';

export class ProductoDataSource extends BaseDataSource {
	constructor(private productoService: ProductoService) {
		super();
	}

	loadCustomers(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.productoService.findProductos(queryParams).pipe(
			tap(res => {
				console.log(res);
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}
}
