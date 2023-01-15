import { hash } from "bcryptjs";

import { AppError } from "@shared/errors/app-error";

import { JwtConfig } from "@config/jwt-config";
import { Password } from "@modules/users/entities/password";
import { makeUser } from "@modules/users/repositories/factories/users-factory";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { Auth } from "./auth";

describe("Auth", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let auth: Auth;

  const jwtConfig = JwtConfig.newJwtConfig();
  jwtConfig.secretKey = "JWT_SECRET_KEY";

  beforeEach(done => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    auth = new Auth(inMemoryUsersRepository);

    done();
  });

  it("should be able to authenticate a user", async () => {
    const password = "Strong-password1";

    const passwordEncrypted = Password.newPassword(
      await hash(password, 10),
      true,
    );

    const { email } = await inMemoryUsersRepository.create(
      makeUser({ password: passwordEncrypted }),
    );

    const { accessToken } = await auth.execute({
      email,
      password,
    });

    expect(accessToken).toBeTruthy();
  });

  it("should not be able to authenticate a non existing user", async () => {
    await expect(
      auth.execute({
        email: "non-existing-email",
        password: "non-existing-password",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to authenticate a user with a wrong password", async () => {
    const { email } = await inMemoryUsersRepository.create(makeUser());

    await expect(
      auth.execute({
        email,
        password: "wrong-password",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to authenticate a deleted user", async () => {
    const password = "Strong-password1";

    const passwordEncrypted = Password.newPassword(
      await hash(password, 10),
      true,
    );

    const { email } = await inMemoryUsersRepository.create(
      makeUser({ password: passwordEncrypted }),
    );

    inMemoryUsersRepository.users[0].delete();

    await expect(
      auth.execute({
        email,
        password,
      }),
    ).rejects.toThrow(AppError);
  });
});
