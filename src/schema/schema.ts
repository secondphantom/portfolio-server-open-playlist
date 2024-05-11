import { relations, sql } from "drizzle-orm";
import {
  integer,
  uuid,
  pgTable,
  bigint,
  serial,
  varchar,
  smallint,
  boolean,
  json,
  timestamp,
  index,
  uniqueIndex,
  real,
  primaryKey,
  jsonb,
  customType,
  date,
} from "drizzle-orm/pg-core";

function genExpWithWeights(input: string[]) {
  const columnExpressions = input.map((column, index) => {
    const weight = String.fromCharCode(index + 65);
    return `setweight(to_tsvector('simple', coalesce(${column}, '')), '${weight}')`;
  });

  const tsvectorColumn = `tsvector GENERATED ALWAYS AS (${columnExpressions.join(
    " || "
  )}) STORED`;

  return tsvectorColumn;
}

export const tsvector = customType<{
  data: string;
  config: { sources: string[]; weighted: boolean };
}>({
  dataType(config) {
    if (config) {
      const sources = config.sources.join(" || ' ' || ");
      return config.weighted
        ? genExpWithWeights(config.sources)
        : `tsvector generated always as (to_tsvector('simple', ${sources})) stored`;
    } else {
      return `tsvector`;
    }
  },
});

export type UserExtra = {};

export const users = pgTable(
  "Users",
  {
    id: bigint("id", { mode: "number" }).notNull().primaryKey().default(0),
    uuid: varchar("uuid", { length: 50 }).notNull(),
    roleId: smallint("role_id").notNull().default(1),
    email: varchar("email", { length: 320 }).notNull(),
    hashKey: varchar("hash_key", { length: 200 }).notNull(),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    profileName: varchar("profile_name", { length: 100 }).notNull(),
    profileImage: varchar("profile_image", { length: 300 }),
    extra: jsonb("extra").notNull().$type<UserExtra>(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => {
    return {
      idxRole: index("idx_user_role").on(table.roleId),
      uqEmail: uniqueIndex("uq_user_email").on(table.email),
      idxCreatedAt: index("idx_user_created_at").on(table.createdAt), // DESC
    };
  }
);

export type ChannelExtra = {};

export const channels = pgTable("Channels", {
  channelId: varchar("channel_id", { length: 50 }).primaryKey().notNull(),
  name: varchar("name", { length: 60 }).notNull(), //FULL TEXT
  handle: varchar("handle", { length: 50 }).notNull().default(""),
  enrollCount: integer("enroll_count").notNull().default(0),
  extra: jsonb("extra").notNull().$type<ChannelExtra>(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});

export type CourseChapter = { title: string; time: number };
export type CourseExtra = {};

export const courses = pgTable(
  "Courses",
  {
    id: bigint("id", { mode: "number" }).notNull().primaryKey().default(0),
    version: integer("version").notNull().default(1),
    videoId: varchar("video_id", { length: 50 }).notNull(),
    channelId: varchar("channel_id", { length: 50 }).notNull(),
    categoryId: integer("category_id").notNull().default(0),
    language: varchar("language", { length: 10 }).notNull(),
    title: varchar("title", { length: 110 }).notNull(), //FULL TEXT
    titleTsvector: tsvector("title_tsvector").default(""),
    description: varchar("description", { length: 5010 }).notNull(),
    summary: varchar("summary", { length: 10000 }),
    chapters: jsonb("chapters").notNull().$type<CourseChapter[]>(),
    enrollCount: integer("enroll_count").notNull().default(0),
    generatedAi: boolean("generated_ai").notNull().default(false),
    duration: integer("duration").notNull(),
    extra: jsonb("extra").notNull().$type<CourseExtra>(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
    publishedAt: timestamp("published_at").notNull(),
  },
  (table) => {
    return {
      uqVideoId: uniqueIndex("uq_video_id").on(table.videoId),
      idxChannelId: index("idx_channel_id").on(table.channelId),
      idxCategoryId: index("idx_category_id").on(table.categoryId),
      idxLanguage: index("idx_language").on(table.language),
      idxEnrollCount: index("idx_enroll_count").on(table.enrollCount), // DESC
      idxGeneratedAi: index("idx_generated_ai").on(table.generatedAi),
      idxCreatedAt: index("idx_courses_created_at").on(table.createdAt), // DESC
      idxPublishedAt: index("idx_published_at").on(table.publishedAt), // DESC
    };
  }
);

export type EnrollChapterProgress = {
  [key in string]: number;
};

export type EnrollRecentProgress = {
  chapterIndex: number;
};

export const enrolls = pgTable(
  "Enrolls",
  {
    userId: bigint("user_id", { mode: "number" }).notNull(),
    courseId: bigint("course_id", { mode: "number" }).notNull(),
    videoId: varchar("video_id", { length: 50 }).notNull(),
    version: integer("version").notNull(),
    chapterProgress: jsonb("chapter_progress")
      .notNull()
      .$type<EnrollChapterProgress>(),
    totalProgress: real("total_progress").notNull(),
    recentProgress: jsonb("recent_progress")
      .notNull()
      .$type<EnrollRecentProgress>(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.courseId] }),
      idxCourseId: index("idx_course_id").on(table.courseId),
      idxUserIdVideoId: index("idx_user_id_video_id").on(
        table.userId,
        table.videoId
      ),
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

export const categories = pgTable(
  "Categories",
  {
    id: integer("id").notNull().primaryKey().default(0),
    name: varchar("name", { length: 100 }).notNull(),
    parentId: integer("parent_id").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => {
    return {
      idxParentId: index("idx_categories_parent_id").on(table.parentId),
      idxCreatedAt: index("idx_categories_created_at").on(table.createdAt),
      idxUpdatedAt: index("idx_categories_updated_at").on(table.updatedAt),
    };
  }
);

export const roles = pgTable(
  "Roles",
  {
    id: integer("id").notNull().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => {
    return {
      idxCreatedAt: index("idx_roles_created_at").on(table.createdAt),
      idxUpdatedAt: index("idx_roles_updated_at").on(table.updatedAt),
    };
  }
);

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
    credit: one(userCredits, {
      fields: [users.id],
      references: [userCredits.userId],
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

export const admins = pgTable(
  "Admins",
  {
    id: bigint("id", { mode: "number" }).notNull().primaryKey().default(0),
    email: varchar("email", { length: 320 }).notNull(),
    roleId: smallint("role_id").notNull().default(0),
    otpCode: varchar("otp_code", { length: 10 }),
    otpExpirationAt: timestamp("otp_expiration_at")
      .default(sql`now()`)
      .notNull(),
    profileName: varchar("profile_name", { length: 100 }).notNull(),
    profileImage: varchar("profile_image", { length: 300 }),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => {
    return {
      idxRole: index("idx_admin_role").on(table.roleId),
      uqEmail: uniqueIndex("uq_admin_email").on(table.email),
      idxCreatedAt: index("idx_admin_created_at").on(table.createdAt),
    };
  }
);

export const adminsRelation = relations(admins, ({ many }) => {
  return {
    sessions: many(sessions),
    announcements: many(announcements),
  };
});

export type SessionData = {
  device: any;
  ip: string;
  userAgent: string;
};

export const sessions = pgTable(
  "AdminSessions",
  {
    id: bigint("id", { mode: "number" }).notNull().primaryKey().default(0),
    sessionKey: varchar("session_key", { length: 50 }).notNull(),
    adminId: bigint("admin_id", { mode: "number" }).notNull(),
    data: jsonb("data").notNull().$type<SessionData>(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => {
    return {
      idxAdminId: index("idx_sessions_admin_id").on(table.adminId),
      idxCreatedAt: index("idx_sessions_created_at").on(table.createdAt), // DESC
      idxUpdatedAt: index("idx_sessions_published_at").on(table.updatedAt), // DESC
      uqSessionId: uniqueIndex("uq_sessions_session_id").on(table.sessionKey),
    };
  }
);

export const sessionRelation = relations(sessions, ({ one }) => {
  return {
    admin: one(admins, {
      fields: [sessions.adminId],
      references: [admins.id],
    }),
  };
});

export type HealthData = {
  apis: {
    method: string;
    path: string;
    status: number;
    responseTime: number;
  }[];
};

export const healths = pgTable(
  "Healths",
  {
    id: bigint("id", { mode: "number" }).notNull().primaryKey().default(0),
    version: bigint("version", { mode: "number" }).notNull(),
    data: jsonb("data").notNull().$type<HealthData>(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => {
    return {
      idxVersion: index("idx_healths_version").on(table.version),
      idxCreatedAt: index("idx_healths_created_at").on(table.createdAt), // DESC
    };
  }
);

export type UserStatData = {
  total: number;
  dau: number;
  wau: number;
  mau: number;
};

export const userStats = pgTable(
  "UserStats",
  {
    version: bigint("version", { mode: "number" }).notNull(),
    eventAt: date("event_at", { mode: "date" }).notNull(),
    data: jsonb("data").notNull().$type<UserStatData>(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.version, table.eventAt] }),
      idxCreatedAt: index("idx_user_stats_created_at").on(table.createdAt), // DESC
    };
  }
);

export const userCredits = pgTable("UserCredits", {
  userId: bigint("user_id", { mode: "number" }).notNull().primaryKey(),
  freeCredits: integer("free_credits").notNull().default(0),
  purchasedCredits: integer("purchased_credits").notNull().default(0),
  freeCreditUpdatedAt: timestamp("free_credit_updated_at")
    .notNull()
    .default(sql`now()`),
  purchasedCreditUpdatedAt: timestamp("purchased_credit_updated_at")
    .notNull()
    .default(sql`now()`),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});

export const userCreditRelation = relations(userCredits, ({ one }) => {
  return {
    user: one(users, {
      fields: [userCredits.userId],
      references: [users.id],
    }),
  };
});

export type AnnouncementConfig = { showHome: boolean };

export const announcements = pgTable(
  "Announcements",
  {
    id: bigint("id", { mode: "number" }).notNull().primaryKey().default(0),
    adminId: bigint("admin_id", { mode: "number" }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    titleTsvector: tsvector("title_tsvector").default(""),
    content: varchar("content", { length: 10000 }).notNull(),
    isDisplayedOn: boolean("is_displayed_on").default(false).notNull(),
    displayStartDate: timestamp("display_start_date")
      .default(sql`now()`)
      .notNull(),
    displayEndDate: timestamp("display_end_date")
      .default(sql`now()`)
      .notNull(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => {
    return {
      idxAdminId: index("idx_announcements_admin_id").on(table.adminId),
      idxIsDisplayedOn: index("idx_announcements_is_displayed_on").on(
        table.isDisplayedOn
      ),
      idxDisplayStartDate: index("idx_announcements_display_start_date").on(
        table.displayStartDate
      ),
      idxDisplayEndDate: index("idx_announcements_display_end_date").on(
        table.displayEndDate
      ),
      idxCreatedAt: index("idx_announcements_created_at").on(table.createdAt),
    };
  }
);

export const announcementRelation = relations(announcements, ({ one }) => {
  return {
    admin: one(admins, {
      fields: [announcements.adminId],
      references: [admins.id],
    }),
  };
});
