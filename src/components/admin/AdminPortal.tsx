import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SystemAnalytics, User, Domain, Module, AuditLog } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, Users, Activity, BookOpen, CheckCircle, BarChart3, 
  Settings, Search, Filter, Ban, RefreshCw, Plus, Edit2, Trash2, Cpu, FileText, Check, AlertCircle, Clock, Briefcase
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'curriculum' | 'settings'>('analytics');
  
  // Analytics State
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // User Management State
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Curriculum Management State
  const [domains, setDomains] = useState<Domain[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [domainForm, setDomainForm] = useState({
    title: '',
    slug: '',
    description: '',
    estimated_duration: '12 Weeks',
    badge: 'Popular',
    color: '#B7F36B',
    is_active: true
  });

  // Settings & Audit Logs State
  const [settings, setSettings] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoadingAnalytics(true);
    try {
      const [analyticsData, curriculumData, auditData, settingsData] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminCurriculum(),
        api.getAdminAuditLogs(),
        api.getAdminSettings()
      ]);
      setAnalytics(analyticsData);
      setDomains(curriculumData.domains);
      setModules(curriculumData.modules);
      setAuditLogs(auditData);
      setSettings(settingsData);
      loadUsers();
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.getAdminUsers({ role: roleFilter, query: searchQuery });
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleUserStatus = async (targetUser: User) => {
    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    try {
      await api.updateAdminUserStatus(targetUser.id, newStatus);
      setUsers(users.map(u => u.id === targetUser.id ? { ...u, status: newStatus } : u));
      // Refresh audit logs
      const updatedLogs = await api.getAdminAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDomain) {
        const updated = await api.updateAdminDomain(editingDomain.id, domainForm);
        setDomains(domains.map(d => d.id === editingDomain.id ? updated : d));
      } else {
        const created = await api.createAdminDomain({
          ...domainForm,
          slug: domainForm.slug || domainForm.title.toLowerCase().replace(/\s+/g, '-')
        });
        setDomains([...domains, created]);
      }
      setShowDomainModal(false);
      setEditingDomain(null);
      const updatedLogs = await api.getAdminAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err) {
      console.error('Failed to save domain:', err);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    if (!confirm('Are you sure you want to remove this domain from the active curriculum?')) return;
    try {
      await api.deleteAdminDomain(id);
      setDomains(domains.filter(d => d.id !== id));
      const updatedLogs = await api.getAdminAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err) {
      console.error('Delete domain failed:', err);
    }
  };

  const handleToggleSetting = async (key: string, val: any) => {
    try {
      const updated = await api.updateAdminSettings({ [key]: val });
      setSettings(updated);
      const updatedLogs = await api.getAdminAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err) {
      console.error('Update setting failed:', err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <Ban className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-display text-text-white">Admin Privileges Required</h2>
        <p className="text-xs text-text-muted leading-relaxed">
          The Admin Portal is protected by server-side role verification. Use the Demo Switcher in the top navigation to test as <strong>Dr. Evelyn Vance (Chief Admin)</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="p-8 rounded-2xl bg-charcoal-card border border-charcoal-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-card-glass">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-brand/10 text-purple-brand border border-purple-brand/20 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            PathPilot Enterprise Operations & Platform Oversight
          </div>
          <h1 className="text-3xl font-extrabold font-display text-text-white tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-sm text-text-muted mt-1 max-w-2xl">
            Real-time analytics, user access control, curriculum CRUD, server-side heartbeat tracking, and immutable audit logs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap p-1.5 rounded-xl bg-charcoal border border-charcoal-border shrink-0 gap-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-purple-brand text-charcoal shadow-glow-purple'
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>

          <button
            onClick={() => {
              setActiveTab('users');
              loadUsers();
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-purple-brand text-charcoal shadow-glow-purple'
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Users & Roles
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'curriculum'
                ? 'bg-purple-brand text-charcoal shadow-glow-purple'
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum CRUD
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-purple-brand text-charcoal shadow-glow-purple'
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Config & Audit
          </button>
        </div>
      </div>

      {/* TAB 1: SYSTEM ANALYTICS & HEARTBEAT TRACKING */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-1 shadow-card-glass">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Registered Students</span>
                <Users className="w-4 h-4 text-lime-brand" />
              </div>
              <div className="text-3xl font-extrabold text-lime-brand font-display">
                {analytics.totalStudents}
              </div>
              <p className="text-[11px] text-text-muted">Enrolled in learning paths</p>
            </div>

            <div className="p-5 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-1 shadow-card-glass">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Working Employees</span>
                <Briefcase className="w-4 h-4 text-orange-brand" />
              </div>
              <div className="text-3xl font-extrabold text-orange-brand font-display">
                {analytics.totalEmployees}
              </div>
              <p className="text-[11px] text-text-muted">Cross-domain & progression tracks</p>
            </div>

            <div className="p-5 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-1 shadow-card-glass">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Live Online Users</span>
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-3xl font-extrabold text-green-400 font-display flex items-center gap-2">
                <span>{analytics.onlineUsersCount}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping inline-block" />
              </div>
              <p className="text-[11px] text-text-muted">Active heartbeat in last 120s ({analytics.offlineUsersCount} offline)</p>
            </div>

            <div className="p-5 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-1 shadow-card-glass">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Quiz Pass Rate</span>
                <CheckCircle className="w-4 h-4 text-purple-brand" />
              </div>
              <div className="text-3xl font-extrabold text-purple-brand font-display">
                {analytics.quizPassRate}%
              </div>
              <p className="text-[11px] text-text-muted">Avg score: {analytics.averageScore}% across {analytics.totalQuizAttempts} attempts</p>
            </div>

          </div>

          {/* AI Provider Status Card */}
          <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border grid grid-cols-1 md:grid-cols-3 gap-6 shadow-card-glass items-center">
            <div className="md:col-span-1">
              <span className="text-[10px] uppercase font-bold text-text-muted">AI Infrastructure</span>
              <h3 className="text-base font-bold text-text-white mt-1">Multi-Provider Status</h3>
              <p className="text-xs text-text-muted mt-1">
                Deterministic fallback engine guarantees continuous operations even without cloud API keys.
              </p>
            </div>

            <div className="md:col-span-2 grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-charcoal border border-charcoal-border space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase">Gemini Cloud</span>
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${analytics.aiProviderStatus.gemini_configured ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="text-text-white truncate">
                    {analytics.aiProviderStatus.gemini_configured ? 'Operational' : 'Key Unset (Ready)'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal border border-charcoal-border space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase">Ollama Local</span>
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-text-white truncate">Endpoint Configured</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal border border-charcoal-border space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase">Fallback Engine</span>
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-text-white">Active & Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Platform Activity Audit Feed */}
          <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-4 shadow-card-glass">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-brand" />
              Live Platform Activity Log
            </h3>

            <div className="space-y-2">
              {analytics.recentActivity.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-charcoal border border-charcoal-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-purple-brand/10 text-purple-brand text-[10px] font-bold uppercase">
                      {log.action}
                    </span>
                    <span className="text-text-white font-medium">{log.details}</span>
                    <span className="text-text-muted hidden sm:inline">• {log.user_email}</span>
                  </div>
                  <span className="text-[11px] text-text-muted shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-5 shadow-card-glass">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-text-white">Platform Users Directory</h3>
              <p className="text-xs text-text-muted">Manage registered students, employees, and administrative accounts.</p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-purple-brand"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setTimeout(() => loadUsers(), 50);
                }}
                className="px-3 py-1.5 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="employee">Employees</option>
                <option value="admin">Admins</option>
              </select>

              <button
                onClick={loadUsers}
                className="p-2 rounded-xl bg-charcoal border border-charcoal-border hover:border-purple-brand text-purple-brand"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-xl border border-charcoal-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal border-b border-charcoal-border text-text-muted uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 font-bold">User</th>
                  <th className="p-3.5 font-bold">Role</th>
                  <th className="p-3.5 font-bold">Presence</th>
                  <th className="p-3.5 font-bold">Account Status</th>
                  <th className="p-3.5 font-bold">Last Active</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border/50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-charcoal/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-text-white">{u.full_name}</div>
                      <div className="text-[11px] text-text-muted">{u.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' 
                          ? 'bg-purple-brand/10 text-purple-brand' 
                          : u.role === 'employee'
                          ? 'bg-orange-brand/10 text-orange-brand'
                          : 'bg-lime-brand/10 text-lime-brand'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {u.is_online ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-green-400">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted">
                          <span className="w-2 h-2 rounded-full bg-text-muted/40" />
                          Offline
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.status === 'active'
                          ? 'bg-green-500/10 text-green-300'
                          : 'bg-red-500/10 text-red-300'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-text-muted text-[11px]">
                      {u.last_active_at ? new Date(u.last_active_at).toLocaleString() : 'Never'}
                    </td>
                    <td className="p-3.5 text-right">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                            u.status === 'active'
                              ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                              : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM CRUD */}
      {activeTab === 'curriculum' && (
        <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-6 shadow-card-glass">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/50">
            <div>
              <h3 className="text-base font-bold text-text-white">Curriculum & Domain Management</h3>
              <p className="text-xs text-text-muted">Add, modify, and publish active learning paths across all engineering fields.</p>
            </div>
            <button
              onClick={() => {
                setEditingDomain(null);
                setDomainForm({
                  title: '',
                  slug: '',
                  description: '',
                  estimated_duration: '12 Weeks',
                  badge: 'Popular',
                  color: '#B7F36B',
                  is_active: true
                });
                setShowDomainModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-purple-brand text-charcoal font-bold text-xs hover:bg-purple-brand/90 transition-all flex items-center gap-1.5 shadow-glow-purple"
            >
              <Plus className="w-4 h-4" />
              Create Domain
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {domains.map((dom) => (
              <div key={dom.id} className="p-4 rounded-xl bg-charcoal border border-charcoal-border flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dom.color || '#B7F36B' }} />
                    <span className="text-[10px] text-text-muted">{dom.estimated_duration}</span>
                  </div>
                  <h4 className="text-sm font-bold text-text-white leading-tight">{dom.title}</h4>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">{dom.description}</p>
                </div>

                <div className="pt-3 border-t border-charcoal-border/40 flex items-center justify-between">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${dom.is_active ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                    {dom.is_active ? 'Published' : 'Draft'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingDomain(dom);
                        setDomainForm({
                          title: dom.title,
                          slug: dom.slug,
                          description: dom.description,
                          estimated_duration: dom.estimated_duration,
                          badge: dom.badge || 'Popular',
                          color: dom.color || '#B7F36B',
                          is_active: dom.is_active
                        });
                        setShowDomainModal(true);
                      }}
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-white hover:bg-charcoal-card"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDomain(dom.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-charcoal-card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURATION & AUDIT LOGS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Platform Toggles */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-5 shadow-card-glass">
            <div>
              <h3 className="text-base font-bold text-text-white">Platform Configuration</h3>
              <p className="text-xs text-text-muted">Control global platform behavior and operational flags.</p>
            </div>

            {settings && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-charcoal border border-charcoal-border">
                  <div>
                    <span className="font-bold text-text-white block">Allow Public Registration</span>
                    <span className="text-[11px] text-text-muted">Permit new student and employee signups</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allow_registration}
                    onChange={(e) => handleToggleSetting('allow_registration', e.target.checked)}
                    className="w-4 h-4 accent-purple-brand"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-charcoal border border-charcoal-border">
                  <div>
                    <span className="font-bold text-text-white block">Maintenance Mode</span>
                    <span className="text-[11px] text-text-muted">Restrict non-admin access for updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenance_mode}
                    onChange={(e) => handleToggleSetting('maintenance_mode', e.target.checked)}
                    className="w-4 h-4 accent-purple-brand"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-charcoal border border-charcoal-border space-y-2">
                  <span className="font-bold text-text-white block">Heartbeat Timeout (Seconds)</span>
                  <input
                    type="number"
                    value={settings.heartbeat_timeout_seconds}
                    onChange={(e) => handleToggleSetting('heartbeat_timeout_seconds', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-charcoal-card border border-charcoal-border text-xs text-text-white"
                  />
                  <span className="text-[10px] text-text-muted block">Users with no heartbeat past this window are marked offline.</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Full Audit Log */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-4 shadow-card-glass">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-brand" />
              Administrative Audit Log (Immutable Record)
            </h3>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-charcoal border border-charcoal-border text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-purple-brand/10 text-purple-brand font-bold text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-text-muted">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-text-white font-medium">{log.details}</p>
                  <p className="text-[10px] text-text-muted">Actor: {log.user_email} • Target: {log.target_type} ({log.target_id})</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Domain Creation/Edit Modal */}
      {showDomainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-charcoal-deep border border-charcoal-border p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-display text-text-white">
              {editingDomain ? 'Edit Domain Curriculum' : 'Add New Learning Domain'}
            </h3>

            <form onSubmit={handleSaveDomain} className="space-y-3 text-xs">
              <div>
                <label className="block text-text-white font-medium mb-1">Domain Title</label>
                <input
                  type="text"
                  required
                  value={domainForm.title}
                  onChange={(e) => setDomainForm({ ...domainForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-purple-brand"
                />
              </div>

              <div>
                <label className="block text-text-white font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={domainForm.description}
                  onChange={(e) => setDomainForm({ ...domainForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-purple-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-white font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    value={domainForm.estimated_duration}
                    onChange={(e) => setDomainForm({ ...domainForm, estimated_duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white"
                  />
                </div>
                <div>
                  <label className="block text-text-white font-medium mb-1">Theme Accent Color</label>
                  <input
                    type="color"
                    value={domainForm.color}
                    onChange={(e) => setDomainForm({ ...domainForm, color: e.target.value })}
                    className="w-full h-9 rounded-xl bg-charcoal border border-charcoal-border cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={domainForm.is_active}
                  onChange={(e) => setDomainForm({ ...domainForm, is_active: e.target.checked })}
                  className="w-4 h-4 accent-purple-brand"
                />
                <label htmlFor="activeCheck" className="text-text-white">Publish this domain immediately</label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-charcoal-border/50">
                <button
                  type="button"
                  onClick={() => setShowDomainModal(false)}
                  className="px-4 py-2 rounded-xl text-text-muted hover:text-text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-brand text-charcoal font-bold hover:bg-purple-brand/90"
                >
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};


