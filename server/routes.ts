import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResumeSchema, insertJobDescriptionSchema } from "@shared/schema";
import { parseResume, validateFileType, validateFileSize } from "./services/resumeParser";
import { analysisEngine } from "./services/analysisEngine";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (validateFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload resume endpoint
  app.post("/api/resume/upload", upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Validate file size
      if (!validateFileSize(req.file.size)) {
        fs.unlinkSync(req.file.path); // Clean up uploaded file
        return res.status(400).json({ error: "File size exceeds 10MB limit" });
      }

      // Parse the resume
      const resumeText = await parseResume(req.file.path, req.file.mimetype);

      // Create resume record
      const resumeData = {
        filename: req.file.originalname,
        originalText: resumeText,
        fileSize: req.file.size,
      };

      const validatedData = insertResumeSchema.parse(resumeData);
      const resume = await storage.createResume(validatedData);

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.json(resume);
    } catch (error) {
      console.error("Resume upload error:", error);
      if (req.file) {
        fs.unlinkSync(req.file.path); // Clean up on error
      }
      res.status(500).json({ error: "Failed to process resume upload" });
    }
  });

  // Create job description endpoint
  app.post("/api/job-description", async (req, res) => {
    try {
      const validatedData = insertJobDescriptionSchema.parse(req.body);
      const jobDescription = await storage.createJobDescription(validatedData);
      res.json(jobDescription);
    } catch (error) {
      console.error("Job description creation error:", error);
      res.status(400).json({ error: "Invalid job description data" });
    }
  });

  // Analyze resume endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { resumeId, jobDescriptionId } = req.body;

      if (!resumeId || !jobDescriptionId) {
        return res.status(400).json({ error: "Resume ID and Job Description ID are required" });
      }

      // Get resume and job description
      const [resume, jobDescription] = await Promise.all([
        storage.getResume(resumeId),
        storage.getJobDescription(jobDescriptionId)
      ]);

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      if (!jobDescription) {
        return res.status(404).json({ error: "Job description not found" });
      }

      // Perform analysis
      const analysisResult = await analysisEngine.analyzeResume(
        resume.originalText,
        jobDescription.description
      );

      // Save analysis
      const analysis = await storage.createAnalysis({
        resumeId,
        jobDescriptionId,
        overallScore: analysisResult.overallScore,
        keywordMatchScore: analysisResult.keywordMatchScore,
        formatScore: analysisResult.formatScore,
        skillsMatchScore: analysisResult.skillsMatchScore,
        foundKeywords: analysisResult.foundKeywords,
        missingKeywords: analysisResult.missingKeywords,
        recommendations: analysisResult.recommendations,
        formattingChecks: analysisResult.formattingChecks,
        skillsGap: analysisResult.skillsGap,
      });

      res.json({
        analysis,
        result: analysisResult
      });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Failed to analyze resume" });
    }
  });

  // Get analysis endpoint
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const analysis = await storage.getAnalysis(req.params.id);
      
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({ error: "Failed to retrieve analysis" });
    }
  });

  // Get recent analyses
  app.get("/api/analyses/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const analyses = await storage.getRecentAnalyses(limit);
      res.json(analyses);
    } catch (error) {
      console.error("Get recent analyses error:", error);
      res.status(500).json({ error: "Failed to retrieve recent analyses" });
    }
  });

  // Get resume endpoint
  app.get("/api/resume/:id", async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      res.json(resume);
    } catch (error) {
      console.error("Get resume error:", error);
      res.status(500).json({ error: "Failed to retrieve resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
