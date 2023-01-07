import { BaseEntity } from "@shared/utils/base-entity";
import { Replace } from "@shared/utils/replace";

import { Document } from "./document";
import { Password } from "./password";
import { Phone } from "./phone";

export type RoleType = "ADMIN" | "CUSTOMER" | "SELLER";

export interface IUserProps {
  name: string;
  email: string;
  phone: Phone;
  document: Document;
  password: Password;
  role: RoleType;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export class User extends BaseEntity<IUserProps> {
  constructor(
    props: Replace<
      IUserProps,
      {
        createdAt?: Date;
        updatedAt?: Date;
        deletedAt?: Date;
      }
    >,
    id?: string,
  ) {
    super(props, id);
  }

  public get id(): string {
    return this._id;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get name(): string {
    return this.props.name;
  }

  public set email(email: string) {
    this.props.email = email;
  }

  public get email(): string {
    return this.props.email;
  }

  public set phone(phone: Phone) {
    this.props.phone = phone;
  }

  public get phone(): Phone {
    return this.props.phone;
  }

  public set role(role: RoleType) {
    this.props.role = role;
  }

  public get role(): RoleType {
    return this.props.role;
  }

  public set document(document: Document) {
    this.props.document = document;
  }

  public get document(): Document {
    return this.props.document;
  }

  public set password(password: Password) {
    this.props.password = password;
  }

  public get password(): Password {
    return this.props.password;
  }

  public get createdAt(): Date | null | undefined {
    return this.props.createdAt;
  }

  public get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  public delete() {
    this.props.deletedAt = new Date();
  }

  public get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  public static newUser(props: IUserProps, id?: string): User {
    const instanceUser = new User(props, id);

    return instanceUser;
  }
}
