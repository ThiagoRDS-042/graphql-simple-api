import { IFindManyOptions } from "@modules/products/dtos/find-many-options";
import { Product } from "@modules/products/entities/product-entity";
import { IProductsRepository } from "@modules/products/repositories/interfaces/products-repository";

export class InMemoryProductsRepository implements IProductsRepository {
  public products: Product[] = [];

  public async create(product: Product): Promise<Product> {
    this.products.push(product);

    return product;
  }

  public async save(product: Product): Promise<Product> {
    const productIndex = this.products.findIndex(
      item => item.id === product.id,
    );

    if (productIndex >= 0) {
      this.products[productIndex] = product;
    }

    return product;
  }

  public async findById(
    productId: string,
    deleted = false,
  ): Promise<Product | null> {
    let product = this.products.find(
      item => item.id === productId && !item.deletedAt,
    );

    if (deleted) {
      product = this.products.find(
        item => item.id === productId && item.deletedAt,
      );
    }

    if (!product) {
      return null;
    }

    return product;
  }

  public async findMany(options: IFindManyOptions): Promise<Product[]> {
    const { categoryEquals, nameContains, priceGte, priceLte, userIdEquals } =
      options;

    let products = this.products.filter(item => !item.deletedAt);

    if (categoryEquals && products.length > 0) {
      products = products.filter(item => item.category === categoryEquals);
    }

    if (nameContains && products.length > 0) {
      products = products.filter(item =>
        item.name.toUpperCase().includes(nameContains.toUpperCase()),
      );
    }

    if (userIdEquals && products.length > 0) {
      products = products.filter(item => item.userId === userIdEquals);
    }

    if (priceLte && products.length > 0) {
      products = products.filter(item => item.price <= priceLte);
    }

    if (priceGte && products.length > 0) {
      products = products.filter(item => item.price >= priceGte);
    }

    return products;
  }
}
