import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { UsuarioService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-models/query-results.model';

export class UsuarioDataSource extends BaseDataSource {
	constructor(private usuarioService: UsuarioService) {
		super();
	}

	loadUsuarios(queryParams: QueryParamsModel) {
		this.usuarioService.lastFilter$.next(queryParams);
        this.loadingSubject.next(true);

		this.usuarioService.findUsuarios(queryParams)
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
