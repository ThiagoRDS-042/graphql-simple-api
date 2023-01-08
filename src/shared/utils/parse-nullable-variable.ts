export const parseNullableVariable = <T>(variable: T): T | undefined => {
  if (variable === null) {
    return undefined;
  } else {
    return variable;
  }
};
