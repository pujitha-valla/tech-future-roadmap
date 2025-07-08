import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillsInput } from './SkillsInput';
import { CareerResults } from './CareerResults';
import { ThemeToggle } from './ThemeToggle';
import { analyzeSkills } from '@/services/geminiService';
import { Sparkles, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export const CareerGuidanceApp = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const { toast } = useToast();

  const handleAnalyzeSkills = async () => {
    if (skills.length === 0) {
      toast({
        title: "No skills added",
        description: "Please add at least one skill to get career recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const matches = await analyzeSkills(skills);
      setCareerMatches(matches);
      setHasAnalyzed(true);
      toast({
        title: "Analysis complete!",
        description: `Found ${matches.length} career matches for your skills.`,
      });
    } catch (error) {
      console.error('Error analyzing skills:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your skills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setCareerMatches([]);
    setHasAnalyzed(false);
    setSkills([]);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Career Guidance
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        {!hasAnalyzed && (
          <div className="text-center space-y-6 py-12">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                Discover Your Perfect Tech Career
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Let AI analyze your skills and create a personalized roadmap to your dream tech job
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <Card className="bg-gradient-card shadow-soft">
                <CardHeader className="text-center">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">AI-Powered Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Advanced AI analyzes your skills and matches you with the best tech careers
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft">
                <CardHeader className="text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Personalized Roadmaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Get step-by-step learning paths tailored to your current skill level
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft">
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Industry Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Access real salary data and skill requirements from the tech industry
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Skills Input Section */}
        <div className="max-w-4xl mx-auto">
          <SkillsInput onSkillsChange={setSkills} />
          
          {skills.length > 0 && !hasAnalyzed && (
            <div className="text-center mt-6">
              <Button 
                onClick={handleAnalyzeSkills}
                disabled={isLoading}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-opacity px-8 py-3 text-lg font-medium shadow-soft"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Skills...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze My Skills
                  </>
                )}
              </Button>
            </div>
          )}

          {hasAnalyzed && (
            <div className="text-center mt-6">
              <Button 
                onClick={resetAnalysis}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg font-medium"
              >
                Start Over
              </Button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {(hasAnalyzed || isLoading) && (
          <div className="max-w-7xl mx-auto">
            <CareerResults matches={careerMatches} isLoading={isLoading} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          <p>Powered by AI • Built with React & Gemini API</p>
        </footer>
      </main>
    </div>
  );
};