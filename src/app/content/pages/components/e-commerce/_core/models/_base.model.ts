import { IEdit } from './interfaces/edit.interface';
import { IFilter } from './interfaces/filter.interface';
import { ILog } from './interfaces/log.interface';

export class BaseModel implements IEdit, IFilter, ILog {
	_estado: number;
	// Edit
	_isEditMode: boolean = false;
	_isNew: boolean = false;
	_isUpdated: boolean = false;
	_isdeleted: boolean = false;
	_prevState: any = null;
	// Filter
	_defaultFieldName: string = '';
	// Log
	_userId: number = 0; // Admin
	_createddate: string;
	_updateddate: string;
}
