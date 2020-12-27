import { CustomersTable } from './customers.table';
import { CarsTable } from './cars.table';
import { RemarksTable } from './remarks.table';
import { SpecificationsTable } from './specifications.table';
import { CarSpecificationsTable } from './car-specifications.table';
import { OrdersTable } from './orders.table';
import { ImportacionesTable } from './importaciones.table';
import{ProductosTable} from './productos.table';
import{ImportacionProductosTable} from './importacion-producto.table';
// Wrapper class
export class ECommerceDataContext {
	public static customers: any = CustomersTable.customers;

	public static cars: any = CarsTable.cars;

	// e-commerce car remarks
	// one => many relations
	public static remarks = RemarksTable.remarks;

	// e-commerce specifications table
	// library | dataset
	public static specs = SpecificationsTable.specifications;

	// e-commerce car specifications
	// one => many relations
	public static carSpecs = CarSpecificationsTable.carSpecifications;


	public static orders = OrdersTable.orders;

	public static importaciones=ImportacionesTable.importaciones;

	public static productos=ProductosTable.productos;

	public static importacionProductos=ImportacionProductosTable.importacionProductos;
}
