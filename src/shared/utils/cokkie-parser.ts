import { AppError } from "@shared/errors/app-error";

type IResponse = Record<string, string>;

export const cookieParser = (cookiesHeader: string): IResponse => {
  try {
    const cookies = cookiesHeader.split(/;\s*/);

    const parsedCookie = {};

    cookies.forEach(cookie => {
      const [key, value] = cookie.split("=");

      parsedCookie[key] = value;
    });

    return parsedCookie;
  } catch (error) {
    throw new AppError("Invalid cookie parser", "INVALID_COOKIE_PARSER", 400);
  }
};
