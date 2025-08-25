import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle, AlertTriangle } from 'lucide-react';

interface KeywordAnalysisProps {
  foundKeywords: string[];
  missingKeywords: string[];
}

export function KeywordAnalysis({ foundKeywords, missingKeywords }: KeywordAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Key className="h-6 w-6 mr-3 text-green-600" />
          Keyword Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Found Keywords */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Found Keywords
            <span className="text-muted ml-2" data-testid="text-found-count">
              ({foundKeywords.length} found)
            </span>
          </h4>
          {foundKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {foundKeywords.map((keyword, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                  data-testid={`badge-found-keyword-${index}`}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No matching keywords found</p>
          )}
        </div>
        
        {/* Missing Keywords */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            Missing Keywords
            <span className="text-muted ml-2" data-testid="text-missing-count">
              ({missingKeywords.length} to add)
            </span>
          </h4>
          {missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, index) => (
                <Badge 
                  key={index}
                  variant="destructive" 
                  className="bg-red-100 text-red-800 hover:bg-red-200"
                  data-testid={`badge-missing-keyword-${index}`}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-green-600 text-sm font-medium">
              <CheckCircle className="h-4 w-4 inline mr-1" />
              All important keywords are present!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
