import { AppError } from "@shared/errors/app-error";

import { Document } from "./document";

describe("Document", () => {
  it("should be able to create a new document CPF", () => {
    const documentCPF = Document.newDocument("123.456.789-10");

    expect(documentCPF).toBeTruthy();
  });

  it("should be able to create a new document CNPJ", () => {
    const documentCNPJ = Document.newDocument("12.123.123/1234-12");

    expect(documentCNPJ).toBeTruthy();
  });

  it("should not be able to create a invalid document CNPJ", () => {
    expect(() => Document.newDocument("invalid-document")).toThrow(AppError);
  });

  it("should not be able to create a invalid document CPF", () => {
    expect(() => Document.newDocument("12345678910111")).toThrow(AppError);
  });
});
