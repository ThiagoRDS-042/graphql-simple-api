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
    const {
      category: categoryEquals,
      name: nameContains,
      price: priceGte,
      price: priceLte,
      userId: userIdEquals,
    } = await inMemoryProductsRepository.create(makeProduct());

    const { products } = await listProducts.execute({
      categoryEquals,
      nameContains,
      priceGte,
      priceLte,
      userIdEquals,
    });

    expect(products).toHaveLength(1);
  });
});
