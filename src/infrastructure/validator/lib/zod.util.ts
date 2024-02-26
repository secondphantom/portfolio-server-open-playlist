import z from "zod";

export const zodIntTransform = z.string().transform((val, ctx) => {
  const result = parseInt(val);
  if (isNaN(result)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a number",
    });
    return z.NEVER;
  }
  return result;
});
