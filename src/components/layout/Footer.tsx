import React from 'react';
import { Compass, Shield, Cpu, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-charcoal-deep border-t border-charcoal-border pt-16 pb-12 text-sm text-text-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-charcoal-border/50">
          
          {/* Col 1: Platform Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-lime-brand/10 border border-lime-brand/30 flex items-center justify-center text-lime-brand">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg font-display text-text-white tracking-tight">
                PathPilot<span className="text-lime-brand">.AI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-text-muted">
              The complete AI-powered learning, career, and employee growth ecosystem. From your first line of code to senior engineering leadership.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-card border border-charcoal-border text-[11px] text-lime-brand">
              <span className="w-2 h-2 rounded-full bg-lime-brand animate-pulse" />
              Production Ready • WCAG AA Accessible
            </div>
          </div>

          {/* Col 2: Student Learning Models */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-text-white uppercase tracking-wider">Student Hub</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-lime-brand transition-colors cursor-pointer">
                  Model A: Scratch to Advanced
                </span>
              </li>
              <li>
                <span className="hover:text-lime-brand transition-colors cursor-pointer">
                  Model B: Career Accelerator
                </span>
              </li>
              <li>
                <span className="hover:text-lime-brand transition-colors cursor-pointer">
                  Adaptive Quizzes & Grading
                </span>
              </li>
              <li>
                <span className="hover:text-lime-brand transition-colors cursor-pointer">
                  AI Contextual Learning Chatbot
                </span>
              </li>
              <li>
                <span className="hover:text-lime-brand transition-colors cursor-pointer">
                  ATS Resume & Mock Interview Suite
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Employee Growth & Chaos Requirement */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-text-white uppercase tracking-wider">Employee Portal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-orange-brand transition-colors cursor-pointer">
                  Same-Domain Career Growth
                </span>
              </li>
              <li>
                <span className="hover:text-orange-brand transition-colors cursor-pointer flex items-center gap-1">
                  Cross-Domain Transition
                  <span className="text-[9px] px-1 py-0.2 rounded bg-orange-brand/20 text-orange-brand font-bold uppercase">Chaos</span>
                </span>
              </li>
              <li>
                <span className="hover:text-orange-brand transition-colors cursor-pointer">
                  Hardware/Mech to Software Ladders
                </span>
              </li>
              <li>
                <span className="hover:text-orange-brand transition-colors cursor-pointer">
                  Transferable Skills Analyzer
                </span>
              </li>
              <li>
                <span className="hover:text-orange-brand transition-colors cursor-pointer">
                  Market Salary & Hiring Benchmarks
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Security & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-text-white uppercase tracking-wider">System Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-purple-brand" />
                <span>Gemini API + Ollama Local + Fallback Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-lime-brand" />
                <span>Server-Side RBAC & Live Heartbeat</span>
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-yellow-brand" />
                <span>Google Flow 299-Frame Canvas Hero</span>
              </li>
              <li className="text-[11px] text-text-muted/80 pt-1">
                Zero secret leaks in client bundles. Safe salted scrypt hashing.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted/70 gap-4">
          <p>© 2026 PathPilot AI Platform. Built for engineering excellence and career growth.</p>
          <div className="flex items-center gap-4">
            <span className="text-text-muted hover:text-text-white transition-colors">Privacy & Terms</span>
            <span>•</span>
            <span className="text-text-muted hover:text-text-white transition-colors">Audit & Security</span>
            <span>•</span>
            <span className="text-text-muted hover:text-text-white transition-colors">API Documentation</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
