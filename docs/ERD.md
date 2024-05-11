---
title: "ERD"
dateCreated: "2024-05-11"
dateModified: "2024-05-11"
---

## ERD
### diagram
```plantuml-svg


entity "User" {
  *id : serial <<PK>>
  --
  uuid : varchar(50)
  role_id : smallint <<FK>>
  email: varchar(320) <<UQ>>
  hash_key: varchar(200)
  is_email_verified: boolean
  profile_name: varchar(100)
  profile_image: varchar(300)
  extra: json
  created_at: timestamp <<IDX>>
  updated_at: timestamp
}

entity "UserCredit" {
	*user_id <<PK>> <<FK>>
	--
	free_credits: integer
	purchased_credits: integer
	free_credit_updated_at: timestamp
	purchased_credit_updated_at: timestamp
	created_at: timestamp
	updated_at: timestamp
}

entity "Channel" {
	*channel_id: varchar <<PK>>
	--
	name: varchar(60)
	handle: varchar(50)
	enroll_count: integer
	extra: json
	created_at: timestamp
	updated_at: timestamp
}

entity "Course" {
	*id: serial <<PK>>
	--
	version: integer
	video_id: varchar(50) <<UNIQUE>>
	channel_id: varchar(50) <<FK>>
	category_id: interger <<FK>>
	language: varchar(10) <<IDX>>
	title: varchar(110)
	title_tsvector: tsvector <<IDX>>
	description: varchar(5010)
	summary: varchar(10000)
	chapters: json
	enroll_count: integer <<IDX>>
	generated_ai: boolean <<IDX>>
	duration: integer
	extra: json
	created_at: timestamp <<IDX>>
	updated_at: timestamp
	published_at: timestamp <<IDX>>
}

entity "Enroll" {
	*user_id: bigint <<PK>> <<FK>>
	*course_id: bigint <<PK>> <<FK>> <<IDX>>
	--
	video_id: varchar(50) <<FK>> <<CIDX>>
	version: integer
	chapter_progress: json
	total_progress: real
	recent_progress: json
	created_at: timestamp <<CIDX>>
	updated_at: timestamp <<CIDX>>
}

entity "Category" {
	*id: serial <<PK>>
	--
	name: varchar(50)
	parent_id: bigint <<FK>>
	created_at: timestamp <<IDX>>
	updated_at: timestamp <<IDX>>
}

entity "Role" {
	*id: serial <<PK>>
	--
	name: varchar(100)
	created_at: timestamp <<IDX>>
	updated_at: timestamp <<IDX>>
}

entity "Admin" {
	*id: serail <<PK>>
	--
	email: varchar(320) <<UQ>>
	role_id: smallint <<IDX>>
	otp_code: varchar(10)
	otp_expiration_at: timestamp
	profile_name: varchar(100)
	profile_image: varchar(300)
	created_at: timestamp <<IDX>>
	updated_at: timestamp
}

entity "Announcement" {
	*id: serail <<PK>>
	--
	admin_id: bigint <<FK>>
	title: varchar(200)
	title_tsvector: tsvector
	content: varchar(10000)
	is_displayed_on: boolean <<IDX>>
	display_start_date: timestamp <<IDX>>
	display_end_date: timestamp <<IDX>>
	created_at: timestamp <<IDX>>
	updated_at: timestamp
}

entity "AdminSession" {
	*id: serial <<PK>>
	--
	session_key: varchar(50) <<UQ>>
	admin_id: bingint <<FK>>
	data: json
	created_at: timestamp <<IDX>>
	updated_at: timestamp <<IDX>>
}

entity "Health" {
	*id: serial <<PK>>
	--
	version: bingint <<IDX>>
	data: json
	created_at: timestamp <<IDX>>
	updated_at: timestamp
}

entity "UserStat" {
	*version: bigint <<PK>>
	*event_at: date <<PK>>
	--
	data: json
	created_at: timestamp <<IDX>>
	updated_at: timestamp
}

Channel ||--o{ Course
Course ||--o{ Enroll
Category ||--o{ Course
Role ||--o{ User
User ||--o{ Enroll
User ||--|| UserCredit

Admin ||--o{ AdminSession
Admin ||--o{ Announcement







```
