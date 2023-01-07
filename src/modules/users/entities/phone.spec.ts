import { AppError } from "@shared/errors/app-error";

import { Phone } from "./phone";

describe("Phone", () => {
  it("should be able to create a new phone", () => {
    const phone = Phone.newPhone("(12) 1.1234-5678");

    expect(phone).toBeTruthy();
  });

  it("should not be able to create a invalid phone", () => {
    expect(() => Phone.newPhone("invalid-phone")).toThrow(AppError);
  });
});
