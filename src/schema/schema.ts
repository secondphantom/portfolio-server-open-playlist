import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  datetime,
  json,
  mysqlSchema,
  tinyint,
  varchar,
  mysqlTable,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export type UserExtra = {};

export const users = mysqlTable(
  "users",
  {
    id: bigint("id", { unsigned: true, mode: "number" })
      .notNull()
      .primaryKey()
      .autoincrement(),
    uuid: varchar("uuid", { length: 50 }).notNull(),
    role: tinyint("role", { unsigned: true }).notNull().default(1),
    email: varchar("email", { length: 320 }).notNull(),
    hashKey: varchar("hash_key", { length: 200 }).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    profileName: varchar("profile_name", { length: 100 }).notNull(),
    profileImage: varchar("profile_image", { length: 300 }),
    extra: json("extra").notNull().$type<UserExtra>(),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updatedAt")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      idxRole: index("idx_role").on(table.role),
      uqEmail: uniqueIndex("uq_email").on(table.email),
      idxCreatedAt: index("idx_created_at").on(table.createdAt),
    };
  }
);
