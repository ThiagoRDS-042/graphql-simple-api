import { CategoryType } from "../entities/product-entity";

export interface IFindManyOptions {
  nameContains?: string;
  categoryEquals?: CategoryType;
  userIdEquals?: string;
  priceLte?: number;
  priceGte?: number;
}
