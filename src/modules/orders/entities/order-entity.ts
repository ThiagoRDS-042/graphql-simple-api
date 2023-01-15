import { BaseEntity } from "@shared/utils/base-entity";
import { Replace } from "@shared/utils/replace";

export interface IOrderProps {
  price: number;
  amount: number;
  productId: string;
  sellerId: string;
  customerId: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  canceledAt?: Date | null;
}

export class Order extends BaseEntity<IOrderProps> {
  constructor(
    props: Replace<
      IOrderProps,
      {
        createdAt?: Date;
        updatedAt?: Date;
        canceledAt?: Date;
      }
    >,
    id?: string,
  ) {
    super(props, id);
  }

  public get id(): string {
    return this._id;
  }

  public set price(price: number) {
    this.props.price = price;
  }

  public get price(): number {
    return this.props.price;
  }

  public set amount(amount: number) {
    this.props.amount = amount;
  }

  public get amount(): number {
    return this.props.amount;
  }

  public set productId(productId: string) {
    this.props.productId = productId;
  }

  public get productId(): string {
    return this.props.productId;
  }

  public set sellerId(sellerId: string) {
    this.props.sellerId = sellerId;
  }

  public get sellerId(): string {
    return this.props.sellerId;
  }

  public set customerId(customerId: string) {
    this.props.customerId = customerId;
  }

  public get customerId(): string {
    return this.props.customerId;
  }

  public get createdAt(): Date | null | undefined {
    return this.props.createdAt;
  }

  public get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  public cancel() {
    this.props.canceledAt = new Date();
  }

  public get canceledAt(): Date | null | undefined {
    return this.props.canceledAt;
  }

  public static newOrder(props: IOrderProps, id?: string): Order {
    const instanceOrder = new Order(props, id);

    return instanceOrder;
  }
}
