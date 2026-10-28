import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, verifyPassword, User } from './db/database.js';
import { aiService } from './services/aiService.js';
import { MOCK_INTERVIEW_QUESTIONS, CROSS_DOMAIN_TRANSITIONS, CAREER_ACCELERATOR_ROLES } from './db/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// In-memory token session map for simple, robust deployment-ready session management
const SESSIONS = new Map<string, { userId: string; role: string; email: string; expiresAt: number }>();

function createSessionToken(user: User): string {
  const token = `tok_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  // 7 days expiration
  SESSIONS.set(token, {
    userId: user.id,
    role: user.role,
    email: user.email,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
  });
  return token;
}

// Authentication middleware
interface AuthenticatedRequest extends Request {
  user?: User;
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  const session = SESSIONS.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) SESSIONS.delete(token);
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  const user = db.findUserById(session.userId);
  if (!user || user.status === 'suspended') {
    return res.status(403).json({ error: 'User account suspended or not found.' });
  }

  req.user = user;
  db.recordHeartbeat(user.id);
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access privileges required.' });
    }
    next();
  });
}

// -------------------------------------------------------------
// HEALTH ENDPOINT
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    ai_status: aiService.getStatus(),
    db_status: 'operational'
  });
});

// -------------------------------------------------------------
// AUTHENTICATION ROUTES
// -------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }

    const assignedRole = role === 'admin' ? 'admin' : role === 'employee' ? 'employee' : 'student';

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const newUser = db.createUser({
      email,
      password,
      full_name,
      role: assignedRole
    });

    const token = createSessionToken(newUser);
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        status: newUser.status
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended by an administrator.' });
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    db.recordHeartbeat(user.id);
    const token = createSessionToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Quick Demo Login for instant testing by evaluators/judges
app.post('/api/auth/demo', (req, res) => {
  try {
    const { role } = req.body;
    const targetEmail = role === 'admin' 
      ? 'admin@pathpilot.ai' 
      : role === 'employee' 
      ? 'sarah.employee@pathpilot.ai' 
      : 'alex.student@pathpilot.ai';

    const user = db.findUserByEmail(targetEmail);
    if (!user) {
      return res.status(404).json({ error: 'Demo user not found.' });
    }

    db.recordHeartbeat(user.id);
    const token = createSessionToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  res.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
      last_active_at: user.last_active_at
    }
  });
});

app.post('/api/auth/heartbeat', requireAuth, (req: AuthenticatedRequest, res) => {
  db.recordHeartbeat(req.user!.id);
  res.json({ success: true, timestamp: new Date().toISOString() });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    SESSIONS.delete(token);
  }
  res.json({ success: true });
});

// -------------------------------------------------------------
// ADMIN PORTAL ROUTES (Server-side Role Verification)
// -------------------------------------------------------------
app.get('/api/admin/analytics', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const analytics = db.getSystemAnalytics();
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/users', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const { role, query } = req.query;
    let users = db.getUsers().map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      status: u.status,
      created_at: u.created_at,
      last_active_at: u.last_active_at,
      is_online: (Date.now() - new Date(u.last_active_at).getTime()) <= 120000
    }));

    if (role && role !== 'all') {
      users = users.filter(u => u.role === role);
    }
    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      users = users.filter(u => u.email.toLowerCase().includes(q) || u.full_name.toLowerCase().includes(q));
    }

    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/users/:id/status', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const { status } = req.body;
    if (status !== 'active' && status !== 'suspended') {
      return res.status(400).json({ error: 'Status must be active or suspended.' });
    }
    const updated = db.updateUserStatus(req.params.id as string, status, req.user!);
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/curriculum', requireAdmin, (req, res) => {
  try {
    const domains = db.getDomains();
    const modules = db.getModules();
    res.json({ domains, modules });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/domains', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const newDomain = db.createDomain(req.body, req.user!);
    res.status(201).json(newDomain);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/domains/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updateDomain(req.params.id as string, req.body, req.user!);
    if (!updated) return res.status(404).json({ error: 'Domain not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/domains/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const success = db.deleteDomain(req.params.id as string, req.user!);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/modules', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    db.saveModule(req.body, req.user!);
    res.json({ success: true, module: req.body });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/modules/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const success = db.deleteModule(req.params.id as string, req.user!);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/audit-logs', requireAdmin, (req, res) => {
  try {
    const logs = db.getAuditLogs(100);
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/settings', requireAdmin, (req, res) => {
  res.json(db.getSettings());
});

app.post('/api/admin/settings', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updateSettings(req.body, req.user!);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// STUDENT PORTAL ROUTES
// -------------------------------------------------------------
app.get('/api/student/domains', (req, res) => {
  try {
    const domains = db.getDomains().filter(d => d.is_active);
    res.json(domains);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/student/modules/:domainId', (req, res) => {
  try {
    const modules = db.getModules(req.params.domainId as string);
    res.json(modules);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/student/progress', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const progress = db.getUserProgress(req.user!.id);
    const quizAttempts = db.getUserQuizAttempts(req.user!.id);
    res.json({ progress, quizAttempts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/student/quiz/submit', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { moduleId, quizId, answers } = req.body;
    const module = db.getModuleById(moduleId);
    if (!module || !module.quiz) {
      return res.status(404).json({ error: 'Quiz not found for this module.' });
    }

    const quiz = module.quiz;
    let score = 0;
    const totalQuestions = quiz.questions.length;
    const questionFeedback: any[] = [];

    quiz.questions.forEach((q: any) => {
      const selectedOption = answers[q.id];
      const isCorrect = selectedOption === q.correct_index;
      if (isCorrect) score += 1;
      questionFeedback.push({
        questionId: q.id,
        isCorrect,
        correctIndex: q.correct_index,
        explanation: q.explanation
      });
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= (quiz.passing_percentage || 80);

    const feedback = passed
      ? `Great job! You achieved ${percentage}% and unlocked the next curriculum stage.`
      : `You scored ${percentage}%. Review the core concepts and test your knowledge again to proceed.`;

    const attempt = db.recordQuizAttempt({
      user_id: req.user!.id,
      quiz_id: quizId || quiz.id,
      module_id: moduleId,
      score,
      total_questions: totalQuestions,
      percentage,
      passed,
      answers,
      feedback
    });

    res.json({
      attempt,
      passed,
      percentage,
      score,
      totalQuestions,
      questionFeedback
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/student/chat', async (req, res) => {
  try {
    const { message, domain, currentLesson } = req.body;
    if (!message) return res.status(400).json({ error: 'Message cannot be empty.' });

    const response = await aiService.handleStudentChat(message, domain, currentLesson);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/student/accelerator/analyze', async (req, res) => {
  try {
    const { existing_skills, target_role, education_experience, available_hours } = req.body;
    const analysis = await aiService.analyzeCareerAccelerator({
      existing_skills: existing_skills || [],
      target_role: target_role || 'Frontend Engineer',
      education_experience: education_experience || '',
      available_hours: available_hours || 10
    });
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/student/resume/evaluate', async (req, res) => {
  try {
    const { resume_text, target_role } = req.body;
    if (!resume_text) return res.status(400).json({ error: 'Resume text is required.' });

    const evaluation = await aiService.evaluateResume(resume_text, target_role || 'Software Engineer');
    res.json(evaluation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/student/interview/questions', (req, res) => {
  const { role } = req.query;
  const filtered = role 
    ? MOCK_INTERVIEW_QUESTIONS.filter(q => q.role.toLowerCase().includes(String(role).toLowerCase()))
    : MOCK_INTERVIEW_QUESTIONS;
  res.json(filtered.length ? filtered : MOCK_INTERVIEW_QUESTIONS);
});

app.post('/api/student/interview/evaluate', async (req, res) => {
  try {
    const { role, question, answer } = req.body;
    if (!answer) return res.status(400).json({ error: 'Answer cannot be empty.' });

    const evaluation = await aiService.evaluateMockInterviewAnswer(role || 'Software Engineer', question || '', answer);
    res.json(evaluation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// EMPLOYEE PORTAL ROUTES (CHAOS ROUND & CROSS-DOMAIN MANDATE)
// -------------------------------------------------------------
app.get('/api/employee/transitions', (req, res) => {
  res.json(CROSS_DOMAIN_TRANSITIONS);
});

app.get('/api/employee/insights', (req, res) => {
  res.json(CAREER_ACCELERATOR_ROLES);
});

app.post('/api/employee/plan', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const body = req.body;
    const planData = await aiService.generateEmployeeProgressionPlan({
      journey_type: body.journey_type || 'growth',
      current_industry: body.current_industry || 'Technology',
      current_domain: body.current_domain || 'Software Development',
      current_title: body.current_title || 'Junior Developer',
      years_experience: Number(body.years_experience) || 2,
      current_skills: Array.isArray(body.current_skills) ? body.current_skills : ['Git', 'Problem Solving'],
      target_industry: body.target_industry || 'Technology',
      target_domain: body.target_domain || 'Software Development',
      target_role: body.target_role || 'Senior Full Stack Engineer',
      available_hours_week: Number(body.available_hours_week) || 10,
      learning_pace: body.learning_pace || 'moderate',
      constraints: body.constraints || ''
    });

    const saved = db.saveEmployeePlan({
      user_id: req.user!.id,
      ...planData
    });

    res.json({ success: true, plan: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/employee/plan', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { journey_type } = req.query;
    const plan = db.getEmployeePlan(req.user!.id, journey_type as string);
    res.json({ plan: plan || null });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start express server
app.listen(PORT, () => {
  console.log(`[PathPilot AI Backend] listening on http://localhost:${PORT}`);
});
