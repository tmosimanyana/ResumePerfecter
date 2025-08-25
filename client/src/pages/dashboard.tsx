import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { JobDescriptionForm } from "@/components/JobDescriptionForm";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  TrendingUp, 
  Award, 
  Target,
  History,
  Lightbulb,
  CheckCircle
} from "lucide-react";

export default function Dashboard() {
  const [uploadedResume, setUploadedResume] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch recent analyses for stats
  const { data: recentAnalyses = [] } = useQuery({
    queryKey: ["/api/analyses/recent", { limit: 5 }],
    enabled: true
  });

  const userStats = {
    totalAnalyzed: Array.isArray(recentAnalyses) ? recentAnalyses.length : 0,
    averageScore: Array.isArray(recentAnalyses) && recentAnalyses.length > 0
      ? Math.round(recentAnalyses.reduce((sum: number, analysis: any) => sum + analysis.overallScore, 0) / recentAnalyses.length)
      : 0,
    bestScore: Array.isArray(recentAnalyses) && recentAnalyses.length > 0
      ? Math.max(...recentAnalyses.map((analysis: any) => analysis.overallScore))
      : 0
  };

  const handleAnalysis = async () => {
    if (!uploadedResume || !jobDescription) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: uploadedResume.id,
          jobDescriptionId: jobDescription.id,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setAnalysisResult(result);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ATS Resume Optimizer</h1>
                <p className="text-sm text-muted">Make your resume ATS-compliant</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">History</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Templates</a>
              <Button className="bg-primary hover:bg-blue-700">
                Account
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="gradient-bg rounded-2xl p-8 mb-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Optimize Your Resume for ATS Systems
              </h2>
              <p className="text-blue-100 text-lg mb-6">
                Get past Applicant Tracking Systems with our AI-powered analysis. Upload your resume and job description to receive instant feedback and optimization suggestions.
              </p>
              <div className="flex items-center space-x-4 text-blue-100">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Instant Analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>ATS-Friendly Format</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Keyword Optimization</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Professional working on resume optimization" 
                className="rounded-xl shadow-lg w-full h-auto opacity-90" 
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Upload */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl">
                    <FileText className="h-6 w-6 mr-3 text-primary" />
                    Upload Your Resume
                  </CardTitle>
                  <span className="text-sm text-muted">Step 1 of 2</span>
                </div>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  onFileUploaded={setUploadedResume}
                  data-testid="file-upload-area"
                />
              </CardContent>
            </Card>

            {/* Job Description Form */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl">
                    <Target className="h-6 w-6 mr-3 text-primary" />
                    Target Job Description
                  </CardTitle>
                  <span className="text-sm text-muted">Step 2 of 2</span>
                </div>
              </CardHeader>
              <CardContent>
                <JobDescriptionForm 
                  onJobDescriptionCreated={setJobDescription}
                  data-testid="job-description-form"
                />
                <Button 
                  className="w-full mt-6 bg-primary hover:bg-blue-700 text-lg py-3"
                  onClick={handleAnalysis}
                  disabled={!uploadedResume || !jobDescription || isAnalyzing}
                  data-testid="button-analyze"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Your ATS Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Resumes Analyzed</span>
                  <span className="text-2xl font-bold text-primary" data-testid="text-total-analyzed">
                    {userStats.totalAnalyzed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Score</span>
                  <span className="text-2xl font-bold text-secondary" data-testid="text-average-score">
                    {userStats.averageScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Best Score</span>
                  <span className="text-2xl font-bold text-accent" data-testid="text-best-score">
                    {userStats.bestScore}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="h-5 w-5 mr-2 text-accent" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use exact keywords from the job description</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Keep formatting simple and ATS-friendly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Include relevant technical skills</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Quantify your achievements with metrics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Recent Analysis */}
            {Array.isArray(recentAnalyses) && recentAnalyses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <History className="h-5 w-5 mr-2 text-primary" />
                    Recent Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAnalyses.slice(0, 3).map((analysis: any, index: number) => (
                    <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900" data-testid={`text-analysis-title-${index}`}>
                          Analysis #{analysis.id.slice(-6)}
                        </p>
                        <p className="text-sm text-muted" data-testid={`text-analysis-date-${index}`}>
                          {new Date(analysis.analyzedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span 
                          className={`text-lg font-bold ${
                            analysis.overallScore >= 80 ? 'text-secondary' : 
                            analysis.overallScore >= 60 ? 'text-accent' : 'text-danger'
                          }`}
                          data-testid={`text-analysis-score-${index}`}
                        >
                          {analysis.overallScore}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-12">
            <AnalysisResults analysisData={analysisResult} data-testid="analysis-results" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">ATS Resume Optimizer</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Make your resume ATS-compliant and increase your chances of landing interviews.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Resume Analysis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Keyword Optimization</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ATS Testing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Score Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Resume Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cover Letter Builder</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Interview Prep</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ATS Resume Optimizer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
