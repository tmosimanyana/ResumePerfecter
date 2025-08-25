import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function extractKeywords(text: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert at extracting relevant keywords from job descriptions and resumes. Extract the most important technical skills, soft skills, tools, technologies, and industry terms. Return them as a JSON array of strings."
        },
        {
          role: "user",
          content: `Extract relevant keywords from this text:\n\n${text}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"keywords": []}');
    return result.keywords || [];
  } catch (error) {
    console.error("Error extracting keywords:", error);
    return [];
  }
}

export async function generateRecommendations(resumeText: string, jobDescription: string, missingKeywords: string[]): Promise<any[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert resume optimization consultant. Based on a resume and job description, provide specific, actionable recommendations to improve ATS compatibility and job match. 
          
          Return recommendations as JSON in this format:
          {
            "recommendations": [
              {
                "title": "Recommendation title",
                "description": "Specific actionable advice",
                "priority": "High|Medium|Low",
                "category": "keywords|formatting|experience|skills"
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nMissing Keywords:\n${missingKeywords.join(', ')}\n\nProvide specific recommendations to improve this resume's ATS compatibility and job match.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    return result.recommendations || [];
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
}

export async function analyzeATSFormatting(resumeText: string): Promise<any[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an ATS formatting expert. Analyze resume text for ATS compatibility issues. Check for proper formatting, standard section headers, readable text, and ATS-friendly elements.
          
          Return analysis as JSON:
          {
            "checks": [
              {
                "name": "Check name",
                "status": "passed|warning|failed",
                "message": "Detailed explanation"
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Analyze this resume text for ATS formatting compatibility:\n\n${resumeText}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"checks": []}');
    return result.checks || [];
  } catch (error) {
    console.error("Error analyzing ATS formatting:", error);
    return [];
  }
}
