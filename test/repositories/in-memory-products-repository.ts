import { IFindManyOptions } from "@modules/products/dtos/find-many-options";
import { Product } from "@modules/products/entities/product-entity";
import { IProductsRepository } from "@modules/products/repositories/products-repository";

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

  public async findById(productId: string): Promise<Product | null> {
    const product = this.products.find(
      item => item.id === productId && typeof item.deletedAt === "undefined",
    );

    if (!product) {
      return null;
    }

    return product;
  }

  public async findMany(options: IFindManyOptions): Promise<Product[]> {
    const { categoryEquals, nameContains, priceGte, priceLte, userIdEquals } =
      options;

    let { products } = this;

    if (categoryEquals && products.length > 0) {
      products = products.filter(item => item.category === categoryEquals);
    }

    if (nameContains && products.length > 0) {
      products = products.filter(item => item.name.includes(nameContains));
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

    if (products.length > 0) {
      products = products.filter(item => typeof item.deletedAt === "undefined");
    }

    return products;
  }
}
