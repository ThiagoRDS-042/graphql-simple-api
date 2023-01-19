import { BaseEntity } from "@shared/utils/base-entity";
import { Replace } from "@shared/utils/replace";

export type CategoryType =
  | "ELECTRONICS"
  | "BOOKS"
  | "SPORTS"
  | "GAMES"
  | "FASHION";

export interface IProductProps {
  name: string;
  price: number;
  category: CategoryType;
  description?: string | null;
  userId: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export class Product extends BaseEntity<IProductProps> {
  constructor(
    props: Replace<
      IProductProps,
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

  public set userId(userId: string) {
    this.props.userId = userId;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public set price(price: number) {
    this.props.price = price;
  }

  public get price(): number {
    return this.props.price;
  }

  public set category(category: CategoryType) {
    this.props.category = category;
  }

  public get category(): CategoryType {
    return this.props.category;
  }

  public set description(description: string | null | undefined) {
    this.props.description = description;
  }

  public get description(): string | null | undefined {
    return this.props.description;
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

  public active() {
    this.props.deletedAt = null;
  }

  public get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  public static newProduct(props: IProductProps, id?: string): Product {
    const instanceProduct = new Product(props, id);

    return instanceProduct;
  }
}
