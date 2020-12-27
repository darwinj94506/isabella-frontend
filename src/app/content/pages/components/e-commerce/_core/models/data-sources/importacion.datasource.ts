import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ImportacionService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-models/query-results.model';

export class ImportacionDataSource extends BaseDataSource {
	constructor(private ImportacionService: ImportacionService) {
		super();
	}

	loadProducts(queryParams: QueryParamsModel) {
		this.ImportacionService.lastFilter$.next(queryParams);
        this.loadingSubject.next(true);

		this.ImportacionService.findImportaciones(queryParams)
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
