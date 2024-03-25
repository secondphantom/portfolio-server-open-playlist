export const errorResolver = (error: any) => {
  let message = {
    code: 500,
    message: "Internal Error",
    data: undefined,
  };
  console.log(error);
  if (error instanceof Error) {
    try {
      //@ts-ignore
      message = error.getMessage();
    } catch (error) {}
  } else {
  }
  return message;
};
