import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  datetime,
  json,
  tinyint,
  varchar,
  mysqlTable,
  index,
  uniqueIndex,
  int,
  primaryKey,
  mediumint,
  smallint,
  float,
} from "drizzle-orm/mysql-core";

export type UserExtra = {};

export const users = mysqlTable(
  "Users",
  {
    id: bigint("id", { unsigned: true, mode: "number" })
      .notNull()
      .primaryKey()
      .autoincrement(),
    uuid: varchar("uuid", { length: 50 }).notNull(),
    roleId: smallint("role_id", { unsigned: true }).notNull().default(1),
    email: varchar("email", { length: 320 }).notNull(),
    hashKey: varchar("hash_key", { length: 200 }).notNull(),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    profileName: varchar("profile_name", { length: 100 }).notNull(),
    profileImage: varchar("profile_image", { length: 300 }),
    extra: json("extra").notNull().$type<UserExtra>(),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      idxRole: index("idx_role").on(table.roleId),
      uqEmail: uniqueIndex("uq_email").on(table.email),
      idxCreatedAt: index("idx_created_at").on(table.createdAt), // DESC
    };
  }
);

export type ChannelExtra = {};

export const channels = mysqlTable("Channels", {
  channelId: varchar("channel_id", { length: 50 }).primaryKey().notNull(),
  name: varchar("name", { length: 60 }).notNull(), //FULL TEXT
  handle: varchar("handle", { length: 50 }).notNull().default(""),
  enrollCount: int("enroll_count", { unsigned: true }).notNull().default(0),
  extra: json("extra").notNull().$type<ChannelExtra>(),
  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime("updated_at")
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

export type CourseChapter = { title: string; time: number };
export type CourseExtra = {};

export const courses = mysqlTable(
  "Courses",
  {
    id: bigint("id", { unsigned: true, mode: "number" })
      .notNull()
      .primaryKey()
      .autoincrement(),
    videoId: varchar("video_id", { length: 50 }).notNull(),
    channelId: varchar("channel_id", { length: 50 }).notNull(),
    categoryId: int("category_id", { unsigned: true }).notNull().default(0),
    language: varchar("language", { length: 10 }).notNull(),
    title: varchar("title", { length: 110 }).notNull(), //FULL TEXT
    description: varchar("description", { length: 5010 }).notNull(),
    summary: varchar("summary", { length: 10000 }),
    chapters: json("chapters").notNull().$type<CourseChapter[]>(),
    enrollCount: int("enroll_count", { unsigned: true }).notNull().default(0),
    generatedAi: boolean("generated_ai").notNull().default(false),
    duration: mediumint("duration", { unsigned: true }).notNull(),
    extra: json("extra").notNull().$type<CourseExtra>(),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
    publishedAt: datetime("published_at").notNull(),
  },
  (table) => {
    return {
      uqVideoId: uniqueIndex("uq_video_id").on(table.videoId),
      idxChannelId: index("idx_channel_id").on(table.channelId),
      idxCategoryId: index("idx_category_id").on(table.categoryId),
      idxLanguage: index("idx_language").on(table.language),
      idxEnrollCount: index("idx_enroll_count").on(table.enrollCount), // DESC
      idxGeneratedAi: index("idx_generated_ai").on(table.generatedAi),
      idxCreatedAt: index("idx_created_at").on(table.createdAt), // DESC
      idxPublishedAt: index("idx_published_at").on(table.publishedAt), // DESC
    };
  }
);

export type EnrollChapterProgress = {
  [key in string]: number;
};

export type EnrollRecentProgress = {
  courseIndex: number;
  chapterIndex: number;
};

export const enrolls = mysqlTable(
  "Enrolls",
  {
    userId: bigint("user_id", { unsigned: true, mode: "number" }).notNull(),
    courseId: bigint("course_id", { unsigned: true, mode: "number" }).notNull(),
    chapterProgress: json("chapter_progress")
      .notNull()
      .$type<EnrollChapterProgress>(),
    totalProgress: float("total_progress").notNull(),
    recentProgress: json("recent_progress")
      .notNull()
      .$type<EnrollRecentProgress>(),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.courseId] }),
      idxCourseId: index("idx_course_id").on(table.courseId),
      idxUserIdCreatedAt: index("idx_user_id_created_at").on(
        table.userId,
        table.createdAt // desc
      ),
      idxUserIdUpdatedAt: index("idx_user_id_updated_at").on(
        table.userId,
        table.updatedAt // desc
      ),
    };
  }
);

export const categories = mysqlTable(
  "Categories",
  {
    id: int("id", { unsigned: true }).notNull().primaryKey().autoincrement(),
    name: varchar("name", { length: 100 }).notNull(),
    parentId: int("parent_id", { unsigned: true }).notNull(),
  },
  (table) => {
    return {
      idxParentId: index("idx_parent_id").on(table.parentId),
    };
  }
);

export const roles = mysqlTable("Roles", {
  id: int("id", { unsigned: true }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const channelsRelations = relations(channels, ({ many }) => {
  return {
    courses: many(courses),
  };
});

export const coursesRelations = relations(courses, ({ many, one }) => {
  return {
    enrolls: many(enrolls),
    channel: one(channels, {
      fields: [courses.channelId],
      references: [channels.channelId],
    }),
    category: one(categories, {
      fields: [courses.categoryId],
      references: [categories.id],
    }),
  };
});

export const usersRelations = relations(users, ({ many, one }) => {
  return {
    enrolls: many(enrolls),
    role: one(roles, {
      fields: [users.roleId],
      references: [roles.id],
    }),
  };
});

export const enrollsRelations = relations(enrolls, ({ one }) => {
  return {
    course: one(courses, {
      fields: [enrolls.courseId],
      references: [courses.id],
    }),
    user: one(users, {
      fields: [enrolls.userId],
      references: [users.id],
    }),
  };
});

export const categoriesRelations = relations(categories, ({ many }) => {
  return {
    courses: many(courses),
  };
});

export const roleRelations = relations(roles, ({ many }) => {
  return {
    users: many(users),
  };
});
