import { RoleType } from "../entities/user-entity";

export interface IFindManyOptions {
  nameContains?: string;
  emailContains?: string;
  roleEquals?: RoleType;
}
