import React from 'react';
import { CinematicHero } from '../hero/CinematicHero';
import { 
  Compass, Briefcase, ShieldCheck, Sparkles, Target, Award, 
  GitCompare, Layers, Cpu, CheckCircle2, ArrowRight, Zap, Code2, Users 
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'student' | 'employee' | 'admin') => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <div className="w-full bg-charcoal min-h-screen">
      
      {/* 1. CINEMATIC SCROLL-CONTROLLED HERO SECTION */}
      <CinematicHero
        onSelectPortal={(portal) => onNavigate(portal)}
        onExploreCurriculum={() => {
          const el = document.getElementById('curriculum-overview');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. THREE PRIMARY PORTALS SHOWCASE */}
      <section id="curriculum-overview" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-lime-brand px-3 py-1 rounded-full bg-lime-brand/10 border border-lime-brand/20">
            Unified Ecosystem
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-text-white tracking-tight">
            Three Dedicated Portals. One Coherent Platform.
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            PathPilot AI connects learners, working professionals, and platform administrators through shared authentication, curriculum persistence, and AI intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1: Student Portal */}
          <div className="p-8 rounded-3xl bg-charcoal-card border border-charcoal-border hover:border-lime-brand/50 transition-all flex flex-col justify-between space-y-6 group shadow-card-glass">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-lime-brand/10 border border-lime-brand/30 flex items-center justify-center text-lime-brand group-hover:shadow-glow-lime transition-all">
                <Compass className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-brand">Portal 01</span>
              <h3 className="text-2xl font-bold font-display text-text-white">
                Student Learning Hub
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Choose between two distinct trajectories: <strong>Model A (Scratch to Advanced)</strong> with adaptive quizzes and interactive lessons, or <strong>Model B (Career Accelerator)</strong> with AI skills-gap analysis, ATS resume evaluation, and mock interviews.
              </p>
              
              <ul className="space-y-2 text-xs text-text-muted pt-2 border-t border-charcoal-border/50">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-brand" />
                  <span>8 Core Engineering Curricula</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-brand" />
                  <span>Persistent AI Learning Mentor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-brand" />
                  <span>Automated Quiz Score Persistence</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('student')}
              className="w-full py-3 rounded-xl bg-lime-brand text-charcoal font-semibold text-xs hover:bg-lime-brand/90 transition-all flex items-center justify-center gap-2 shadow-glow-lime"
            >
              Explore Student Hub
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 2: Employee Portal (Chaos Requirement) */}
          <div className="p-8 rounded-3xl bg-charcoal-card border border-orange-brand/30 hover:border-orange-brand transition-all flex flex-col justify-between space-y-6 group shadow-card-glass relative overflow-hidden">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-orange-brand/20 text-orange-brand text-[10px] font-bold uppercase tracking-wider">
              Chaos Round
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-brand/10 border border-orange-brand/30 flex items-center justify-center text-orange-brand group-hover:shadow-glow-orange transition-all">
                <Briefcase className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-brand">Portal 02</span>
              <h3 className="text-2xl font-bold font-display text-text-white">
                Employee Progression
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Dedicated career advancement for working employees. Supports <strong>Career Growth</strong>, <strong>Cross-Domain Transitions</strong> (Hardware/Mechanical/IT Support to Tech), and <strong>Hybrid Careers</strong> with visual career ladders and resume repositioning.
              </p>

              <ul className="space-y-2 text-xs text-text-muted pt-2 border-t border-charcoal-border/50">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-brand" />
                  <span>Visual Comparison: Current vs Target</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-brand" />
                  <span>Transferable Skills Identification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-brand" />
                  <span>Salary & Hiring Company Insights</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('employee')}
              className="w-full py-3 rounded-xl bg-orange-brand text-charcoal font-semibold text-xs hover:bg-orange-brand/90 transition-all flex items-center justify-center gap-2 shadow-glow-orange"
            >
              Open Employee Portal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 3: Admin Operations */}
          <div className="p-8 rounded-3xl bg-charcoal-card border border-charcoal-border hover:border-purple-brand/50 transition-all flex flex-col justify-between space-y-6 group shadow-card-glass">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-brand/10 border border-purple-brand/30 flex items-center justify-center text-purple-brand group-hover:shadow-glow-purple transition-all">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-brand">Portal 03</span>
              <h3 className="text-2xl font-bold font-display text-text-white">
                Admin Command Center
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Comprehensive platform oversight with live server-side heartbeat tracking, user suspend/reactivate toggles, complete syllabus and domain CRUD, settings management, and immutable audit logs.
              </p>

              <ul className="space-y-2 text-xs text-text-muted pt-2 border-t border-charcoal-border/50">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-brand" />
                  <span>Real-Time Online/Offline Timeout Tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-brand" />
                  <span>Full Curriculum & Assessment CRUD</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-brand" />
                  <span>Server-Side RBAC Enforcement</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('admin')}
              className="w-full py-3 rounded-xl bg-purple-brand text-charcoal font-semibold text-xs hover:bg-purple-brand/90 transition-all flex items-center justify-center gap-2 shadow-glow-purple"
            >
              Launch Admin Center
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. MULTI-PROVIDER AI ARCHITECTURE SECTION */}
      <section className="py-20 bg-charcoal-deep border-y border-charcoal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-lime-brand px-3 py-1 rounded-full bg-lime-brand/10 border border-lime-brand/20">
                AI Service Abstraction
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-text-white tracking-tight">
                Honest Fallback Architecture & Zero Vendor Lock-in
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                PathPilot AI abstracts intelligence into a resilient multi-tier pipeline. We leverage <strong>Google Gemini API</strong> for cloud reasoning and <strong>Ollama</strong> for local instances. If external providers are offline, our verified <strong>Deterministic Domain Intelligence Engine</strong> executes seamlessly with clear labelling.
              </p>
              
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-charcoal border border-charcoal-border">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-text-white font-medium">Never claims operational status unless verified</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-charcoal border border-charcoal-border">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-brand" />
                  <span className="text-text-white font-medium">Zero API keys or secrets exposed to client bundles</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-charcoal border border-charcoal-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-lime-brand/10 border border-lime-brand/30 flex items-center justify-center text-lime-brand">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-text-white">Cloud: Gemini API</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  High-capacity multimodal reasoning and real-time generation via Google GenAI APIs.
                </p>
                <span className="text-[10px] font-bold text-lime-brand block uppercase">Tier 1 Cloud</span>
              </div>

              <div className="p-5 rounded-2xl bg-charcoal border border-charcoal-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-brand/10 border border-orange-brand/30 flex items-center justify-center text-orange-brand">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-text-white">Local: Ollama</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Local developer instance support (Llama 3, Mistral) with timeout guards and health probes.
                </p>
                <span className="text-[10px] font-bold text-orange-brand block uppercase">Tier 2 Local</span>
              </div>

              <div className="p-5 rounded-2xl bg-charcoal border border-charcoal-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-brand/10 border border-purple-brand/30 flex items-center justify-center text-purple-brand">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-text-white">Domain Intelligence</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  High-precision deterministic engine providing curated roadmaps, rubrics, and quiz scoring.
                </p>
                <span className="text-[10px] font-bold text-purple-brand block uppercase">Tier 3 Always On</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION HERO CARD */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-charcoal-card via-charcoal to-charcoal-deep border border-charcoal-border text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-brand/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-text-white tracking-tight max-w-2xl mx-auto">
            Ready to Accelerate Your Engineering Career?
          </h2>
          <p className="text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
            Begin your journey today or test the entire platform immediately using our 1-click persona switcher.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('student')}
              className="px-8 py-4 rounded-xl bg-lime-brand text-charcoal font-bold text-sm hover:bg-lime-brand/90 transition-all flex items-center gap-2 shadow-glow-lime transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              Launch Student Journey
            </button>

            <button
              onClick={() => onNavigate('employee')}
              className="px-8 py-4 rounded-xl bg-charcoal-card border border-orange-brand/40 text-text-white font-semibold text-sm hover:bg-charcoal-hover transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-orange-brand" />
              Cross-Domain Career Transition
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
