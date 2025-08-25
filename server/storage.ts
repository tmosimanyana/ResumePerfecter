import { type User, type InsertUser, type Resume, type InsertResume, type JobDescription, type InsertJobDescription, type Analysis, type InsertAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getResumesByUser(userId: string): Promise<Resume[]>;
  
  // Job description operations
  createJobDescription(jobDescription: InsertJobDescription): Promise<JobDescription>;
  getJobDescription(id: string): Promise<JobDescription | undefined>;
  
  // Analysis operations
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: string): Promise<Analysis | undefined>;
  getAnalysesByResume(resumeId: string): Promise<Analysis[]>;
  getRecentAnalyses(limit?: number): Promise<Analysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resumes: Map<string, Resume>;
  private jobDescriptions: Map<string, JobDescription>;
  private analyses: Map<string, Analysis>;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.jobDescriptions = new Map();
    this.analyses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const resume: Resume = {
      ...insertResume,
      id,
      userId: insertResume.userId || null,
      uploadedAt: new Date(),
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUser(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId
    );
  }

  async createJobDescription(insertJobDescription: InsertJobDescription): Promise<JobDescription> {
    const id = randomUUID();
    const jobDescription: JobDescription = {
      ...insertJobDescription,
      id,
      createdAt: new Date(),
    };
    this.jobDescriptions.set(id, jobDescription);
    return jobDescription;
  }

  async getJobDescription(id: string): Promise<JobDescription | undefined> {
    return this.jobDescriptions.get(id);
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = randomUUID();
    const analysis: Analysis = {
      ...insertAnalysis,
      id,
      analyzedAt: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }

  async getAnalysesByResume(resumeId: string): Promise<Analysis[]> {
    return Array.from(this.analyses.values()).filter(
      (analysis) => analysis.resumeId === resumeId
    );
  }

  async getRecentAnalyses(limit: number = 10): Promise<Analysis[]> {
    const sortedAnalyses = Array.from(this.analyses.values())
      .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime());
    return sortedAnalyses.slice(0, limit);
  }
}

export const storage = new MemStorage();
