import z from "zod";

export const zodDateTransform = z.string().pipe(z.coerce.date());
export const zodIntTransform = z.string().pipe(z.coerce.number());
export const zodBooleanTransform = z.string().pipe(z.coerce.boolean());
