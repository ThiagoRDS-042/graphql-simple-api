import { prisma } from "@shared/infra/database/prisma/prisma-client";
import { parseNullableVariable } from "@shared/utils/parse-nullable-variable";

import { IFindManyOptions } from "@modules/users/dtos/find-many-options";
import { User } from "@modules/users/entities/user-entity";
import { IUsersRepository } from "@modules/users/repositories/interfaces/users-repository";

import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

export class PrismaUsersRepository implements IUsersRepository {
  public async create(user: User): Promise<User> {
    const raw = PrismaUserMapper.toPrisma(user);

    const userCreated = await prisma.user.create({
      data: raw,
    });

    return PrismaUserMapper.toDomain(userCreated);
  }

  public async save(user: User): Promise<User> {
    const raw = PrismaUserMapper.toPrisma(user);

    const userUpdated = await prisma.user.update({
      where: { id: raw.id },
      data: raw,
    });

    return PrismaUserMapper.toDomain(userUpdated);
  }

  public async findMany(options: IFindManyOptions): Promise<User[]> {
    const emailContains = parseNullableVariable(options.emailContains);
    const nameContains = parseNullableVariable(options.nameContains);
    const roleEquals = parseNullableVariable(options.roleEquals);

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

    return users.map(PrismaUserMapper.toDomain);
  }

  public async findById(userId: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        AND: [{ id: userId, deletedAt: { equals: null } }],
      },
    });

    if (user === null) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        AND: [{ email, deletedAt: { equals: null } }],
      },
    });

    if (user === null) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  public async findByDocument(document: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        AND: [{ document, deletedAt: { equals: null } }],
      },
    });

    if (user === null) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }
}
