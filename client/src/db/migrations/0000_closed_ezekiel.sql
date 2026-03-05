CREATE TYPE "public"."job_status" AS ENUM('pending', 'applied', 'interview', 'offer', 'rejected');--> statement-breakpoint
CREATE TABLE "interview_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"company_name" text NOT NULL,
	"company_links" jsonb,
	"role" text NOT NULL,
	"salary" text,
	"post_link" text,
	"last_date" timestamp,
	"applied" boolean DEFAULT false,
	"cv_link" text,
	"notes" text,
	"status" "job_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"title" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
