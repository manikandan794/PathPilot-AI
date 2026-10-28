import { User, Domain, Module, QuizAttempt, ProgressRecord, SkillGapAnalysis, EmployeeCareerPlan, SystemAnalytics } from '../types';

const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('pathpilot_auth_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('pathpilot_auth_token', token);
    } else {
      localStorage.removeItem('pathpilot_auth_token');
    }
  }

  public getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP request failed: ${response.status}`);
    }

    return response.json();
  }

  // Auth Endpoints
  async register(data: { email: string; password: string; full_name: string; role: string }) {
    const res = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async login(data: { email: string; password: string }) {
    const res = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async demoLogin(role: 'admin' | 'student' | 'employee') {
    const res = await this.request<{ token: string; user: User }>('/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    this.setToken(res.token);
    return res;
  }

  async getMe() {
    return this.request<{ user: User }>('/auth/me');
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async sendHeartbeat() {
    return this.request<{ success: boolean; timestamp: string }>('/auth/heartbeat', {
      method: 'POST',
    });
  }

  // Student Endpoints
  async getDomains() {
    return this.request<Domain[]>('/student/domains');
  }

  async getModules(domainId: string) {
    return this.request<Module[]>(`/student/modules/${domainId}`);
  }

  async getStudentProgress() {
    return this.request<{ progress: ProgressRecord[]; quizAttempts: QuizAttempt[] }>('/student/progress');
  }

  async submitQuiz(data: { moduleId: string; quizId: string; answers: Record<string, number> }) {
    return this.request<{
      attempt: QuizAttempt;
      passed: boolean;
      percentage: number;
      score: number;
      totalQuestions: number;
      questionFeedback: any[];
    }>('/student/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendStudentChatMessage(data: { message: string; domain?: string; currentLesson?: string }) {
    return this.request<{ reply: string; provider: string }>('/student/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async analyzeCareerAccelerator(data: {
    existing_skills: string[];
    target_role: string;
    education_experience: string;
    available_hours: number;
  }) {
    return this.request<SkillGapAnalysis>('/student/accelerator/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async evaluateResume(data: { resume_text: string; target_role: string }) {
    return this.request<{
      provider: string;
      overall_score: number;
      action_verbs_found: string[];
      has_quantified_metrics: boolean;
      suggestions: string[];
      evaluated_at: string;
    }>('/student/resume/evaluate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInterviewQuestions(role?: string) {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    return this.request<any[]>(`/student/interview/questions${query}`);
  }

  async evaluateInterviewAnswer(data: { role: string; question: string; answer: string }) {
    return this.request<{
      provider: string;
      score: number;
      strengths: string[];
      improvements: string[];
      model_answer_highlights: string[];
    }>('/student/interview/evaluate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Employee Endpoints
  async getEmployeeTransitions() {
    return this.request<any[]>('/employee/transitions');
  }

  async getEmployeeInsights() {
    return this.request<any[]>('/employee/insights');
  }

  async saveEmployeePlan(plan: Partial<EmployeeCareerPlan>) {
    return this.request<{ success: boolean; plan: EmployeeCareerPlan }>('/employee/plan', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  }

  async getEmployeePlan(journeyType?: string) {
    const query = journeyType ? `?journey_type=${encodeURIComponent(journeyType)}` : '';
    return this.request<{ plan: EmployeeCareerPlan | null }>(`/employee/plan${query}`);
  }

  // Admin Endpoints
  async getAdminAnalytics() {
    return this.request<SystemAnalytics>('/admin/analytics');
  }

  async getAdminUsers(params?: { role?: string; query?: string }) {
    const search = new URLSearchParams();
    if (params?.role) search.append('role', params.role);
    if (params?.query) search.append('query', params.query);
    const queryStr = search.toString() ? `?${search.toString()}` : '';
    return this.request<User[]>(`/admin/users${queryStr}`);
  }

  async updateAdminUserStatus(userId: string, status: 'active' | 'suspended') {
    return this.request<{ success: boolean; user: User }>(`/admin/users/${userId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminCurriculum() {
    return this.request<{ domains: Domain[]; modules: Module[] }>('/admin/curriculum');
  }

  async createAdminDomain(domain: Partial<Domain>) {
    return this.request<Domain>('/admin/domains', {
      method: 'POST',
      body: JSON.stringify(domain),
    });
  }

  async updateAdminDomain(id: string, domain: Partial<Domain>) {
    return this.request<Domain>(`/admin/domains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(domain),
    });
  }

  async deleteAdminDomain(id: string) {
    return this.request<{ success: boolean }>(`/admin/domains/${id}`, {
      method: 'DELETE',
    });
  }

  async saveAdminModule(module: Partial<Module>) {
    return this.request<{ success: boolean; module: Module }>('/admin/modules', {
      method: 'POST',
      body: JSON.stringify(module),
    });
  }

  async deleteAdminModule(id: string) {
    return this.request<{ success: boolean }>(`/admin/modules/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminAuditLogs() {
    return this.request<any[]>('/admin/audit-logs');
  }

  async getAdminSettings() {
    return this.request<any>('/admin/settings');
  }

  async updateAdminSettings(settings: any) {
    return this.request<any>('/admin/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }
}

export const api = new ApiClient();
