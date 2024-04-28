import { ServerError } from "./error";

export const errorResolver = <T = any>(error: any) => {
  let message = {
    code: 500,
    message: "Internal Error",
    data: undefined as T,
  };

  if (!(error instanceof ServerError)) {
    console.log(error);
  }

  if (error instanceof Error) {
    try {
      //@ts-ignore
      message = error.getMessage();
    } catch (error) {}
  } else {
  }
  return message;
};
