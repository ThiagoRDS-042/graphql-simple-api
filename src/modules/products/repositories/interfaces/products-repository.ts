import { IFindManyOptions } from "../../dtos/find-many-options";
import { Product } from "../../entities/product-entity";

export interface IProductsRepository {
  create(product: Product): Promise<Product>;
  save(product: Product): Promise<Product>;
  findById(productId: string, deleted?: boolean): Promise<Product | null>;
  findMany(options: IFindManyOptions): Promise<Product[]>;
}
