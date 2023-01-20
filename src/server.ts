import "reflect-metadata";
import "dotenv";
import "@shared/providers";
import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import path from "node:path";
import { buildSchema } from "type-graphql";

import { formatError } from "@shared/errors/format-error";
import { context } from "@shared/infra/http/graphql/context";
import { dataSources } from "@shared/infra/http/graphql/data-source";

import { AuthResolver } from "@modules/auth/infra/http/graphql/resolvers/auth-resolver";
import { OrderResolver } from "@modules/orders/infra/http/graphql/resolvers/order-resolver";
import { ProductResolver } from "@modules/products/infra/http/graphql/resolvers/product-resolver";
import { StockResolver } from "@modules/stocks/infra/http/graphql/resolvers/stock-resolver";
import { UserResolver } from "@modules/users/infra/http/graphql/resolvers/user-resolver";

const bootstrap = async () => {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      AuthResolver,
      ProductResolver,
      StockResolver,
      OrderResolver,
    ],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });

  const server = new ApolloServer({
    schema,
    cors: {
      credentials: true,
      origin: ["*"],
    },
    csrfPrevention: true,
    cache: "bounded",
    context,
    formatError,
    dataSources,
    healthCheckPath: "/health-check",
    onHealthCheck: async () => true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        includeCookies: true,
      }),
    ],
  });

  const PORT = process.env.SERVER_PORT || 4003;

  server.listen(PORT).then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀  Server ready at ${url}`);
  });
};

bootstrap();
