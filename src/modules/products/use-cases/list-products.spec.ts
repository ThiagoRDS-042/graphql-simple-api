import { makeProduct } from "@test/factories/products-factory";
import { InMemoryProductsRepository } from "@test/repositories/in-memory-products-repository";

import { ListProducts } from "./list-products";

describe("List products", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let listProducts: ListProducts;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    listProducts = new ListProducts(inMemoryProductsRepository);
    done();
  });
  it("should be able to list an products", async () => {
    const product = await inMemoryProductsRepository.create(makeProduct());

    const { products } = await listProducts.execute({
      categoryEquals: product.category,
      nameContains: product.name,
      priceGte: product.price,
      priceLte: product.price,
      userIdEquals: product.userId,
    });

    expect(products).toHaveLength(1);
  });
});
