import { IFindManyOptions } from "../dtos/find-many-options";
import { User } from "../entities/user-entity";

export interface IUsersRepository {
  create(user: User): Promise<User>;
  save(user: User): Promise<User>;
  findMany(options: IFindManyOptions): Promise<User[]>;
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByDocument(document: string): Promise<User | null>;
}
