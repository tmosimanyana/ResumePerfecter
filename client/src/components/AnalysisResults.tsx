import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreVisualization } from './ScoreVisualization';
import { KeywordAnalysis } from './KeywordAnalysis';
import { RecommendationsList } from './RecommendationsList';
import { 
  BarChart3, 
  Download, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileCheck,
  TrendingUp
} from 'lucide-react';

interface AnalysisResultsProps {
  analysisData: {
    analysis: any;
    result: any;
  };
}

export function AnalysisResults({ analysisData }: AnalysisResultsProps) {
  const { analysis, result } = analysisData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-100 text-green-800">✓ Passed</Badge>;
      case 'warning':
        return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">⚠ Warning</Badge>;
      case 'failed':
        return <Badge variant="destructive">✗ Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <BarChart3 className="h-8 w-8 mr-3 text-primary" />
              Analysis Results
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" data-testid="button-export-report">
                <Download className="h-4 w-4 mr-1" />
                Export Report
              </Button>
              <Button size="sm" className="bg-primary hover:bg-blue-700" data-testid="button-reanalyze">
                <RotateCcw className="h-4 w-4 mr-1" />
                Re-analyze
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <ScoreVisualization 
                score={result.overallScore} 
                size={80} 
                data-testid="score-overall"
              />
              <p className="font-medium text-gray-900 mt-2">Overall Score</p>
              <p className="text-sm text-muted">
                {result.overallScore >= 80 ? 'Excellent' : 
                 result.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-green-50 rounded-full flex items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(result.keywordMatchScore)}`} data-testid="text-keyword-score">
                  {result.keywordMatchScore}%
                </span>
              </div>
              <p className="font-medium text-gray-900">Keyword Match</p>
              <p className="text-sm text-muted">
                {result.keywordMatchScore >= 70 ? 'Great' : 
                 result.keywordMatchScore >= 50 ? 'Good' : 'Poor'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(result.formatScore)}`} data-testid="text-format-score">
                  {result.formatScore}%
                </span>
              </div>
              <p className="font-medium text-gray-900">ATS Format</p>
              <p className="text-sm text-muted">
                {result.formatScore >= 80 ? 'Excellent' : 
                 result.formatScore >= 60 ? 'Good' : 'Poor'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-purple-50 rounded-full flex items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(result.skillsMatchScore)}`} data-testid="text-skills-score">
                  {result.skillsMatchScore}%
                </span>
              </div>
              <p className="font-medium text-gray-900">Skills Match</p>
              <p className="text-sm text-muted">
                {result.skillsMatchScore >= 70 ? 'Strong' : 
                 result.skillsMatchScore >= 50 ? 'Moderate' : 'Weak'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Keyword Analysis */}
        <KeywordAnalysis 
          foundKeywords={result.foundKeywords}
          missingKeywords={result.missingKeywords}
          data-testid="keyword-analysis"
        />

        {/* Recommendations */}
        <RecommendationsList 
          recommendations={result.recommendations}
          data-testid="recommendations-list"
        />
      </div>

      {/* Detailed Analysis Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ATS Formatting Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileCheck className="h-6 w-6 mr-3 text-primary" />
              ATS Formatting Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.formattingChecks && result.formattingChecks.length > 0 ? (
              result.formattingChecks.map((check: any, index: number) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    check.status === 'passed' ? 'bg-green-50 border-green-200' :
                    check.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}
                  data-testid={`formatting-check-${index}`}
                >
                  <div className="flex items-center">
                    {getStatusIcon(check.status)}
                    <span className="text-gray-900 ml-3" data-testid={`text-check-name-${index}`}>
                      {check.name}
                    </span>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileCheck className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No formatting issues detected</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Gap Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <TrendingUp className="h-6 w-6 mr-3 text-yellow-600" />
              Skills Gap Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.skillsGap && result.skillsGap.length > 0 ? (
              result.skillsGap.map((skill: any, index: number) => (
                <div key={index} data-testid={`skills-gap-${index}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700" data-testid={`text-skill-category-${index}`}>
                      {skill.category}
                    </span>
                    <span className={`text-sm font-bold ${getScoreColor(skill.percentage)}`} data-testid={`text-skill-percentage-${index}`}>
                      {skill.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        skill.percentage >= 80 ? 'bg-green-500' :
                        skill.percentage >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
                  </div>
                  {skill.missing && skill.missing.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Missing: {skill.missing.slice(0, 3).join(', ')}
                      {skill.missing.length > 3 && ` (+${skill.missing.length - 3} more)`}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Skills analysis not available</p>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                <strong>Tip:</strong> Focus on highlighting your years of experience and specific project outcomes to improve experience level matching.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
