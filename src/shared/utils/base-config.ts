export abstract class BaseConfig<T> {
  protected props: T;

  constructor(props: T) {
    this.props = props;
  }
}
