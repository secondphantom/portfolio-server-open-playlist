export const errorResolver = (error: any) => {
  let message = {
    code: 500,
    message: "Internal Error",
  };
  if (error instanceof Error) {
    try {
      //@ts-ignore
      message = error.getMessage();
    } catch (error) {}
  }
  return message;
};
