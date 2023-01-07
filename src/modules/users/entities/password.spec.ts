import { AppError } from "@shared/errors/app-error";

import { Password } from "./password";

describe("Password", () => {
  it("should be able to create a new strong password", () => {
    const password = Password.newPassword("Strong-password1");

    expect(password).toBeTruthy();
  });

  it("should not be able to create a new weak password", () => {
    expect(() => Password.newPassword("Weak-password")).toThrow(AppError);
  });
});
