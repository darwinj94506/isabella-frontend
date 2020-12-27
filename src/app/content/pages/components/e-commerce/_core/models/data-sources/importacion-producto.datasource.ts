import { from } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { ImportacionProductoService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { ListStateModel } from '../../utils/list-state.model';

export class ImportacionProductoDataSource extends BaseDataSource {
	constructor(private importacionProductoService: ImportacionProductoService) {
		super();
	}

	loadProductos(queryParams: QueryParamsModel, idimportacion: number) {
		this.loadingSubject.next(true);
		this.importacionProductoService
			.findProductosByIdImportacion(queryParams, idimportacion)
			.pipe(
				catchError(() => from([])),
				finalize(() => this.loadingSubject.next(false))
			)
			.subscribe(res => {
				console.log(res.items);
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			});
	}
}
