import { AppError } from "@shared/errors/app-error";

export class Document {
  private readonly document: string;

  constructor(document: string) {
    const isCPF = this.isDocumentCPF(document);

    if (isCPF) {
      const isDocumentCPFValid = this.validateDocumentCPF(document);

      if (!isDocumentCPFValid) {
        throw new AppError("Invalid document cpf", "INVALID_DOCUMENT_CPF", 400);
      }
    } else {
      const isDocumentCNPJValid = this.validateDocumentCNPJ(document);

      if (!isDocumentCNPJValid) {
        throw new AppError(
          "Invalid document cnpj",
          "INVALID_DOCUMENT_CNPJ",
          400,
        );
      }
    }

    this.document = document;
  }

  private isDocumentCPF(document: string): boolean {
    return document.length === 14;
  }

  private validateDocumentCPF(document: string): boolean {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(document);
  }

  private validateDocumentCNPJ(document: string): boolean {
    return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(document);
  }

  public get value(): string {
    return this.document;
  }

  public static newDocument(document: string): Document {
    const instanceDocument = new Document(document);

    return instanceDocument;
  }
}
