import { ApolloError, UserInputError } from "apollo-server";
import { GraphQLError } from "graphql";
import { ArgumentValidationError } from "type-graphql";

import { AppError } from "./app-error";

export const formatError = (error: GraphQLError): ApolloError => {
  if (error.originalError instanceof AppError) {
    const { code, message, statusCode } = error.originalError.getResponse();

    return new ApolloError(message, code, { statusCode });
  } else if (error.originalError instanceof ArgumentValidationError) {
    const err = error.originalError;

    return new ApolloError(err.message, "ARGUMENT_VALIDATION_ERROR", {
      statusCode: 400,
      ...err.validationErrors,
    });
  } else if (error instanceof UserInputError) {
    return new ApolloError(error.message, error.extensions.code, {
      statusCode: 400,
    });
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
