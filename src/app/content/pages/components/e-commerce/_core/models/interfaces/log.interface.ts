export interface ILog {
	_userId: number; // user who did changes
	_createddate: string; // date when entity were created => format: 'mm/dd/yyyy'
	_updateddate: string; // date when changed were applied => format: 'mm/dd/yyyy'
}
