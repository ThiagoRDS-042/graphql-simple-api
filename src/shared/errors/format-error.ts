import { ApolloError } from "apollo-server";
import { GraphQLError } from "graphql";

import { AppError } from "./app-error";

export const formatError = (error: GraphQLError): ApolloError => {
  if (error.originalError instanceof AppError) {
    const { code, message, statusCode } = error.originalError.getResponse();

    return new ApolloError(message, code, { statusCode });
  }

  // eslint-disable-next-line no-console
  console.error({
    message: error.message,
    code: error.extensions.code,
    path: error.path,
    locations: error.locations,
    exception: error.extensions.exception,
  });

  return new ApolloError("Internal server error", "INTERNAL_SERVER_ERROR", {
    statusCode: 500,
  });
};
