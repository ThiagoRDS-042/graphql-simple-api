import "reflect-metadata";
import "dotenv";
import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import path from "node:path";
import { buildSchema } from "type-graphql";

import { context } from "@shared/infra/http/context";

const bootstrap = async () => {
  const schema = await buildSchema({
    resolvers: [""],
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
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });

  const PORT = process.env.SERVER_PORT || 4003;

  server.listen(PORT).then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀  Server ready at ${url}`);
  });
};

bootstrap();
