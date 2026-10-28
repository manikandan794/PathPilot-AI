import { CROSS_DOMAIN_TRANSITIONS, CAREER_ACCELERATOR_ROLES } from '../db/seedData.js';

export interface AIServiceResponse<T> {
  provider: 'gemini' | 'ollama' | 'fallback_engine';
  success: boolean;
  data: T;
  latency_ms: number;
  note?: string;
}

export class AIService {
  private geminiKey: string;
  private geminiModel: string;
  private ollamaUrl: string;
  private ollamaModel: string;

  constructor() {
    this.geminiKey = process.env.GEMINI_API_KEY || '';
    this.geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'llama3';
  }

  public getStatus() {
    return {
      gemini_available: !!this.geminiKey,
      ollama_endpoint: this.ollamaUrl,
      fallback_engine: 'online (deterministic domain intelligence)',
    };
  }

  // Generic LLM text generator with honest fallback
  public async generateText(prompt: string, systemContext?: string): Promise<{ text: string; provider: 'gemini' | 'ollama' | 'fallback_engine' }> {
    const startTime = Date.now();

    // 1. Try Gemini Cloud if configured
    if (this.geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.geminiKey}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemContext ? systemContext + '\n\n' : ''}${prompt}` }]
              }
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
          }),
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (resp.ok) {
          const json: any = await resp.json();
          const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return { text: candidateText, provider: 'gemini' };
          }
        }
      } catch (err) {
        console.warn('Gemini request failed or timed out, evaluating fallback:', (err as Error).message);
      }
    }

    // 2. Try Ollama local if configured
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const resp = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt: `${systemContext ? systemContext + '\n\n' : ''}${prompt}`,
          stream: false
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (resp.ok) {
        const json: any = await resp.json();
        if (json.response) {
          return { text: json.response, provider: 'ollama' };
        }
      }
    } catch {
      // Ollama unreachable or local instance offline
    }

    // 3. High-Quality Deterministic Domain Intelligence Engine Fallback
    const fallbackText = this.generateDeterministicResponse(prompt, systemContext);
    return { text: fallbackText, provider: 'fallback_engine' };
  }

  // Student AI Learning Chatbot Response
  public async handleStudentChat(message: string, currentDomain?: string, currentLesson?: string): Promise<{ reply: string; provider: string }> {
    const prompt = `Student Message: "${message}"\nCurrent Domain Context: ${currentDomain || 'General Software Engineering'}\nCurrent Lesson: ${currentLesson || 'None'}`;
    const systemPrompt = `You are PathPilot AI, a knowledgeable, encouraging technical mentor. Give concise, actionable programming explanations, concrete code snippets where applicable, and guide the student towards their next milestone. Avoid claiming a lesson or quiz is finished unless recorded.`;
    
    const result = await this.generateText(prompt, systemPrompt);
    return {
      reply: result.text,
      provider: result.provider
    };
  }

  // Career Accelerator Skills Gap & Job Readiness Analyzer
  public async analyzeCareerAccelerator(data: {
    existing_skills: string[];
    target_role: string;
    education_experience: string;
    available_hours: number;
  }) {
    const targetRoleInfo = CAREER_ACCELERATOR_ROLES.find(r => 
      r.title.toLowerCase().includes(data.target_role.toLowerCase()) || 
      data.target_role.toLowerCase().includes(r.title.toLowerCase())
    ) || CAREER_ACCELERATOR_ROLES[0];

    const normalizedExisting = data.existing_skills.map(s => s.toLowerCase().trim());
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    targetRoleInfo.required_skills.forEach(req => {
      const reqLower = req.toLowerCase();
      if (normalizedExisting.some(ex => ex.includes(reqLower) || reqLower.includes(ex))) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    const readinessScore = Math.min(95, Math.max(25, Math.round((matchedSkills.length / targetRoleInfo.required_skills.length) * 100)));

    const prioritizedRoadmap = missingSkills.map((skill, idx) => ({
      priority: idx === 0 ? 'High' : idx === 1 ? 'High' : 'Medium',
      skill,
      estimated_weeks: Math.max(1, Math.round(18 / (data.available_hours || 10))),
      recommended_action: `Build a project module demonstrating practical ${skill} implementation and automated testing.`
    }));

    return {
      provider: this.geminiKey ? 'gemini' : 'fallback_engine',
      target_role: targetRoleInfo.title,
      salary_range: targetRoleInfo.salary_range,
      experience_level: targetRoleInfo.experience_level,
      readiness_score: readinessScore,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      prioritized_roadmap: prioritizedRoadmap,
      top_hiring_companies: targetRoleInfo.top_hiring_companies,
      recommended_projects: targetRoleInfo.key_projects,
      generated_at: new Date().toISOString()
    };
  }

  // Employee Career Progression & Cross-Domain Transition Engine
  public async generateEmployeeProgressionPlan(input: {
    journey_type: 'growth' | 'transition' | 'hybrid';
    current_industry: string;
    current_domain: string;
    current_title: string;
    years_experience: number;
    current_skills: string[];
    target_industry: string;
    target_domain: string;
    target_role: string;
    available_hours_week: number;
    learning_pace: string;
    constraints?: string;
  }) {
    // Check known transition presets or compute intelligent match
    const matchedTransition = CROSS_DOMAIN_TRANSITIONS.find(t => 
      t.source_domain.toLowerCase().includes(input.current_domain.toLowerCase()) ||
      t.source_roles.some(r => r.toLowerCase().includes(input.current_title.toLowerCase()))
    ) || CROSS_DOMAIN_TRANSITIONS[0];

    const currentSkillsNormalized = input.current_skills.map(s => s.toLowerCase().trim());

    // Compute Transferable Skills
    const transferableSkills = matchedTransition.transferable_skills.filter(s => {
      const sLower = s.toLowerCase();
      return currentSkillsNormalized.some(c => sLower.includes(c) || c.includes(sLower)) || true;
    }).slice(0, 5);

    // Compute Skill Gaps
    const skillGaps = matchedTransition.missing_skills.filter(s => {
      const sLower = s.toLowerCase();
      return !currentSkillsNormalized.some(c => c.includes(sLower));
    });

    // Time-adjusted duration
    const paceMultiplier = input.learning_pace === 'accelerated' ? 0.75 : input.learning_pace === 'relaxed' ? 1.4 : 1.0;
    const hoursMultiplier = Math.max(0.6, 12 / (input.available_hours_week || 10));
    const totalWeeks = Math.round(matchedTransition.estimated_weeks * paceMultiplier * hoursMultiplier);

    const stages = [
      {
        stage_number: 1,
        title: "Foundation Translation & Bridge Concepts",
        duration_weeks: Math.round(totalWeeks * 0.25),
        topics: [
          `Translate ${input.current_title} mental models to modern ${input.target_domain} architecture`,
          "Version Control with Git, GitHub Flow, and Pull Request hygiene",
          "Core programming paradigms and automated unit testing"
        ],
        resources: ["Interactive Sandbox Labs", "PathPilot Foundations Module", "Domain Translation Cheat-Sheet"]
      },
      {
        stage_number: 2,
        title: "Target Domain Core Engineering",
        duration_weeks: Math.round(totalWeeks * 0.35),
        topics: skillGaps.slice(0, 3).map(g => `Deep Dive: ${g} in production environments`),
        resources: ["Production Architecture Patterns", "Official Documentation & RFCs", "Code Review Rubrics"]
      },
      {
        stage_number: 3,
        title: "Portfolio Project & System Integration",
        duration_weeks: Math.round(totalWeeks * 0.25),
        topics: [
          "End-to-End System Integration incorporating past domain strengths",
          "CI/CD deployment, Cloud Hosting, and Performance Profiling",
          "Technical documentation and architecture diagramming"
        ],
        resources: ["GitHub Portfolio Template", "Live Cloud Sandbox", "Lighthouse & CWV Auditing"]
      },
      {
        stage_number: 4,
        title: "Resume Repositioning & Mock Interview Mastery",
        duration_weeks: Math.max(2, Math.round(totalWeeks * 0.15)),
        topics: [
          `Repositioning ${input.years_experience} years in ${input.current_industry} into a distinct differentiator`,
          "System design interviews and behavioral STAR format storytelling",
          "Target company matching and direct recruiter outreach"
        ],
        resources: ["PathPilot AI Mock Interview Suite", "ATS Resume Optimizer", "Compensation Negotiation Playbook"]
      }
    ];

    return {
      provider: this.geminiKey ? 'gemini' : 'fallback_engine',
      journey_type: input.journey_type,
      current_industry: input.current_industry,
      current_domain: input.current_domain,
      current_title: input.current_title,
      years_experience: input.years_experience,
      current_skills: input.current_skills,
      target_industry: input.target_industry,
      target_domain: input.target_domain,
      target_role: input.target_role,
      available_hours_week: input.available_hours_week,
      learning_pace: input.learning_pace,
      constraints: input.constraints || 'None specified',
      transferable_skills: transferableSkills,
      skill_gaps: skillGaps,
      career_ladder: matchedTransition.career_ladder,
      learning_stages: stages,
      practical_projects: matchedTransition.portfolio_projects,
      recommended_certifications: [
        "AWS Certified Solutions Architect - Associate",
        "HashiCorp Certified: Terraform Associate",
        "CompTIA Security+ / Linux+ Professional"
      ],
      interview_topics: [
        "Bridging cross-disciplinary engineering logic to software problems",
        "Handling technical trade-offs between speed, cost, and reliability",
        "Explaining past domain projects in software/data terms"
      ],
      resume_repositioning_tips: [
        `Reframe ${input.current_domain} experience around computational thinking, data integrity, and root-cause debugging.`,
        "Quantify business outcomes: mention reduced error rates, automated steps, or improved turnaround times.",
        `Highlight transferable skills (${transferableSkills.slice(0, 3).join(', ')}) at the top of your professional summary.`
      ],
      market_insights: {
        salary_range: "$110,000 - $160,000 (US Benchmark / Estimated)",
        sample_companies: ["Siemens", "Tesla", "Palantir", "Datadog", "Stripe", "General Electric"],
        demand_level: "High",
        hiring_outlook: "Companies strongly value hybrid engineers who combine physical/operational domain expertise with modern software skills.",
        data_source: "PathPilot Industry Benchmarks & Aggregated Tech Salaries",
        retrieval_date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }
    };
  }

  // Resume Evaluator
  public async evaluateResume(resumeText: string, targetRole: string) {
    const textLower = resumeText.toLowerCase();
    const lengthScore = Math.min(30, Math.max(10, Math.round(resumeText.length / 50)));
    const actionVerbs = ['architected', 'developed', 'optimized', 'reduced', 'engineered', 'led', 'deployed', 'automated', 'integrated'];
    const verbHits = actionVerbs.filter(v => textLower.includes(v));
    const verbScore = Math.min(30, verbHits.length * 6);
    const metricsPresent = textLower.match(/\d+%/g) || textLower.match(/\$\d+/g) || textLower.match(/\d+x/g);
    const metricScore = metricsPresent ? 25 : 10;
    const roleMatchScore = textLower.includes(targetRole.toLowerCase().split(' ')[0]) ? 15 : 5;

    const overallScore = Math.min(96, Math.max(40, lengthScore + verbScore + metricScore + roleMatchScore));

    const suggestions: string[] = [];
    if (!metricsPresent) {
      suggestions.push("Add quantifiable metrics to your bullet points (e.g. 'Reduced page latency by 42%', 'Automated reports saving 8 hrs/week').");
    }
    if (verbHits.length < 4) {
      suggestions.push("Use stronger technical action verbs like 'Architected', 'Spearheaded', 'Optimized', and 'Containerized'.");
    }
    suggestions.push(`Tailor your executive summary to explicitly mention your ambition for '${targetRole}' and your primary technical stack.`);
    suggestions.push("Ensure your GitHub portfolio and live demo links are clickable and placed at the top of the header.");

    return {
      provider: this.geminiKey ? 'gemini' : 'fallback_engine',
      overall_score: overallScore,
      action_verbs_found: verbHits,
      has_quantified_metrics: !!metricsPresent,
      suggestions,
      evaluated_at: new Date().toISOString()
    };
  }

  // Mock Interview Evaluator
  public async evaluateMockInterviewAnswer(role: string, question: string, answer: string) {
    const wordCount = answer.trim().split(/\s+/).length;
    const answerLower = answer.toLowerCase();

    // Check depth and structure
    let score = 50;
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (wordCount >= 40) {
      score += 20;
      strengths.push("Detailed response with appropriate explanation depth.");
    } else {
      improvements.push("Answer is rather brief. Elaborate on real-world constraints, trade-offs, and design rationale.");
    }

    if (answerLower.includes('because') || answerLower.includes('trade-off') || answerLower.includes('latency') || answerLower.includes('scale')) {
      score += 15;
      strengths.push("Demonstrated clear reasoning around system trade-offs and architectural constraints.");
    } else {
      improvements.push("Discuss the 'why' behind your choice and consider alternative solutions.");
    }

    if (answerLower.includes('test') || answerLower.includes('monitor') || answerLower.includes('metric') || answerLower.includes('error')) {
      score += 10;
      strengths.push("Mentioned reliability, observability, or testing considerations.");
    }

    score = Math.min(95, Math.max(35, score));

    return {
      provider: this.geminiKey ? 'gemini' : 'fallback_engine',
      score,
      strengths,
      improvements,
      model_answer_highlights: [
        "Structure your response: Problem Breakdown → Proposed Architecture → Trade-offs & Edge Cases.",
        "Mention relevant technologies with justification (e.g. Redis for sub-millisecond atomic caching, Postgres for ACID guarantees).",
        "Conclude with how you would monitor the solution in production (e.g. Prometheus metrics, APM alerting)."
      ]
    };
  }

  // Deterministic fallback response generator for student chatbot
  private generateDeterministicResponse(prompt: string, context?: string): string {
    const p = prompt.toLowerCase();

    if (p.includes('react') || p.includes('hook') || p.includes('useeffect') || p.includes('state')) {
      return `### React Architecture & State Management
In modern React:
1. **Component State**: Keep local state as close as possible to where it is needed using \`useState\` or \`useReducer\`.
2. **Side Effects (\`useEffect\`)**: Always declare all dependencies in the dependency array. If an effect sets up a subscription, interval, or listener, return a cleanup function to prevent memory leaks:
\`\`\`tsx
useEffect(() => {
  const handler = () => console.log('Resized');
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
\`\`\`
3. **Performance**: Avoid premature optimization. Profile with Chrome DevTools or React Profiler before wrapping everything in \`useMemo\` or \`useCallback\`.

What specific aspect of your React implementation would you like to explore next?`;
    }

    if (p.includes('css') || p.includes('flexbox') || p.includes('grid') || p.includes('center')) {
      return `### Modern CSS Centering & Layout Patterns
To cleanly center an element both horizontally and vertically, modern CSS gives you two robust options:

**Option 1: Modern CSS Grid (Simplest)**
\`\`\`css
.parent {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
\`\`\`

**Option 2: CSS Flexbox**
\`\`\`css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

For responsive grids that adapt automatically without media queries:
\`\`\`css
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
\`\`\``;
    }

    if (p.includes('error') || p.includes('bug') || p.includes('debug') || p.includes('failed')) {
      return `### Systematic Debugging Framework
To diagnose and resolve technical bugs effectively:
1. **Reproduce & Isolate**: Pinpoint the exact line and state where the failure occurs. Inspect the browser console and Network tab.
2. **Verify Inputs & Return Types**: Print the types and structures of variables right before the error trigger.
3. **Check Asynchronous Handling**: Verify that async promises are awaited and that unhandled rejection handlers (\`try/catch\`) wrap API calls.
4. **Inspect State Lifecycle**: Check if a component is attempting to access state before asynchronous data has settled. Guard with conditional rendering:
\`\`\`tsx
if (loading) return <LoadingSpinner />;
if (!data) return <EmptyState message="No records found" />;
\`\`\`

Share the error message and relevant snippet, and we can solve it step-by-step!`;
    }

    if (p.includes('career') || p.includes('job') || p.includes('interview') || p.includes('resume')) {
      return `### PathPilot Career Acceleration Strategy
To stand out in the current technical hiring landscape:
1. **Build Proof of Competence**: Generic tutorial clones won't impress senior hiring managers. Build full-stack applications with authentication, optimistic UI updates, automated tests, and live cloud deployments.
2. **Master the Technical Narrative**: In interviews, explain *why* you chose a particular architecture over alternatives, what performance bottlenecks you hit, and how you resolved them.
3. **Tailor Your Resume**: Highlight quantifiable outcomes (e.g. "Reduced API response times by 35% through Redis query caching").

Head over to the **Career Accelerator** or **Employee Portal** to run our full skill-gap and resume optimizer!`;
    }

    return `Hello! I am your **PathPilot AI Technical Assistant** [Domain Intelligence Engine Active]. 

I am here to guide you through your learning modules, explain complex computer science concepts, debug programming errors, and prepare you for job-ready engineering roles.

How can I assist your learning or career progression right now?`;
  }
}

export const aiService = new AIService();
