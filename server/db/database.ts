import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  INITIAL_DOMAINS, 
  INITIAL_MODULES, 
  CAREER_ACCELERATOR_ROLES, 
  CROSS_DOMAIN_TRANSITIONS, 
  MOCK_INTERVIEW_QUESTIONS 
} from './seedData.js';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  salt: string;
  full_name: string;
  role: 'admin' | 'student' | 'employee';
  status: 'active' | 'suspended';
  created_at: string;
  last_active_at: string;
}

export interface Profile {
  user_id: string;
  current_domain?: string;
  target_role?: string;
  experience_years?: number;
  current_title?: string;
  bio?: string;
  skills?: string[];
  learning_pace?: string;
  available_hours?: number;
  updated_at: string;
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
  answers: Record<string, number>;
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

export interface EmployeeCareerPlan {
  id: string;
  user_id: string;
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
  career_ladder: Array<{ stage: string; title: string; focus: string }>;
  learning_stages: Array<{
    stage_number: number;
    title: string;
    duration_weeks: number;
    topics: string[];
    resources: string[];
  }>;
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
  created_at: string;
  updated_at: string;
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

export interface PlatformSettings {
  ai_provider: string;
  allow_registration: boolean;
  maintenance_mode: boolean;
  heartbeat_timeout_seconds: number;
  passing_grade_threshold: number;
}

interface DatabaseSchema {
  users: User[];
  profiles: Profile[];
  domains: any[];
  modules: any[];
  quiz_attempts: QuizAttempt[];
  progress_records: ProgressRecord[];
  employee_career_plans: EmployeeCareerPlan[];
  audit_logs: AuditLog[];
  settings: PlatformSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'db', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helpers
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
}

class DatabaseService {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error loading DB file, rebuilding from seed:', err);
      }
    }
    return this.initializeSeed();
  }

  private saveDatabase(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing database to disk:', err);
    }
  }

  private initializeSeed(): DatabaseSchema {
    const adminPass = hashPassword('AdminSecurePass2026!');
    const studentPass = hashPassword('StudentPass2026!');
    const employeePass = hashPassword('EmployeePass2026!');

    const now = new Date().toISOString();

    const seedUsers: User[] = [
      {
        id: 'usr-admin-01',
        email: 'admin@pathpilot.ai',
        password_hash: adminPass.hash,
        salt: adminPass.salt,
        full_name: 'Dr. Evelyn Vance (Chief Admin)',
        role: 'admin',
        status: 'active',
        created_at: now,
        last_active_at: now,
      },
      {
        id: 'usr-student-01',
        email: 'alex.student@pathpilot.ai',
        password_hash: studentPass.hash,
        salt: studentPass.salt,
        full_name: 'Alex Rivera (Aspiring Developer)',
        role: 'student',
        status: 'active',
        created_at: now,
        last_active_at: now,
      },
      {
        id: 'usr-employee-01',
        email: 'sarah.employee@pathpilot.ai',
        password_hash: employeePass.hash,
        salt: employeePass.salt,
        full_name: 'Sarah Chen (Mid Hardware Engineer)',
        role: 'employee',
        status: 'active',
        created_at: now,
        last_active_at: now,
      }
    ];

    const initialSchema: DatabaseSchema = {
      users: seedUsers,
      profiles: [
        {
          user_id: 'usr-student-01',
          current_domain: 'Web Development',
          target_role: 'Full Stack Engineer',
          learning_pace: 'moderate',
          available_hours: 15,
          skills: ['HTML5', 'CSS3', 'Basic JS'],
          updated_at: now,
        },
        {
          user_id: 'usr-employee-01',
          current_domain: 'Hardware Engineering',
          current_title: 'Hardware Engineer',
          experience_years: 3,
          target_role: 'Full Stack / Systems Engineer',
          learning_pace: 'accelerated',
          available_hours: 12,
          skills: ['Circuit Design', 'C++', 'Oscilloscopes', 'PCB Layout'],
          updated_at: now,
        }
      ],
      domains: INITIAL_DOMAINS,
      modules: INITIAL_MODULES,
      quiz_attempts: [
        {
          id: 'att-demo-01',
          user_id: 'usr-student-01',
          quiz_id: 'quiz-web-01',
          module_id: 'mod-web-01',
          score: 3,
          total_questions: 3,
          percentage: 100,
          passed: true,
          answers: { 'q-web-01-1': 2, 'q-web-01-2': 1, 'q-web-01-3': 0 },
          feedback: 'Outstanding mastery of semantic HTML and accessibility!',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      progress_records: [
        {
          id: 'prog-demo-01',
          user_id: 'usr-student-01',
          module_id: 'mod-web-01',
          domain_id: 'domain-web-dev',
          completed: true,
          score: 100,
          completed_at: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      employee_career_plans: [],
      audit_logs: [
        {
          id: 'log-init-01',
          user_id: 'usr-admin-01',
          user_email: 'admin@pathpilot.ai',
          action: 'PLATFORM_INITIALIZATION',
          target_type: 'SYSTEM',
          target_id: 'ALL',
          details: 'Initialized PathPilot AI with core curricula and demo profiles.',
          timestamp: now
        }
      ],
      settings: {
        ai_provider: 'auto',
        allow_registration: true,
        maintenance_mode: false,
        heartbeat_timeout_seconds: 120,
        passing_grade_threshold: 80
      }
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialSchema, null, 2), 'utf-8');
    return initialSchema;
  }

  // --- User Operations ---
  public getUsers(): User[] {
    return this.db.users;
  }

  public findUserByEmail(email: string): User | undefined {
    return this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.db.users.find(u => u.id === id);
  }

  public createUser(userData: { email: string; password: string; full_name: string; role: 'admin' | 'student' | 'employee' }): User {
    const { hash, salt } = hashPassword(userData.password);
    const now = new Date().toISOString();
    const newUser: User = {
      id: `usr-${crypto.randomBytes(4).toString('hex')}`,
      email: userData.email.toLowerCase().trim(),
      password_hash: hash,
      salt,
      full_name: userData.full_name.trim(),
      role: userData.role,
      status: 'active',
      created_at: now,
      last_active_at: now,
    };
    this.db.users.push(newUser);
    this.logAction(newUser.id, newUser.email, 'USER_REGISTERED', 'USER', newUser.id, `New ${newUser.role} user created`);
    this.saveDatabase();
    return newUser;
  }

  public updateUserStatus(userId: string, status: 'active' | 'suspended', adminUser: User): User | undefined {
    const user = this.findUserById(userId);
    if (!user) return undefined;
    user.status = status;
    this.logAction(adminUser.id, adminUser.email, 'USER_STATUS_CHANGE', 'USER', user.id, `Account status changed to ${status}`);
    this.saveDatabase();
    return user;
  }

  public recordHeartbeat(userId: string): void {
    const user = this.findUserById(userId);
    if (user) {
      user.last_active_at = new Date().toISOString();
      this.saveDatabase();
    }
  }

  public getOnlineStatusUsers(timeoutMs: number = 120000): { onlineCount: number; offlineCount: number; onlineUsers: User[]; offlineUsers: User[] } {
    const now = Date.now();
    const onlineUsers: User[] = [];
    const offlineUsers: User[] = [];

    for (const u of this.db.users) {
      const lastActive = new Date(u.last_active_at).getTime();
      if (now - lastActive <= timeoutMs) {
        onlineUsers.push(u);
      } else {
        offlineUsers.push(u);
      }
    }

    return {
      onlineCount: onlineUsers.length,
      offlineCount: offlineUsers.length,
      onlineUsers,
      offlineUsers
    };
  }

  // --- Profile Operations ---
  public getProfile(userId: string): Profile | undefined {
    return this.db.profiles.find(p => p.user_id === userId);
  }

  public saveProfile(profileData: Partial<Profile> & { user_id: string }): Profile {
    const idx = this.db.profiles.findIndex(p => p.user_id === profileData.user_id);
    const updated: Profile = {
      user_id: profileData.user_id,
      current_domain: profileData.current_domain || '',
      target_role: profileData.target_role || '',
      experience_years: profileData.experience_years || 0,
      current_title: profileData.current_title || '',
      bio: profileData.bio || '',
      skills: profileData.skills || [],
      learning_pace: profileData.learning_pace || 'moderate',
      available_hours: profileData.available_hours || 10,
      updated_at: new Date().toISOString()
    };

    if (idx >= 0) {
      this.db.profiles[idx] = { ...this.db.profiles[idx], ...updated };
    } else {
      this.db.profiles.push(updated);
    }
    this.saveDatabase();
    return updated;
  }

  // --- Curriculum Operations ---
  public getDomains() {
    return this.db.domains;
  }

  public getDomainById(id: string) {
    return this.db.domains.find(d => d.id === id || d.slug === id);
  }

  public createDomain(domainData: any, adminUser: User) {
    const newDomain = {
      id: `domain-${crypto.randomBytes(3).toString('hex')}`,
      ...domainData,
      is_active: domainData.is_active !== undefined ? domainData.is_active : true
    };
    this.db.domains.push(newDomain);
    this.logAction(adminUser.id, adminUser.email, 'DOMAIN_CREATED', 'DOMAIN', newDomain.id, `Created domain: ${newDomain.title}`);
    this.saveDatabase();
    return newDomain;
  }

  public updateDomain(id: string, domainData: any, adminUser: User) {
    const idx = this.db.domains.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.db.domains[idx] = { ...this.db.domains[idx], ...domainData };
    this.logAction(adminUser.id, adminUser.email, 'DOMAIN_UPDATED', 'DOMAIN', id, `Updated domain details`);
    this.saveDatabase();
    return this.db.domains[idx];
  }

  public deleteDomain(id: string, adminUser: User) {
    const idx = this.db.domains.findIndex(d => d.id === id);
    if (idx === -1) return false;
    this.db.domains.splice(idx, 1);
    this.logAction(adminUser.id, adminUser.email, 'DOMAIN_DELETED', 'DOMAIN', id, `Deleted domain`);
    this.saveDatabase();
    return true;
  }

  public getModules(domainId?: string) {
    if (domainId) {
      return this.db.modules.filter(m => m.domain_id === domainId);
    }
    return this.db.modules;
  }

  public getModuleById(id: string) {
    return this.db.modules.find(m => m.id === id);
  }

  public saveModule(moduleData: any, adminUser: User) {
    const idx = this.db.modules.findIndex(m => m.id === moduleData.id);
    if (idx >= 0) {
      this.db.modules[idx] = { ...this.db.modules[idx], ...moduleData };
      this.logAction(adminUser.id, adminUser.email, 'MODULE_UPDATED', 'MODULE', moduleData.id, `Updated module ${moduleData.title}`);
    } else {
      const newModule = {
        id: moduleData.id || `mod-${crypto.randomBytes(3).toString('hex')}`,
        ...moduleData
      };
      this.db.modules.push(newModule);
      this.logAction(adminUser.id, adminUser.email, 'MODULE_CREATED', 'MODULE', newModule.id, `Created module ${newModule.title}`);
    }
    this.saveDatabase();
  }

  public deleteModule(id: string, adminUser: User) {
    const idx = this.db.modules.findIndex(m => m.id === id);
    if (idx === -1) return false;
    this.db.modules.splice(idx, 1);
    this.logAction(adminUser.id, adminUser.email, 'MODULE_DELETED', 'MODULE', id, `Deleted module`);
    this.saveDatabase();
    return true;
  }

  // --- Quiz Attempts & Progress ---
  public recordQuizAttempt(data: Omit<QuizAttempt, 'id' | 'created_at'>): QuizAttempt {
    const attempt: QuizAttempt = {
      id: `att-${crypto.randomBytes(4).toString('hex')}`,
      ...data,
      created_at: new Date().toISOString()
    };
    this.db.quiz_attempts.push(attempt);

    if (attempt.passed) {
      this.markModuleComplete(attempt.user_id, attempt.module_id, attempt.percentage);
    }

    this.saveDatabase();
    return attempt;
  }

  public markModuleComplete(userId: string, moduleId: string, score: number) {
    const module = this.getModuleById(moduleId);
    const domainId = module?.domain_id || '';
    const existing = this.db.progress_records.find(p => p.user_id === userId && p.module_id === moduleId);
    if (existing) {
      existing.completed = true;
      existing.score = Math.max(existing.score || 0, score);
      existing.completed_at = new Date().toISOString();
    } else {
      this.db.progress_records.push({
        id: `prog-${crypto.randomBytes(4).toString('hex')}`,
        user_id: userId,
        module_id: moduleId,
        domain_id: domainId,
        completed: true,
        score,
        completed_at: new Date().toISOString()
      });
    }
    this.saveDatabase();
  }

  public getUserProgress(userId: string) {
    return this.db.progress_records.filter(p => p.user_id === userId);
  }

  public getUserQuizAttempts(userId: string) {
    return this.db.quiz_attempts.filter(a => a.user_id === userId);
  }

  public getAllQuizAttempts() {
    return this.db.quiz_attempts;
  }

  // --- Employee Career Plans ---
  public saveEmployeePlan(plan: Omit<EmployeeCareerPlan, 'id' | 'created_at' | 'updated_at'> & { id?: string }): EmployeeCareerPlan {
    const now = new Date().toISOString();
    const existingIndex = this.db.employee_career_plans.findIndex(p => p.user_id === plan.user_id && p.journey_type === plan.journey_type);

    let savedPlan: EmployeeCareerPlan;
    if (existingIndex >= 0) {
      savedPlan = {
        ...this.db.employee_career_plans[existingIndex],
        ...plan,
        updated_at: now
      };
      this.db.employee_career_plans[existingIndex] = savedPlan;
    } else {
      savedPlan = {
        id: `plan-${crypto.randomBytes(4).toString('hex')}`,
        ...plan,
        created_at: now,
        updated_at: now
      };
      this.db.employee_career_plans.push(savedPlan);
    }
    this.saveDatabase();
    return savedPlan;
  }

  public getEmployeePlan(userId: string, journeyType?: string) {
    if (journeyType) {
      return this.db.employee_career_plans.find(p => p.user_id === userId && p.journey_type === journeyType);
    }
    return this.db.employee_career_plans.find(p => p.user_id === userId);
  }

  // --- Audit Logs & Platform Settings ---
  public logAction(userId: string, userEmail: string, action: string, targetType: string, targetId: string, details: string) {
    const log: AuditLog = {
      id: `log-${crypto.randomBytes(4).toString('hex')}`,
      user_id: userId,
      user_email: userEmail,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      timestamp: new Date().toISOString()
    };
    this.db.audit_logs.unshift(log);
    if (this.db.audit_logs.length > 500) {
      this.db.audit_logs.pop();
    }
    this.saveDatabase();
  }

  public getAuditLogs(limit: number = 50) {
    return this.db.audit_logs.slice(0, limit);
  }

  public getSettings(): PlatformSettings {
    return this.db.settings;
  }

  public updateSettings(settings: Partial<PlatformSettings>, adminUser: User): PlatformSettings {
    this.db.settings = { ...this.db.settings, ...settings };
    this.logAction(adminUser.id, adminUser.email, 'SETTINGS_UPDATED', 'SETTINGS', 'ALL', JSON.stringify(settings));
    this.saveDatabase();
    return this.db.settings;
  }

  public getSystemAnalytics() {
    const totalStudents = this.db.users.filter(u => u.role === 'student').length;
    const totalEmployees = this.db.users.filter(u => u.role === 'employee').length;
    const totalAdmins = this.db.users.filter(u => u.role === 'admin').length;
    const presence = this.getOnlineStatusUsers(120000);

    const totalModules = this.db.modules.length;
    const totalCompletions = this.db.progress_records.filter(p => p.completed).length;
    const totalQuizAttempts = this.db.quiz_attempts.length;
    const passedAttempts = this.db.quiz_attempts.filter(a => a.passed).length;
    const averageScore = totalQuizAttempts > 0 
      ? Math.round(this.db.quiz_attempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizAttempts) 
      : 0;

    return {
      totalStudents,
      totalEmployees,
      totalAdmins,
      totalUsers: this.db.users.length,
      onlineUsersCount: presence.onlineCount,
      offlineUsersCount: presence.offlineCount,
      activeLearningPaths: this.db.domains.length,
      totalModules,
      totalCompletions,
      totalQuizAttempts,
      passedQuizAttempts: passedAttempts,
      quizPassRate: totalQuizAttempts > 0 ? Math.round((passedAttempts / totalQuizAttempts) * 100) : 0,
      averageScore,
      recentUsers: this.db.users.slice(-5).reverse().map(u => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        status: u.status,
        last_active_at: u.last_active_at
      })),
      recentActivity: this.db.audit_logs.slice(0, 8),
      aiProviderStatus: {
        configured_provider: process.env.AI_PROVIDER || 'auto',
        gemini_configured: !!process.env.GEMINI_API_KEY,
        ollama_configured: !!process.env.OLLAMA_BASE_URL,
        fallback_engine_status: 'operational',
      }
    };
  }
}

export const db = new DatabaseService();
