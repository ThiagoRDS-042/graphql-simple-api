import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "../repositories/factories/products-factory";
import { InMemoryProductsRepository } from "../repositories/in-memory/in-memory-products-repository";
import { ShowProduct } from "./show-product";

describe("Show product", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let showProduct: ShowProduct;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    showProduct = new ShowProduct(inMemoryProductsRepository);
    done();
  });
  it("should be able to show a product", async () => {
    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    const { product } = await showProduct.execute({
      productId,
    });

    expect(inMemoryProductsRepository.products).toEqual([product]);
  });

  it("should not be able to show a non existing product", async () => {
    await expect(
      showProduct.execute({
        productId: "non-existing-product",
      }),
    ).rejects.toThrow(AppError);
  });
});
