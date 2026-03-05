import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
});

export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "applied",
  "interview",
  "offer",
  "rejected",
]);

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  companyName: text("company_name").notNull(),
  companyLinks: jsonb("company_links"),
  role: text("role").notNull(),
  salary: text("salary"),
  postLink: text("post_link"),
  lastDate: timestamp("last_date"),
  applied: boolean("applied").default(false),
  cvLink: text("cv_link"),
  notes: text("notes"),
  status: jobStatusEnum("status").default("pending").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  content: text("content").notNull(),
  title: text("title"),
});

export const interviewQuestions = pgTable("interview_questions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});
