-- CreateTrigger
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS
$set_updated_at$
BEGIN
    IF NEW."updated_at" = OLD."updated_at" THEN
        NEW."updated_at" = NOW();
    END IF;
    RETURN NEW;
END;
$set_updated_at$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "Users" (
    "id" BIGSERIAL NOT NULL,
    "uuid" VARCHAR(50) NOT NULL,
    "role_id" INTEGER NOT NULL DEFAULT 1,
    "email" VARCHAR(320) NOT NULL,
    "hash_key" VARCHAR(200) NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "profile_name" VARCHAR(100) NOT NULL,
    "profile_image" VARCHAR(300),
    "extra" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channels" (
    "channel_id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "name_tsvector" TSVECTOR,
    "handle" VARCHAR(50) NOT NULL,
    "enroll_count" INTEGER NOT NULL DEFAULT 0,
    "extra" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Channels_pkey" PRIMARY KEY ("channel_id")
);

-- CreateTable
CREATE TABLE "Courses" (
    "id" BIGSERIAL NOT NULL,
		"version" INTEGER NOT NULL DEFAULT 1,
    "video_id" VARCHAR(50) NOT NULL,
    "channel_id" VARCHAR(50) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "title" VARCHAR(110) NOT NULL,
    "title_tsvector" TSVECTOR,
    "description" VARCHAR(5010) NOT NULL,
    "summary" VARCHAR(10000),
    "chapters" JSONB NOT NULL,
    "enroll_count" INTEGER NOT NULL,
    "generated_ai" BOOLEAN NOT NULL DEFAULT false,
    "duration" INTEGER NOT NULL,
    "extra" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "published_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Courses_channel_id_idx" ON "Courses"("channel_id");

-- CreateIndex
CREATE INDEX "Courses_category_id_idx" ON "Courses"("category_id");

-- CreateIndex
CREATE INDEX "Courses_language_idx" ON "Courses"("language");

-- CreateIndex
CREATE INDEX "Courses_enroll_count_idx" ON "Courses"("enroll_count" DESC);

-- CreateIndex
CREATE INDEX "Courses_generated_ai_idx" ON "Courses"("generated_ai");

-- CreateIndex
CREATE INDEX "Courses_created_at_idx" ON "Courses"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Courses_published_at_idx" ON "Courses"("published_at" DESC);

-- CreateIndex
CREATE INDEX "Courses_title_tsvector_idx" ON "Courses" USING GIN ("title_tsvector");

-- CreateIndex
CREATE UNIQUE INDEX "Courses_video_id_key" ON "Courses"("video_id");

-- CreateTrigger
CREATE TRIGGER course_title_vector_update BEFORE INSERT OR UPDATE
ON "Courses" FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(title_tsvector, 'pg_catalog.simple', title);

-- SetTrigger
CREATE TRIGGER table_update
BEFORE UPDATE ON "Courses"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- CreateTable
CREATE TABLE "Enrolls" (
    "user_id" BIGINT NOT NULL,
    "course_id" BIGINT NOT NULL,
		"version" INTEGER NOT NULL,
    "chapter_progress" JSONB NOT NULL,
    "total_progress" REAL NOT NULL,
    "recent_progress" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Enrolls_pkey" PRIMARY KEY ("user_id","course_id")
);

-- CreateIndex
CREATE INDEX "Enrolls_course_id_idx" ON "Enrolls"("course_id");

-- CreateIndex
CREATE INDEX "Enrolls_user_id_created_at_idx" ON "Enrolls"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Enrolls_user_id_updated_at_idx" ON "Enrolls"("user_id", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "Enrolls_updated_at_idx" ON "Enrolls"("updated_at" DESC);

-- SetTrigger
CREATE TRIGGER table_update
BEFORE UPDATE ON "Enrolls"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "parent_id" INTEGER NOT NULL,
		"created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
		"updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Categories_created_at_idx" ON "Categories"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Categories_updated_at_idx" ON "Categories"("updated_at" DESC);

-- SetTrigger
CREATE TRIGGER table_update
BEFORE UPDATE ON "Categories"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- CreateTable
CREATE TABLE "Roles" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
		"created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
		"updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Roles_created_at_idx" ON "Roles"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Roles_updated_at_idx" ON "Roles"("updated_at" DESC);

-- SetTrigger
CREATE TRIGGER table_update
BEFORE UPDATE ON "Roles"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- CreateTable
CREATE TABLE "Admins" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(320) NOT NULL,
		"role_id" INTEGER NOT NULL DEFAULT 1,
    "otp_code" VARCHAR(10),
		"otp_expiration_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "profile_name" VARCHAR(100) NOT NULL,
    "profile_image" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);


-- CreateIndex
CREATE INDEX "Users_role_id_idx" ON "Users"("role_id");

-- CreateIndex
CREATE INDEX "Users_created_at_idx" ON "Users"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Channels_name_tsvector_idx" ON "Channels" USING GIN ("name_tsvector");;







-- CreateIndex
CREATE INDEX "Categories_parent_id_idx" ON "Categories"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admins_email_key" ON "Admins"("email");

-- CreateIndex
CREATE INDEX "Admins_role_id_idx" ON "Admins"("role_id");

-- CreateIndex
CREATE INDEX "Admins_created_at_idx" ON "Admins"("created_at" DESC);



-- CreateTrigger
CREATE TRIGGER channel_name_vector_update BEFORE INSERT OR UPDATE
ON "Channels" FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(name_tsvector, 'pg_catalog.simple', 'name');



-- SetTrigger
CREATE TRIGGER table_update
BEFORE UPDATE ON "Users"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- SetTrigger
CREATE TRIGGER table_update
BEFORE UPDATE ON "Channels"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();






-- CreateTable
CREATE TABLE "AdminSessions" (
		"id" BIGSERIAL NOT NULL,
    "session_key" VARCHAR(50) NOT NULL,
		"admin_id" BIGINT NOT NULL,
		"data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "AdminSessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminSessions_admin_id_idx" ON "AdminSessions"("admin_id");

-- CreateIndex
CREATE INDEX "AdminSessions_created_at_idx" ON "AdminSessions"("created_at" DESC);

-- CreateIndex
CREATE INDEX "AdminSessions_updated_at_idx" ON "AdminSessions"("updated_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "AdminSessions_session_key_key" ON "AdminSessions"("session_key");

-- SetTrigger
CREATE TRIGGER table_update
BEFORE UPDATE ON "AdminSessions"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();


-- CreateTable
CREATE TABLE "Healths" (
    "id" BIGSERIAL NOT NULL,
		"version" BIGINT NOT NULL,
		"data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Healths_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Healths_version_idx" ON "Healths"("version");

-- CreateIndex
CREATE INDEX "Healths_created_at_idx" ON "Healths"("created_at" DESC);

-- CreateTable
CREATE TABLE "UserStats" (
		"version" BIGINT NOT NULL,
		"event_at" DATE NOT NULL,
		"data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("version","event_at")
);

-- CreateIndex
CREATE INDEX "UserStats_created_at_idx" ON "UserStats"("created_at" DESC);


-- CreateTable
CREATE TABLE "UserCredits" (
    "user_id" BIGSERIAL NOT NULL,
		"free_credits" INTEGER NOT NULL DEFAULT 0,
		"purchased_credits" INTEGER NOT NULL DEFAULT 0,
    "free_credit_updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "purchased_credit_updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "UserCredits_pkey" PRIMARY KEY ("user_id")
);

-- SetTrigger
CREATE TRIGGER table_update
BEFORE UPDATE ON "UserCredits"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- CreateTable
CREATE TABLE "Notices" (
    "id" BIGSERIAL NOT NULL,
		"admin_id" BIGINT NOT NULL,
		"title" VARCHAR(200) NOT NULL,
		"content" VARCHAR(10000) NOT NULL,
		"is_displayed_on" BOOLEAN NOT NULL DEFAULT false,
    "display_start_date" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "display_end_date" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Notices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notices_admin_id_idx" ON "Notices"("admin_id");

-- CreateIndex
CREATE INDEX "Notices_is_displayed_on_idx" ON "Notices"("is_displayed_on");

-- CreateIndex
CREATE INDEX "Notices_display_start_date_idx" ON "Notices"("display_start_date" DESC);

-- CreateIndex
CREATE INDEX "Notices_display_end_date_idx" ON "Notices"("display_end_date" DESC);

-- CreateIndex
CREATE INDEX "Notices_created_at_idx" ON "Notices"("created_at" DESC);

-- SetTrigger
CREATE TRIGGER table_update
BEFORE UPDATE ON "Notices"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();