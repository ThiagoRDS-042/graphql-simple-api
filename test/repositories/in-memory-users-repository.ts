import { IFindManyOptions } from "@modules/users/dtos/find-many-options";
import { User } from "@modules/users/entities/user-entity";
import { IUsersRepository } from "@modules/users/repositories/users-repository";

export class InMemoryUsersRepository implements IUsersRepository {
  public users: User[] = [];

  public async create(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(item => item.id === user.id);

    if (userIndex >= 0) {
      this.users[userIndex] = user;
    }

    return user;
  }

  public async alreadyExists(email: string): Promise<boolean> {
    const userAlreadyExists = this.users.some(item => item.email === email);

    return userAlreadyExists;
  }

  public async findMany(options: IFindManyOptions): Promise<User[]> {
    const { emailContains, nameContains, roleEquals } = options;

    let { users } = this;

    if (emailContains && users.length > 0) {
      users = users.filter(item => item.email === emailContains);
    }

    if (nameContains && users.length > 0) {
      users = users.filter(item => item.name === nameContains);
    }

    if (roleEquals && users.length > 0) {
      users = users.filter(item => item.role === roleEquals);
    }

    if (users.length > 0) {
      users = users.filter(item => typeof item.deletedAt === "undefined");
    }

    return users;
  }

  public async findById(userId: string): Promise<User | null> {
    const user = this.users.find(
      item => item.id === userId && typeof item.deletedAt === "undefined",
    );

    if (!user) {
      return null;
    }

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(item => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  public async findByDocument(document: string): Promise<User> {
    const user = this.users.find(item => item.document.value === document);

    if (!user) {
      return null;
    }

    return user;
  }
}
