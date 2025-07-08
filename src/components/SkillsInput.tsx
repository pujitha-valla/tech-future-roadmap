import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface SkillsInputProps {
  onSkillsChange: (skills: string[]) => void;
}

export const SkillsInput = ({ onSkillsChange }: SkillsInputProps) => {
  const [currentSkill, setCurrentSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const predefinedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'HTML/CSS',
    'Data Analysis', 'Machine Learning', 'SQL', 'Git', 'AWS', 'Docker',
    'Communication', 'Problem Solving', 'Leadership', 'Teamwork', 'Creativity',
    'Time Management', 'Critical Thinking', 'Adaptability'
  ];

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      const newSkills = [...skills, skill];
      setSkills(newSkills);
      onSkillsChange(newSkills);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    onSkillsChange(newSkills);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSkill(currentSkill.trim());
    }
  };

  return (
    <Card className="w-full bg-gradient-card shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Tell us about your skills</CardTitle>
        <p className="text-muted-foreground">Add your technical and soft skills to get personalized career recommendations</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a skill and press Enter"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={() => addSkill(currentSkill.trim())}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            Add
          </Button>
        </div>

        {skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Your Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="group cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  <X className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-medium text-sm">Quick Add:</h3>
          <div className="flex flex-wrap gap-2">
            {predefinedSkills
              .filter(skill => !skills.includes(skill))
              .map((skill) => (
                <Badge 
                  key={skill} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => addSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};