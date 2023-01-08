import { DataSource, DataSourceConfig } from "apollo-datasource";
import { InMemoryLRUCache } from "apollo-server-caching";
import { KeyValueCache } from "apollo-server-core";

export abstract class BaseDataSource<TContext = any> extends DataSource {
  private context: TContext;
  private cache: KeyValueCache<string> | InMemoryLRUCache<string>;

  constructor() {
    super();
  }

  override initialize(config: DataSourceConfig<TContext>): void {
    this.context = config.context;
    this.cache = config.cache || new InMemoryLRUCache();
  }
}
