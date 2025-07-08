import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface RoadmapStep {
  title: string;
  description: string;
  timeframe: string;
}

interface CareerMatch {
  role: string;
  matchScore: number;
  description: string;
  requiredSkills: string[];
  roadmap: RoadmapStep[];
  averageSalary: string;
}

interface CareerResultsProps {
  matches: CareerMatch[];
  isLoading: boolean;
}

export const CareerResults = ({ matches, isLoading }: CareerResultsProps) => {
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full bg-gradient-card shadow-soft animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-2 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-center">Your Career Matches</h2>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {matches.map((match, index) => (
          <Card 
            key={match.role} 
            className="w-full bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02]"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">{match.role}</CardTitle>
                <Badge 
                  variant={match.matchScore >= 80 ? "default" : match.matchScore >= 60 ? "secondary" : "outline"}
                  className="font-semibold"
                >
                  {match.matchScore}% Match
                </Badge>
              </div>
              <div className="space-y-2">
                <Progress value={match.matchScore} className="w-full" />
                <p className="text-sm text-muted-foreground">{match.description}</p>
                {match.averageSalary && (
                  <p className="text-sm font-medium text-success">
                    Average Salary: {match.averageSalary}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-1">
                  {match.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Career Roadmap:</h4>
                <div className="space-y-3">
                  {match.roadmap.map((step, stepIndex) => (
                    <div 
                      key={stepIndex} 
                      className="relative pl-6 pb-3 border-l-2 border-primary/30 last:border-l-0"
                    >
                      <div className="absolute left-[-5px] top-0 w-2 h-2 bg-primary rounded-full"></div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-sm">{step.title}</h5>
                          <Badge variant="secondary" className="text-xs">
                            {step.timeframe}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};