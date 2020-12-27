import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { CategoriaService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-models/query-results.model';

export class CategoriaDataSource extends BaseDataSource {
	constructor(private categoriaService: CategoriaService) {
		super();
	}

	loadCategorias(queryParams: QueryParamsModel) {
		this.categoriaService.lastFilter$.next(queryParams);
        this.loadingSubject.next(true);

		this.categoriaService.findCategorias(queryParams)
			.pipe(
				tap(res => {
					this.entitySubject.next(res.items);
					this.paginatorTotalSubject.next(res.totalCount);
				}),
				catchError(err => of(new QueryResultsModel([], err))),
				finalize(() => this.loadingSubject.next(false))
			).subscribe();
	}
}
