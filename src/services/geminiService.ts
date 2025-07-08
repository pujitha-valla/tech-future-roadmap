const GEMINI_API_KEY = 'AIzaSyBMAnVXOg6my4KW6-oMzSKf_UIhbfDPOf4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

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

export const analyzeSkills = async (skills: string[]): Promise<CareerMatch[]> => {
  const prompt = `
As a career guidance AI, analyze the following skills and provide the top 3-4 most suitable tech career roles. For each role, provide:

Skills: ${skills.join(', ')}

Please respond in this exact JSON format:
{
  "matches": [
    {
      "role": "Role Name",
      "matchScore": 85,
      "description": "Brief description of the role",
      "requiredSkills": ["skill1", "skill2", "skill3"],
      "roadmap": [
        {
          "title": "Step 1 Title",
          "description": "What to focus on in this step",
          "timeframe": "3-6 months"
        },
        {
          "title": "Step 2 Title", 
          "description": "Next phase of development",
          "timeframe": "6-12 months"
        }
      ],
      "averageSalary": "$70,000 - $120,000"
    }
  ]
}

Focus on realistic tech roles like Frontend Developer, Backend Developer, Full Stack Developer, Data Scientist, DevOps Engineer, UX/UI Designer, Product Manager, etc. Match scores should be based on skill alignment. Include 3-5 roadmap steps per role.
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const content = data.candidates[0].content.parts[0].text;
    
    // Clean up the response and parse JSON
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/, '').replace(/```$/, '');
    }
    
    const parsedResponse = JSON.parse(cleanContent);
    return parsedResponse.matches || [];
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Return fallback data if API fails
    return getFallbackData(skills);
  }
};

const getFallbackData = (skills: string[]): CareerMatch[] => {
  const hasJavaScript = skills.some(skill => skill.toLowerCase().includes('javascript') || skill.toLowerCase().includes('js'));
  const hasPython = skills.some(skill => skill.toLowerCase().includes('python'));
  const hasReact = skills.some(skill => skill.toLowerCase().includes('react'));
  const hasData = skills.some(skill => skill.toLowerCase().includes('data') || skill.toLowerCase().includes('sql'));

  const matches: CareerMatch[] = [];

  if (hasJavaScript || hasReact) {
    matches.push({
      role: "Frontend Developer",
      matchScore: 85,
      description: "Create user interfaces and interactive web experiences",
      requiredSkills: ["JavaScript", "React", "HTML/CSS", "TypeScript"],
      roadmap: [
        {
          title: "Master Core Technologies",
          description: "Strengthen JavaScript, HTML, CSS fundamentals",
          timeframe: "2-3 months"
        },
        {
          title: "Learn Modern Frameworks",
          description: "Deep dive into React, Vue, or Angular",
          timeframe: "3-4 months"
        },
        {
          title: "Build Portfolio Projects",
          description: "Create 3-5 impressive web applications",
          timeframe: "4-6 months"
        },
        {
          title: "Job Applications",
          description: "Apply to junior frontend positions",
          timeframe: "1-2 months"
        }
      ],
      averageSalary: "$60,000 - $110,000"
    });
  }

  if (hasPython || hasData) {
    matches.push({
      role: "Data Scientist",
      matchScore: 80,
      description: "Extract insights from data using statistical analysis and machine learning",
      requiredSkills: ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
      roadmap: [
        {
          title: "Statistics & Math Foundation",
          description: "Learn statistics, linear algebra, and probability",
          timeframe: "3-4 months"
        },
        {
          title: "Python Data Stack",
          description: "Master pandas, numpy, scikit-learn, matplotlib",
          timeframe: "4-5 months"
        },
        {
          title: "Machine Learning Projects",
          description: "Build end-to-end ML projects and portfolio",
          timeframe: "6-8 months"
        },
        {
          title: "Specialization",
          description: "Focus on specific domain (NLP, Computer Vision, etc.)",
          timeframe: "3-6 months"
        }
      ],
      averageSalary: "$80,000 - $150,000"
    });
  }

  if (matches.length === 0) {
    matches.push({
      role: "Full Stack Developer",
      matchScore: 70,
      description: "Work on both frontend and backend systems",
      requiredSkills: ["JavaScript", "Node.js", "React", "Databases", "APIs"],
      roadmap: [
        {
          title: "Frontend Fundamentals",
          description: "Master HTML, CSS, JavaScript, and a framework",
          timeframe: "3-4 months"
        },
        {
          title: "Backend Development",
          description: "Learn Node.js, Express, and database management",
          timeframe: "4-5 months"
        },
        {
          title: "Full Stack Projects",
          description: "Build complete applications with frontend and backend",
          timeframe: "6-8 months"
        },
        {
          title: "DevOps & Deployment",
          description: "Learn deployment, CI/CD, and cloud platforms",
          timeframe: "2-3 months"
        }
      ],
      averageSalary: "$70,000 - $130,000"
    });
  }

  return matches.slice(0, 3);
};