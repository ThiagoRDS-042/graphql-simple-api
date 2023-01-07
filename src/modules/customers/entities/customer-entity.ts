import { BaseEntity } from "@shared/utils/base-entity";
import { Replace } from "@shared/utils/replace";

import { Password } from "./password";

export interface ICustomerProps {
  name: string;
  email: string;
  phone: string;
  password: Password;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export class Customer extends BaseEntity<ICustomerProps> {
  constructor(
    props: Replace<
      ICustomerProps,
      { createdAt?: Date; updatedAt?: Date; deletedAt?: Date }
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

  public set phone(phone: string) {
    this.props.phone = phone;
  }

  public get phone(): string {
    return this.props.phone;
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

  public static newCustomer(props: ICustomerProps, id?: string): Customer {
    const author = new Customer(props, id);

    return author;
  }
}
