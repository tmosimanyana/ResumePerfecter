import { extractKeywords, generateRecommendations, analyzeATSFormatting } from './openai';
import type { AnalysisResult, Recommendation, FormattingCheck, SkillGap } from '@shared/schema';

export class AnalysisEngine {
  async analyzeResume(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
    try {
      // Extract keywords from both resume and job description
      const [resumeKeywords, jobKeywords] = await Promise.all([
        extractKeywords(resumeText),
        extractKeywords(jobDescription)
      ]);

      // Find matching and missing keywords
      const foundKeywords = resumeKeywords.filter(keyword => 
        jobKeywords.some(jkw => jkw.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      const missingKeywords = jobKeywords.filter(keyword => 
        !resumeKeywords.some(rkw => rkw.toLowerCase().includes(keyword.toLowerCase()))
      );

      // Calculate scores
      const keywordMatchScore = Math.round((foundKeywords.length / Math.max(jobKeywords.length, 1)) * 100);
      const formatScore = await this.calculateFormatScore(resumeText);
      const skillsMatchScore = await this.calculateSkillsMatchScore(resumeKeywords, jobKeywords);
      const overallScore = Math.round((keywordMatchScore + formatScore + skillsMatchScore) / 3);

      // Generate recommendations and formatting checks
      const [recommendations, formattingChecks] = await Promise.all([
        generateRecommendations(resumeText, jobDescription, missingKeywords),
        analyzeATSFormatting(resumeText)
      ]);

      // Calculate skills gap
      const skillsGap = this.calculateSkillsGap(resumeKeywords, jobKeywords);

      return {
        overallScore,
        keywordMatchScore,
        formatScore,
        skillsMatchScore,
        foundKeywords,
        missingKeywords,
        recommendations: recommendations as Recommendation[],
        formattingChecks: formattingChecks as FormattingCheck[],
        skillsGap
      };
    } catch (error) {
      console.error("Error during resume analysis:", error);
      throw new Error("Failed to analyze resume");
    }
  }

  private async calculateFormatScore(resumeText: string): Promise<number> {
    // Basic format scoring based on common ATS requirements
    let score = 100;
    
    // Check for common ATS-unfriendly elements
    if (resumeText.includes('●') || resumeText.includes('•')) {
      score -= 5; // Bullet points should be standard
    }
    
    if (resumeText.length < 500) {
      score -= 20; // Too short
    }
    
    if (resumeText.length > 5000) {
      score -= 10; // Too long
    }

    // Check for section headers
    const commonHeaders = ['experience', 'education', 'skills', 'summary'];
    const foundHeaders = commonHeaders.filter(header => 
      resumeText.toLowerCase().includes(header)
    );
    
    if (foundHeaders.length < 2) {
      score -= 15; // Missing essential sections
    }

    return Math.max(0, Math.min(100, score));
  }

  private async calculateSkillsMatchScore(resumeKeywords: string[], jobKeywords: string[]): Promise<number> {
    if (jobKeywords.length === 0) return 0;
    
    const technicalSkills = jobKeywords.filter(keyword => 
      this.isTechnicalSkill(keyword)
    );
    
    const matchedTechnicalSkills = resumeKeywords.filter(keyword =>
      technicalSkills.some(tech => 
        tech.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(tech.toLowerCase())
      )
    );

    return Math.round((matchedTechnicalSkills.length / Math.max(technicalSkills.length, 1)) * 100);
  }

  private isTechnicalSkill(keyword: string): boolean {
    const technicalKeywords = [
      'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker',
      'kubernetes', 'typescript', 'angular', 'vue', 'mongodb', 'postgresql',
      'redis', 'graphql', 'rest', 'api', 'microservices', 'devops', 'ci/cd',
      'git', 'linux', 'agile', 'scrum', 'testing', 'jest', 'cypress'
    ];
    
    return technicalKeywords.some(tech => 
      keyword.toLowerCase().includes(tech) || tech.includes(keyword.toLowerCase())
    );
  }

  private calculateSkillsGap(resumeKeywords: string[], jobKeywords: string[]): SkillGap[] {
    const categories = {
      'Technical Skills': jobKeywords.filter(k => this.isTechnicalSkill(k)),
      'Soft Skills': jobKeywords.filter(k => this.isSoftSkill(k)),
      'Industry Keywords': jobKeywords.filter(k => !this.isTechnicalSkill(k) && !this.isSoftSkill(k)),
    };

    return Object.entries(categories).map(([category, keywords]) => {
      const matched = keywords.filter(keyword =>
        resumeKeywords.some(rk => 
          rk.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(rk.toLowerCase())
        )
      );
      
      const missing = keywords.filter(keyword => 
        !resumeKeywords.some(rk =>
          rk.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(rk.toLowerCase())
        )
      );

      return {
        category,
        percentage: Math.round((matched.length / Math.max(keywords.length, 1)) * 100),
        missing
      };
    });
  }

  private isSoftSkill(keyword: string): boolean {
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
      'creative', 'adaptable', 'organized', 'detail-oriented', 'collaborative',
      'management', 'project management', 'time management'
    ];
    
    return softSkills.some(skill => 
      keyword.toLowerCase().includes(skill) || skill.includes(keyword.toLowerCase())
    );
  }
}

export const analysisEngine = new AnalysisEngine();
