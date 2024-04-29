import { admins } from "../../schema/schema";

export type AdminEntitySelect = typeof admins.$inferSelect;
export type AdminEntityInsert = typeof admins.$inferInsert;
