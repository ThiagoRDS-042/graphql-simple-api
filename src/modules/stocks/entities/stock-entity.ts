import { BaseEntity } from "@shared/utils/base-entity";
import { Replace } from "@shared/utils/replace";

export interface IStockProps {
  amount: number;
  productId: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export class Stock extends BaseEntity<IStockProps> {
  constructor(
    props: Replace<
      IStockProps,
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

  public set productId(productId: string) {
    this.props.productId = productId;
  }

  public get productId(): string {
    return this.props.productId;
  }

  public set amount(amount: number) {
    this.props.amount = amount;
  }

  public get amount(): number {
    return this.props.amount;
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

  public static newStock(props: IStockProps, id?: string): Stock {
    const instanceStock = new Stock(props, id);

    return instanceStock;
  }
}
