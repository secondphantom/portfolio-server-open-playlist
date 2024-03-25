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

-- CreateTable
CREATE TABLE "Enrolls" (
    "user_id" BIGINT NOT NULL,
    "course_id" BIGINT NOT NULL,
    "chapter_progress" JSONB NOT NULL,
    "total_progress" REAL NOT NULL,
    "recent_progress" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Enrolls_pkey" PRIMARY KEY ("user_id","course_id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "parent_id" INTEGER NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE INDEX "Enrolls_course_id_idx" ON "Enrolls"("course_id");

-- CreateIndex
CREATE INDEX "Enrolls_user_id_created_at_idx" ON "Enrolls"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Enrolls_user_id_updated_at_idx" ON "Enrolls"("user_id", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "Categories_parent_id_idx" ON "Categories"("parent_id");

CREATE TRIGGER course_title_vector_update BEFORE INSERT OR UPDATE
ON "Courses" FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(title_tsvector, 'pg_catalog.simple', title);

CREATE TRIGGER channel_name_vector_update BEFORE INSERT OR UPDATE
ON "Channels" FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(name_tsvector, 'pg_catalog.simple', 'name');

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS
$set_updated_at$
BEGIN
    IF NEW."updated_at" = OLD."updated_at" THEN
        NEW."updated_at" = NOW();
    END IF;
    RETURN NEW;
END;
$set_updated_at$ LANGUAGE plpgsql;

CREATE TRIGGER table_update
BEFORE UPDATE ON "Users"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER table_update
BEFORE UPDATE ON "Channels"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER table_update
BEFORE UPDATE ON "Courses"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER table_update
BEFORE UPDATE ON "Enrolls"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();



