import { AppError } from "@shared/errors/app-error";

import { makeUser } from "@modules/users/repositories/factories/users-factory";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { InMemoryProductsRepository } from "../repositories/in-memory/in-memory-products-repository";
import { CreateProduct } from "./create-product";

describe("Create product", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createProduct: CreateProduct;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createProduct = new CreateProduct(
      inMemoryProductsRepository,
      inMemoryUsersRepository,
    );
    done();
  });
  it("should be able to create a new product", async () => {
    const { id: userId } = await inMemoryUsersRepository.create(makeUser());

    const { product } = await createProduct.execute({
      category: "BOOKS",
      name: "EBook",
      price: 12.25,
      userId,
      description: "This is the description",
    });

    expect(inMemoryProductsRepository.products).toHaveLength(1);
    expect(inMemoryProductsRepository.products).toEqual([product]);
  });

  it("should be able to create a new product with a non existing user", async () => {
    await expect(
      createProduct.execute({
        category: "BOOKS",
        name: "EBook",
        price: 12.25,
        userId: "non-existing-user",
        description: "This is the description",
      }),
    ).rejects.toThrow(AppError);
  });
});
