export type UserRole = 'admin' | 'student' | 'employee';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: 'active' | 'suspended';
  created_at?: string;
  last_active_at?: string;
  is_online?: boolean;
}

export interface Domain {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  badge?: string;
  color?: string;
  estimated_duration: string;
  is_active: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  code_example?: string;
  resources?: Array<{ title: string; url: string }>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  passing_percentage: number;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  path_id: string;
  domain_id: string;
  order_index: number;
  title: string;
  description: string;
  estimated_hours: number;
  skills_taught: string[];
  passing_score: number;
  lessons: Lesson[];
  quiz?: Quiz;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  module_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  feedback: string;
  created_at: string;
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  module_id: string;
  domain_id: string;
  completed: boolean;
  score?: number;
  completed_at?: string;
}

export interface SkillGapAnalysis {
  provider: string;
  target_role: string;
  salary_range: string;
  experience_level: string;
  readiness_score: number;
  matched_skills: string[];
  missing_skills: string[];
  prioritized_roadmap: Array<{
    priority: string;
    skill: string;
    estimated_weeks: number;
    recommended_action: string;
  }>;
  top_hiring_companies: string[];
  recommended_projects: string[];
  generated_at: string;
}

export interface CareerLadderStep {
  stage: string;
  title: string;
  focus: string;
}

export interface LearningStage {
  stage_number: number;
  title: string;
  duration_weeks: number;
  topics: string[];
  resources: string[];
}

export interface EmployeeCareerPlan {
  id?: string;
  user_id?: string;
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
  transferable_skills: string[];
  skill_gaps: string[];
  career_ladder: CareerLadderStep[];
  learning_stages: LearningStage[];
  practical_projects: Array<{ title: string; description: string }>;
  recommended_certifications: string[];
  interview_topics: string[];
  resume_repositioning_tips: string[];
  market_insights: {
    salary_range: string;
    sample_companies: string[];
    demand_level: string;
    hiring_outlook: string;
    data_source: string;
    retrieval_date: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface SystemAnalytics {
  totalStudents: number;
  totalEmployees: number;
  totalAdmins: number;
  totalUsers: number;
  onlineUsersCount: number;
  offlineUsersCount: number;
  activeLearningPaths: number;
  totalModules: number;
  totalCompletions: number;
  totalQuizAttempts: number;
  passedQuizAttempts: number;
  quizPassRate: number;
  averageScore: number;
  recentUsers: User[];
  recentActivity: Array<{
    id: string;
    user_email: string;
    action: string;
    details: string;
    timestamp: string;
  }>;
  aiProviderStatus: {
    configured_provider: string;
    gemini_configured: boolean;
    ollama_configured: boolean;
    fallback_engine_status: string;
  };
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  target_type: string;
  target_id: string;
  details: string;
  timestamp: string;
}
