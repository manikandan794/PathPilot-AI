import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, Shield, Compass, Briefcase, Zap, AlertCircle } from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  defaultRole = 'student',
}) => {
  const { login, register, quickSwitchDemo, error, clearError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, fullName, selectedRole);
      }
      onClose();
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async (role: UserRole) => {
    setIsSubmitting(true);
    try {
      await quickSwitchDemo(role);
      onClose();
    } catch {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-charcoal-deep border border-charcoal-border shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-border/60">
          <div>
            <h2 className="text-xl font-bold font-display text-text-white">
              {mode === 'login' ? 'Welcome Back to PathPilot' : 'Create PathPilot Account'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {mode === 'login' ? 'Sign in to access your customized learning roadmap' : 'Join thousands accelerating their engineering careers'}
            </p>
          </div>
          <button
            onClick={() => {
              clearError();
              onClose();
            }}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-white hover:bg-charcoal-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instant Demo Switcher Banner for Quick Testing */}
        <div className="px-6 py-3 bg-charcoal-card/80 border-b border-charcoal-border/50">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-yellow-brand uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            Instant Demo Account (1-Click Judge Access)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('student')}
              className="py-1.5 px-2 rounded-lg bg-charcoal text-[11px] font-medium text-lime-brand border border-lime-brand/30 hover:border-lime-brand transition-all flex items-center justify-center gap-1"
            >
              <Compass className="w-3 h-3" />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('employee')}
              className="py-1.5 px-2 rounded-lg bg-charcoal text-[11px] font-medium text-orange-brand border border-orange-brand/30 hover:border-orange-brand transition-all flex items-center justify-center gap-1"
            >
              <Briefcase className="w-3 h-3" />
              Employee
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              className="py-1.5 px-2 rounded-lg bg-charcoal text-[11px] font-medium text-purple-brand border border-purple-brand/30 hover:border-purple-brand transition-all flex items-center justify-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-charcoal-border/60">
          <button
            onClick={() => {
              clearError();
              setMode('login');
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-all ${
              mode === 'login'
                ? 'border-lime-brand text-lime-brand bg-charcoal-card/40'
                : 'border-transparent text-text-muted hover:text-text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              clearError();
              setMode('register');
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-all ${
              mode === 'register'
                ? 'border-lime-brand text-lime-brand bg-charcoal-card/40'
                : 'border-transparent text-text-muted hover:text-text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-text-white mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-charcoal-card border border-charcoal-border text-xs text-text-white placeholder:text-text-muted/60 focus:outline-none focus:border-lime-brand transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-white mb-1.5">
                  Primary Role & Objective
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                      selectedRole === 'student'
                        ? 'border-lime-brand bg-lime-brand/10 text-lime-brand font-semibold'
                        : 'border-charcoal-border bg-charcoal-card text-text-muted hover:text-text-white'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('employee')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                      selectedRole === 'employee'
                        ? 'border-orange-brand bg-orange-brand/10 text-orange-brand font-semibold'
                        : 'border-charcoal-border bg-charcoal-card text-text-muted hover:text-text-white'
                    }`}
                  >
                    Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                      selectedRole === 'admin'
                        ? 'border-purple-brand bg-purple-brand/10 text-purple-brand font-semibold'
                        : 'border-charcoal-border bg-charcoal-card text-text-muted hover:text-text-white'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-text-white mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-charcoal-card border border-charcoal-border text-xs text-text-white placeholder:text-text-muted/60 focus:outline-none focus:border-lime-brand transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-white mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-charcoal-card border border-charcoal-border text-xs text-text-white placeholder:text-text-muted/60 focus:outline-none focus:border-lime-brand transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-xl bg-lime-brand text-charcoal font-semibold text-xs hover:bg-lime-brand/90 transition-all flex items-center justify-center gap-2 shadow-glow-lime disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              'Sign In to Dashboard'
            ) : (
              'Create My Account'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
