import { categories } from "../schema/schema";

export type CategoryEntitySelect = typeof categories.$inferSelect;
export type CategoryEntityInsert = typeof categories.$inferInsert;
