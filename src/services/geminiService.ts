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
As Gamya, an advanced AI career guidance system with extensive training on tech industry data, analyze the following skills and provide the top 4-5 most suitable tech career roles. Consider current industry trends, salary data, and skill requirements.

User Skills: ${skills.join(', ')}

Analyze these skills against these comprehensive career paths:

FRONTEND ROLES:
- Frontend Developer, UI Developer, React Developer, Vue Developer, Angular Developer
- Required: JavaScript, HTML/CSS, Frontend Frameworks, Version Control
- Growth: Junior (40-70k) → Mid (70-110k) → Senior (110-160k) → Lead (140-200k)

BACKEND ROLES:
- Backend Developer, API Developer, Node.js Developer, Python Developer, Java Developer
- Required: Programming Language, Databases, APIs, Cloud Services
- Growth: Junior (50-80k) → Mid (80-120k) → Senior (120-170k) → Architect (160-250k)

FULL STACK ROLES:
- Full Stack Developer, MEAN/MERN Developer, T-shaped Developer
- Required: Frontend + Backend + Database + DevOps basics
- Growth: Junior (55-85k) → Mid (85-130k) → Senior (130-180k) → Tech Lead (170-220k)

DATA ROLES:
- Data Scientist, Data Analyst, ML Engineer, Data Engineer, Research Scientist
- Required: Python/R, Statistics, SQL, ML Libraries, Data Visualization
- Growth: Analyst (60-90k) → Scientist (90-140k) → Senior (140-200k) → Principal (200-300k)

DEVOPS/CLOUD ROLES:
- DevOps Engineer, Cloud Engineer, Site Reliability Engineer, Platform Engineer
- Required: Cloud Platforms, Containers, CI/CD, Infrastructure as Code
- Growth: Junior (70-100k) → Mid (100-140k) → Senior (140-190k) → Principal (190-280k)

MOBILE ROLES:
- Mobile Developer, iOS Developer, Android Developer, React Native Developer
- Required: Mobile Frameworks, Platform-specific languages, App Store knowledge
- Growth: Junior (50-80k) → Mid (80-120k) → Senior (120-160k) → Lead (150-200k)

DESIGN ROLES:
- UX Designer, UI Designer, Product Designer, Design Systems Engineer
- Required: Design Tools, User Research, Prototyping, Design Thinking
- Growth: Junior (45-70k) → Mid (70-110k) → Senior (110-150k) → Principal (150-200k)

PRODUCT/MANAGEMENT ROLES:
- Product Manager, Technical Product Manager, Engineering Manager, Scrum Master
- Required: Product Strategy, Communication, Technical Understanding, Agile
- Growth: Associate (80-110k) → PM (110-160k) → Senior (160-220k) → Director (220-350k)

SECURITY ROLES:
- Cybersecurity Analyst, Security Engineer, Penetration Tester, Security Architect
- Required: Security Fundamentals, Network Security, Risk Assessment
- Growth: Analyst (60-90k) → Engineer (90-130k) → Senior (130-180k) → Architect (180-250k)

EMERGING TECH ROLES:
- Blockchain Developer, AR/VR Developer, AI/ML Engineer, Quantum Developer
- Required: Specialized knowledge, Programming, Problem Solving
- Growth: Specialist (80-120k) → Senior (120-180k) → Expert (180-280k) → Research Lead (250-400k)

Please respond in this exact JSON format with detailed analysis:
{
  "matches": [
    {
      "role": "Specific Role Title",
      "matchScore": 85,
      "description": "Detailed description of the role and responsibilities",
      "requiredSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
      "roadmap": [
        {
          "title": "Foundation Building",
          "description": "Specific skills and knowledge to build first",
          "timeframe": "2-4 months"
        },
        {
          "title": "Skill Enhancement", 
          "description": "Next level skills and practical application",
          "timeframe": "4-8 months"
        },
        {
          "title": "Portfolio Development",
          "description": "Build projects and gain experience",
          "timeframe": "6-10 months"
        },
        {
          "title": "Job Preparation",
          "description": "Interview prep and job applications",
          "timeframe": "1-3 months"
        },
        {
          "title": "Career Growth",
          "description": "Path to senior roles and specialization",
          "timeframe": "1-3 years"
        }
      ],
      "averageSalary": "$70,000 - $120,000"
    }
  ]
}

Calculate match scores based on:
- Direct skill alignment (40%)
- Transferable skills (25%) 
- Market demand (20%)
- Learning curve (15%)

Provide 4-5 detailed matches with realistic salaries based on 2024 market data.
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
  const skillLower = skills.map(s => s.toLowerCase());
  const hasJS = skillLower.some(s => s.includes('javascript') || s.includes('react') || s.includes('vue') || s.includes('angular'));
  const hasPython = skillLower.some(s => s.includes('python') || s.includes('django') || s.includes('flask'));
  const hasData = skillLower.some(s => s.includes('data') || s.includes('sql') || s.includes('machine learning') || s.includes('statistics'));
  const hasDevOps = skillLower.some(s => s.includes('docker') || s.includes('kubernetes') || s.includes('aws') || s.includes('cloud'));
  const hasDesign = skillLower.some(s => s.includes('ui') || s.includes('ux') || s.includes('design') || s.includes('figma'));
  const hasMobile = skillLower.some(s => s.includes('mobile') || s.includes('react native') || s.includes('flutter') || s.includes('ios') || s.includes('android'));

  const matches: CareerMatch[] = [];

  // Frontend Developer
  if (hasJS) {
    matches.push({
      role: "Frontend Developer",
      matchScore: 88,
      description: "Build responsive user interfaces and interactive web experiences using modern frameworks and technologies",
      requiredSkills: ["JavaScript", "React/Vue/Angular", "HTML/CSS", "TypeScript", "Version Control"],
      roadmap: [
        {
          title: "Master Core Web Technologies",
          description: "Strengthen JavaScript fundamentals, HTML5, CSS3, and ES6+ features",
          timeframe: "2-3 months"
        },
        {
          title: "Learn Modern Framework",
          description: "Deep dive into React, Vue, or Angular with state management",
          timeframe: "3-4 months"
        },
        {
          title: "Build Responsive Projects",
          description: "Create 4-6 responsive web applications with modern design",
          timeframe: "4-6 months"
        },
        {
          title: "Advanced Topics & Testing",
          description: "Learn testing, performance optimization, and build tools",
          timeframe: "2-3 months"
        },
        {
          title: "Job Applications & Growth",
          description: "Apply to positions and continue learning emerging technologies",
          timeframe: "1-2 months"
        }
      ],
      averageSalary: "$65,000 - $125,000"
    });
  }

  // Data Scientist
  if (hasData || hasPython) {
    matches.push({
      role: "Data Scientist",
      matchScore: 85,
      description: "Extract insights from complex datasets using statistical analysis, machine learning, and data visualization",
      requiredSkills: ["Python/R", "Statistics", "SQL", "Machine Learning", "Data Visualization", "Pandas/NumPy"],
      roadmap: [
        {
          title: "Mathematical Foundation",
          description: "Master statistics, linear algebra, probability, and calculus basics",
          timeframe: "3-4 months"
        },
        {
          title: "Python Data Ecosystem",
          description: "Learn pandas, numpy, matplotlib, seaborn, and jupyter notebooks",
          timeframe: "4-5 months"
        },
        {
          title: "Machine Learning Mastery",
          description: "Understand algorithms, scikit-learn, and model evaluation techniques",
          timeframe: "6-8 months"
        },
        {
          title: "Real-world Projects",
          description: "Build end-to-end ML projects and deploy models",
          timeframe: "4-6 months"
        },
        {
          title: "Specialization & Career",
          description: "Focus on domain expertise (NLP, Computer Vision, etc.) and job search",
          timeframe: "6-12 months"
        }
      ],
      averageSalary: "$85,000 - $165,000"
    });
  }

  // DevOps Engineer
  if (hasDevOps) {
    matches.push({
      role: "DevOps Engineer",
      matchScore: 82,
      description: "Bridge development and operations by automating deployment pipelines and managing cloud infrastructure",
      requiredSkills: ["Cloud Platforms (AWS/Azure)", "Docker", "Kubernetes", "CI/CD", "Infrastructure as Code"],
      roadmap: [
        {
          title: "Cloud Fundamentals",
          description: "Learn AWS/Azure basics, networking, and security concepts",
          timeframe: "2-3 months"
        },
        {
          title: "Containerization & Orchestration",
          description: "Master Docker, Kubernetes, and container orchestration",
          timeframe: "3-4 months"
        },
        {
          title: "CI/CD & Automation",
          description: "Build automated pipelines with Jenkins, GitLab CI, or GitHub Actions",
          timeframe: "4-5 months"
        },
        {
          title: "Infrastructure as Code",
          description: "Learn Terraform, Ansible, and infrastructure automation",
          timeframe: "3-4 months"
        },
        {
          title: "Production & Monitoring",
          description: "Implement monitoring, logging, and production-ready systems",
          timeframe: "4-6 months"
        }
      ],
      averageSalary: "$85,000 - $155,000"
    });
  }

  // UX/UI Designer
  if (hasDesign) {
    matches.push({
      role: "UX/UI Designer",
      matchScore: 80,
      description: "Design intuitive user experiences and beautiful interfaces that solve real user problems",
      requiredSkills: ["Figma/Sketch", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
      roadmap: [
        {
          title: "Design Fundamentals",
          description: "Learn design principles, typography, color theory, and composition",
          timeframe: "2-3 months"
        },
        {
          title: "UX Research Methods",
          description: "Master user interviews, personas, journey mapping, and usability testing",
          timeframe: "3-4 months"
        },
        {
          title: "Design Tools & Prototyping",
          description: "Become proficient in Figma, Sketch, and interactive prototyping",
          timeframe: "2-3 months"
        },
        {
          title: "Portfolio Development",
          description: "Create 3-5 case studies showing your design process",
          timeframe: "4-6 months"
        },
        {
          title: "Specialization & Career",
          description: "Focus on specific areas (mobile, web, enterprise) and job applications",
          timeframe: "3-6 months"
        }
      ],
      averageSalary: "$60,000 - $130,000"
    });
  }

  // Mobile Developer
  if (hasMobile || hasJS) {
    matches.push({
      role: "Mobile App Developer",
      matchScore: 78,
      description: "Create native and cross-platform mobile applications for iOS and Android devices",
      requiredSkills: ["React Native/Flutter", "Mobile UI/UX", "API Integration", "App Store Guidelines", "Mobile Testing"],
      roadmap: [
        {
          title: "Mobile Development Basics",
          description: "Learn mobile app fundamentals and choose React Native or Flutter",
          timeframe: "2-3 months"
        },
        {
          title: "Framework Mastery",
          description: "Deep dive into your chosen framework and navigation patterns",
          timeframe: "3-4 months"
        },
        {
          title: "Native Features Integration",
          description: "Learn camera, GPS, push notifications, and device APIs",
          timeframe: "3-4 months"
        },
        {
          title: "App Store Deployment",
          description: "Build complete apps and publish to App Store and Google Play",
          timeframe: "2-3 months"
        },
        {
          title: "Advanced & Performance",
          description: "Optimize performance, learn native modules, and advanced patterns",
          timeframe: "4-6 months"
        }
      ],
      averageSalary: "$70,000 - $140,000"
    });
  }

  // Fallback: Full Stack Developer
  if (matches.length === 0) {
    matches.push({
      role: "Full Stack Developer",
      matchScore: 72,
      description: "Build complete web applications handling both frontend user interfaces and backend server logic",
      requiredSkills: ["JavaScript", "Node.js/Python", "React/Vue", "Databases", "APIs", "Version Control"],
      roadmap: [
        {
          title: "Frontend Foundation",
          description: "Master HTML, CSS, JavaScript, and a modern framework",
          timeframe: "3-4 months"
        },
        {
          title: "Backend Development",
          description: "Learn Node.js/Python, Express/Django, and database management",
          timeframe: "4-5 months"
        },
        {
          title: "Full Stack Integration",
          description: "Build complete applications connecting frontend and backend",
          timeframe: "5-7 months"
        },
        {
          title: "DevOps & Deployment",
          description: "Learn deployment, hosting, CI/CD, and cloud platforms",
          timeframe: "2-3 months"
        },
        {
          title: "Advanced Topics",
          description: "Microservices, testing, security, and scalability patterns",
          timeframe: "4-6 months"
        }
      ],
      averageSalary: "$75,000 - $140,000"
    });
  }

  return matches.slice(0, 4);
};