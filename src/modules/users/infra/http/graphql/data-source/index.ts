import DataLoader from "dataloader";

import { prisma } from "@shared/infra/database/prisma/prisma-client";
import { BaseDataSource } from "@shared/utils/base-data-source";

import { User } from "@modules/users/entities/user-entity";
import { PrismaUserMapper } from "@modules/users/infra/prisma/mappers/prisma-user-mapper";
import { PrismaClient } from "@prisma/client";

export class UserDataSource extends BaseDataSource {
  private prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = prisma;
  }

  async getById(userId: string): Promise<User> {
    return this.userLoader.load(userId);
  }

  private userLoader = new DataLoader(async (userIds: string[]) => {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    return userIds.map(userId =>
      PrismaUserMapper.toDomain(users.find(user => user.id === userId)),
    );
  });
}
