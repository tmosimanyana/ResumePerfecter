import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  filename: text("filename").notNull(),
  originalText: text("original_text").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const jobDescriptions = pgTable("job_descriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company"),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").references(() => resumes.id).notNull(),
  jobDescriptionId: varchar("job_description_id").references(() => jobDescriptions.id).notNull(),
  overallScore: integer("overall_score").notNull(),
  keywordMatchScore: integer("keyword_match_score").notNull(),
  formatScore: integer("format_score").notNull(),
  skillsMatchScore: integer("skills_match_score").notNull(),
  foundKeywords: text("found_keywords").array(),
  missingKeywords: text("missing_keywords").array(),
  recommendations: jsonb("recommendations"),
  formattingChecks: jsonb("formatting_checks"),
  skillsGap: jsonb("skills_gap"),
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertResumeSchema = createInsertSchema(resumes).pick({
  filename: true,
  originalText: true,
  fileSize: true,
}).extend({
  userId: z.string().optional(),
});

export const insertJobDescriptionSchema = createInsertSchema(jobDescriptions).pick({
  title: true,
  company: true,
  description: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  analyzedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;

export type JobDescription = typeof jobDescriptions.$inferSelect;
export type InsertJobDescription = z.infer<typeof insertJobDescriptionSchema>;

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

// Analysis result types
export type AnalysisResult = {
  overallScore: number;
  keywordMatchScore: number;
  formatScore: number;
  skillsMatchScore: number;
  foundKeywords: string[];
  missingKeywords: string[];
  recommendations: Recommendation[];
  formattingChecks: FormattingCheck[];
  skillsGap: SkillGap[];
};

export type Recommendation = {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
};

export type FormattingCheck = {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  message?: string;
};

export type SkillGap = {
  category: string;
  percentage: number;
  missing: string[];
};
