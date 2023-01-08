import {
  Product,
  IProductProps,
} from "@modules/products/entities/product-entity";

type Override = Partial<IProductProps>;

export const makeProduct = (override: Override = {}): Product => {
  return Product.newProduct({
    category: "BOOKS",
    name: "EBook",
    price: 12.25,
    userId: "example-user-id",
    description: "This is the description",
    ...override,
  });
};
