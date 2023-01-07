import { User } from "@modules/users/entities/user-entity";

export interface IUserViewModelResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export class UserViewModel {
  static toHTTP(user: User): IUserViewModelResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone.value,
      document: user.document.value,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}
