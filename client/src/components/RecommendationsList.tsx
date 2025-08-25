import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Sparkles } from 'lucide-react';
import type { Recommendation } from '@shared/schema';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'border-red-400';
      case 'Medium':
        return 'border-yellow-400';
      case 'Low':
        return 'border-green-400';
      default:
        return 'border-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Lightbulb className="h-6 w-6 mr-3 text-yellow-600" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations && recommendations.length > 0 ? (
          <>
            {recommendations.map((recommendation, index) => (
              <div 
                key={index}
                className={`border-l-4 pl-4 py-3 ${getBorderColor(recommendation.priority)}`}
                data-testid={`recommendation-${index}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900" data-testid={`text-recommendation-title-${index}`}>
                    {recommendation.title}
                  </h4>
                  <Badge 
                    className={`text-xs font-medium ${getPriorityColor(recommendation.priority)}`}
                    data-testid={`badge-priority-${index}`}
                  >
                    {recommendation.priority} Priority
                  </Badge>
                </div>
                <p className="text-sm text-gray-600" data-testid={`text-recommendation-description-${index}`}>
                  {recommendation.description}
                </p>
              </div>
            ))}
            
            <Button 
              className="w-full mt-6 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
              data-testid="button-generate-optimized"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Optimized Version
            </Button>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No specific recommendations available</p>
            <p className="text-sm">Your resume looks good overall!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
