import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Compass, Briefcase, ShieldCheck, LogIn, LogOut, UserCircle2, Zap, ChevronDown, Check } from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  activeView: string;
  onNavigate: (view: 'landing' | 'student' | 'employee' | 'admin') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onNavigate, onOpenAuth }) => {
  const { user, logout, quickSwitchDemo, isAdmin, isStudent, isEmployee } = useAuth();
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleDemoSelect = async (role: UserRole) => {
    setShowDemoMenu(false);
    await quickSwitchDemo(role);
    if (role === 'admin') onNavigate('admin');
    else if (role === 'employee') onNavigate('employee');
    else onNavigate('student');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-charcoal/85 backdrop-blur-md border-b border-charcoal-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-charcoal-card border border-lime-brand/30 flex items-center justify-center text-lime-brand group-hover:border-lime-brand group-hover:shadow-glow-lime transition-all">
            <Compass className="w-5 h-5 text-lime-brand" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight font-display text-text-white">
                PathPilot<span className="text-lime-brand">.AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-lime-brand/10 text-lime-brand border border-lime-brand/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-text-muted hidden sm:block">Learning • Career • Employee Growth</p>
          </div>
        </div>

        {/* Navigation Portals */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-charcoal-card/60 border border-charcoal-border">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'landing' 
                ? 'bg-charcoal text-text-white shadow-sm' 
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onNavigate('student')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'student' 
                ? 'bg-lime-brand text-charcoal font-semibold shadow-glow-lime' 
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            Student Hub
          </button>

          <button
            onClick={() => onNavigate('employee')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'employee' 
                ? 'bg-orange-brand text-charcoal font-semibold shadow-glow-orange' 
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Employee Portal
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-charcoal/20 text-charcoal font-bold uppercase">
              Chaos
            </span>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'admin' 
                ? 'bg-purple-brand text-charcoal font-semibold shadow-glow-purple' 
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Operations
          </button>
        </div>

        {/* Right Side Controls & Demo Quick Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Switcher Dropdown (Crucial for Evaluators/Judges) */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="px-3 py-1.5 rounded-lg bg-charcoal-card border border-charcoal-border hover:border-lime-brand/40 text-xs font-medium text-text-white flex items-center gap-1.5 transition-all shadow-card-glass"
              title="One-click switch demo persona for testing"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-brand" />
              <span className="hidden sm:inline">Demo Switcher</span>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-charcoal-deep border border-charcoal-border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider border-b border-charcoal-border/50 mb-1">
                  Instant Judge / Test Personas
                </div>
                
                <button
                  onClick={() => handleDemoSelect('admin')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-charcoal-card text-xs flex items-center justify-between transition-colors group"
                >
                  <div>
                    <div className="font-semibold text-purple-brand">Admin: Dr. Evelyn Vance</div>
                    <div className="text-[10px] text-text-muted">Analytics, User CRUD, Content editor</div>
                  </div>
                  {isAdmin && <Check className="w-4 h-4 text-purple-brand" />}
                </button>

                <button
                  onClick={() => handleDemoSelect('student')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-charcoal-card text-xs flex items-center justify-between transition-colors group"
                >
                  <div>
                    <div className="font-semibold text-lime-brand">Student: Alex Rivera</div>
                    <div className="text-[10px] text-text-muted">Model A (Beginner) & B (Accelerator)</div>
                  </div>
                  {isStudent && <Check className="w-4 h-4 text-lime-brand" />}
                </button>

                <button
                  onClick={() => handleDemoSelect('employee')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-charcoal-card text-xs flex items-center justify-between transition-colors group"
                >
                  <div>
                    <div className="font-semibold text-orange-brand">Employee: Sarah Chen</div>
                    <div className="text-[10px] text-text-muted">Cross-Domain Switch (Hardware → Tech)</div>
                  </div>
                  {isEmployee && <Check className="w-4 h-4 text-orange-brand" />}
                </button>
              </div>
            )}
          </div>

          {/* User Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-charcoal-card border border-charcoal-border hover:border-text-muted transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs text-left">
                  <span className="w-2 h-2 rounded-full bg-lime-brand animate-ping" />
                  <span className="font-medium text-text-white hidden sm:inline max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold bg-charcoal-hover text-text-muted">
                    {user.role}
                  </span>
                </div>
                <UserCircle2 className="w-6 h-6 text-text-muted" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-charcoal-deep border border-charcoal-border shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-charcoal-border/50 mb-1">
                    <p className="text-xs font-semibold text-text-white truncate">{user.full_name}</p>
                    <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (user.role === 'admin') onNavigate('admin');
                      else if (user.role === 'employee') onNavigate('employee');
                      else onNavigate('student');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-charcoal-card text-xs text-text-white flex items-center gap-2"
                  >
                    <Compass className="w-3.5 h-3.5 text-lime-brand" />
                    My Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                      onNavigate('landing');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-xs text-red-400 flex items-center gap-2 transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-lime-brand text-charcoal font-semibold text-xs hover:bg-lime-brand/90 transition-all flex items-center gap-1.5 shadow-glow-lime"
            >
              <LogIn className="w-4 h-4" />
              Sign In / Register
            </button>
          )}

        </div>

      </div>
    </nav>
  );
};
