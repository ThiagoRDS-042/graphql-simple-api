import { prisma } from "@shared/infra/database/prisma/prisma-client";

import { IFindManyOptions } from "@modules/users/dtos/find-many-options";
import { User } from "@modules/users/entities/user-entity";
import { IUsersRepository } from "@modules/users/repositories/users-repository";

import { PrismaCUserMapper } from "../mappers/prisma-user-mapper";

export class PrismaUsersRepository implements IUsersRepository {
  public async create(user: User): Promise<User> {
    const raw = PrismaCUserMapper.toPrisma(user);

    const userCreated = await prisma.user.create({
      data: raw,
    });

    return PrismaCUserMapper.toDomain(userCreated);
  }

  public async save(user: User): Promise<User> {
    const raw = PrismaCUserMapper.toPrisma(user);

    const userUpdated = await prisma.user.update({
      where: { id: raw.id },
      data: raw,
    });

    return PrismaCUserMapper.toDomain(userUpdated);
  }

  public async findMany(options: IFindManyOptions): Promise<User[]> {
    const { emailContains, nameContains, roleEquals } = options;

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            email: {
              contains: emailContains,
            },
            name: {
              contains: nameContains,
            },
            deletedAt: { equals: null },
            role: { equals: roleEquals },
          },
          { role: { not: { equals: "ADMIN" } } },
        ],
      },
    });

    return users.map(PrismaCUserMapper.toDomain);
  }

  public async findById(userId: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        AND: [{ id: userId, deletedAt: { equals: null } }],
      },
    });

    if (!user) {
      return null;
    }

    return PrismaCUserMapper.toDomain(user);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        AND: [{ email, deletedAt: { equals: null } }],
      },
    });

    if (!user) {
      return null;
    }

    return PrismaCUserMapper.toDomain(user);
  }

  public async findByDocument(document: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        AND: [{ document, deletedAt: { equals: null } }],
      },
    });

    if (!user) {
      return null;
    }

    return PrismaCUserMapper.toDomain(user);
  }
}
