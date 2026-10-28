import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { EmployeeCareerPlan } from '../../types';
import { 
  Briefcase, TrendingUp, GitCompare, Sparkles, Clock, Target, CheckCircle2, 
  AlertCircle, Award, BookOpen, Building2, DollarSign, Layers, ArrowRight, Save, RotateCcw, Check, FileCheck
} from 'lucide-react';

export const EmployeePortal: React.FC = () => {
  const [journeyType, setJourneyType] = useState<'growth' | 'transition' | 'hybrid'>('transition');
  
  // Profile inputs
  const [currentIndustry, setCurrentIndustry] = useState('Hardware & Electronics');
  const [currentDomain, setCurrentDomain] = useState('Hardware Engineering');
  const [currentTitle, setCurrentTitle] = useState('Hardware Engineer');
  const [yearsExperience, setYearsExperience] = useState<number>(3);
  const [currentSkills, setCurrentSkills] = useState<string>('Circuit Design, C++, PCB Layout, Oscilloscopes, Firmware Testing');
  
  const [targetIndustry, setTargetIndustry] = useState('Cloud & Software Systems');
  const [targetDomain, setTargetDomain] = useState('Software Engineering');
  const [targetRole, setTargetRole] = useState('Full Stack / Systems Software Engineer');
  
  const [availableHours, setAvailableHours] = useState<number>(12);
  const [learningPace, setLearningPace] = useState<'moderate' | 'accelerated' | 'relaxed'>('accelerated');
  const [constraints, setConstraints] = useState('Working full-time; evenings and weekends preferred');

  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [plan, setPlan] = useState<EmployeeCareerPlan | null>(null);

  // Preset quick selections for cross-domain transitions
  const TRANSITION_PRESETS = [
    {
      label: 'Hardware → Software Developer',
      sourceDomain: 'Hardware Engineering',
      sourceTitle: 'Hardware Engineer',
      targetDomain: 'Software Engineering',
      targetTitle: 'Full Stack / Systems Software Engineer',
      skills: 'Circuit Design, C++, PCB Layout, Oscilloscopes, Firmware Testing'
    },
    {
      label: 'Mechanical → Data / Software',
      sourceDomain: 'Mechanical Engineering',
      sourceTitle: 'Mechanical Engineer',
      targetDomain: 'Data & Analytics',
      targetTitle: 'Data Analyst / ETL Engineer',
      skills: 'CAD SolidWorks, MATLAB, Calculus, Tolerance Analysis, Product Testing'
    },
    {
      label: 'IT Support → Cloud & DevOps',
      sourceDomain: 'IT Support & Administration',
      sourceTitle: 'IT Support Specialist',
      targetDomain: 'Cloud Computing & DevOps',
      targetTitle: 'Cloud DevOps Engineer',
      skills: 'TCP/IP Networking, Active Directory, Windows Server, Linux Bash, Hardware Triage'
    },
    {
      label: 'Non-IT / Finance → Tech Data',
      sourceDomain: 'Finance & Business Operations',
      sourceTitle: 'Financial Analyst',
      targetDomain: 'Data & Analytics',
      targetTitle: 'Business Intelligence & Data Analyst',
      skills: 'Financial Modeling, Excel Mastery, KPI Dashboards, Stakeholder Storytelling'
    }
  ];

  // Load existing plan on mount
  useEffect(() => {
    loadExistingPlan();
  }, [journeyType]);

  const loadExistingPlan = async () => {
    try {
      const res = await api.getEmployeePlan(journeyType);
      if (res.plan) {
        setPlan(res.plan);
      } else {
        handleGeneratePlan();
      }
    } catch {
      handleGeneratePlan();
    }
  };

  const handleApplyPreset = (preset: typeof TRANSITION_PRESETS[0]) => {
    setCurrentDomain(preset.sourceDomain);
    setCurrentTitle(preset.sourceTitle);
    setTargetDomain(preset.targetDomain);
    setTargetRole(preset.targetTitle);
    setCurrentSkills(preset.skills);
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setSavedSuccess(false);
    try {
      const skillsArray = currentSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await api.saveEmployeePlan({
        journey_type: journeyType,
        current_industry: currentIndustry,
        current_domain: currentDomain,
        current_title: currentTitle,
        years_experience: yearsExperience,
        current_skills: skillsArray,
        target_industry: targetIndustry,
        target_domain: targetDomain,
        target_role: targetRole,
        available_hours_week: availableHours,
        learning_pace: learningPace,
        constraints
      });

      if (res.plan) {
        setPlan(res.plan);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Plan generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-charcoal-card border border-charcoal-border relative overflow-hidden shadow-card-glass">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-brand/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-brand/10 text-orange-brand border border-orange-brand/20 text-xs font-semibold mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              Employee Career Progression Engine • Chaos Round Requirement
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-text-white tracking-tight">
              Professional Upskilling & Cross-Domain Transitions
            </h1>
            <p className="text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
              Designed specifically for working employees. Whether advancing within your existing engineering domain or transitioning from a physical domain (Hardware, Mechanical, IT Support) into Software & Cloud, PathPilot maps your reusable assets into an actionable career ladder.
            </p>
          </div>

          {/* Three Career Journey Toggles */}
          <div className="flex flex-col sm:flex-row p-1.5 rounded-xl bg-charcoal border border-charcoal-border shrink-0 gap-1">
            <button
              onClick={() => setJourneyType('growth')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                journeyType === 'growth'
                  ? 'bg-orange-brand text-charcoal shadow-glow-orange'
                  : 'text-text-muted hover:text-text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              1. Career Growth
            </button>

            <button
              onClick={() => setJourneyType('transition')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                journeyType === 'transition'
                  ? 'bg-orange-brand text-charcoal shadow-glow-orange'
                  : 'text-text-muted hover:text-text-white'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              2. Cross-Domain Switch
            </button>

            <button
              onClick={() => setJourneyType('hybrid')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                journeyType === 'hybrid'
                  ? 'bg-orange-brand text-charcoal shadow-glow-orange'
                  : 'text-text-muted hover:text-text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              3. Hybrid Career
            </button>
          </div>
        </div>
      </div>

      {/* Cross-Domain Transition Preset Pills (Instant Scenarios) */}
      {journeyType === 'transition' && (
        <div className="p-4 rounded-xl bg-charcoal-card border border-charcoal-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-orange-brand flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Quick Select Popular Transition Scenarios:
            </span>
            <span className="text-text-muted text-[11px]">Click any preset to auto-populate</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {TRANSITION_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 rounded-lg bg-charcoal hover:bg-charcoal-hover border border-charcoal-border hover:border-orange-brand text-xs text-text-white transition-all flex items-center gap-2"
              >
                <span>{preset.label}</span>
                <ArrowRight className="w-3 h-3 text-orange-brand" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Profile & Ambitions (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-4 shadow-card-glass">
          <div>
            <h3 className="text-sm font-bold text-text-white">Professional Profile & Objectives</h3>
            <p className="text-xs text-text-muted">Tell PathPilot your current domain and intended target.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-white mb-1">Current Domain</label>
              <input
                type="text"
                value={currentDomain}
                onChange={(e) => setCurrentDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-orange-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-white mb-1">Current Job Title</label>
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-orange-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-white mb-1">
              Current Skills & Competencies (Comma-separated)
            </label>
            <textarea
              rows={2}
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-orange-brand leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-white mb-1">Target Domain</label>
              <input
                type="text"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-orange-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-white mb-1">Target Role / Promotion</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-orange-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-text-white mb-1">Years Exp</label>
              <input
                type="number"
                min="0"
                max="30"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-white mb-1">Hours/Wk</label>
              <input
                type="number"
                min="4"
                max="40"
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-white mb-1">Learning Pace</label>
              <select
                value={learningPace}
                onChange={(e) => setLearningPace(e.target.value as any)}
                className="w-full px-2 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white"
              >
                <option value="accelerated">Accelerated</option>
                <option value="moderate">Moderate</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-orange-brand text-charcoal font-bold text-xs hover:bg-orange-brand/90 transition-all flex items-center justify-center gap-2 shadow-glow-orange disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Personalized Progression Plan
                </>
              )}
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Career progression plan saved securely to database!</span>
            </div>
          )}
        </div>

        {/* Right Output: The Visual Progression Ladder & Transition Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {plan ? (
            <div className="space-y-6">
              
              {/* SIDE-BY-SIDE VISUAL COMPARISON: CURRENT CAREER vs TARGET CAREER */}
              <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-4 shadow-card-glass">
                <div className="flex items-center justify-between pb-2 border-b border-charcoal-border/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-orange-brand flex items-center gap-2">
                    <GitCompare className="w-4 h-4" />
                    Visual Matrix: Current Career vs Target Career
                  </h3>
                  <span className="text-[10px] text-text-muted">Time-Adjusted Analysis</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Current State Card */}
                  <div className="p-4 rounded-xl bg-charcoal border border-charcoal-border space-y-2">
                    <span className="text-[10px] uppercase font-bold text-text-muted">Current Career Baseline</span>
                    <h4 className="text-base font-bold text-text-white">{plan.current_title}</h4>
                    <p className="text-xs text-text-muted">{plan.current_domain} ({plan.years_experience} yrs experience)</p>
                    
                    <div className="pt-2 border-t border-charcoal-border/40">
                      <span className="text-[11px] font-semibold text-lime-brand block mb-1">
                        Reusable Transferable Assets:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {plan.transferable_skills.map((ts, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-lime-brand/10 border border-lime-brand/30 text-[10px] text-lime-brand">
                            ✓ {ts}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Target State Card */}
                  <div className="p-4 rounded-xl bg-charcoal border border-orange-brand/30 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-orange-brand">Target Goal Objective</span>
                    <h4 className="text-base font-bold text-orange-brand">{plan.target_role}</h4>
                    <p className="text-xs text-text-muted">{plan.target_domain}</p>

                    <div className="pt-2 border-t border-charcoal-border/40">
                      <span className="text-[11px] font-semibold text-orange-brand block mb-1">
                        Target Competency Gaps:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {plan.skill_gaps.map((sg, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-orange-brand/10 border border-orange-brand/30 text-[10px] text-orange-brand">
                            + {sg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* VISUAL CAREER LADDER (Interactive Stages) */}
              <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-4 shadow-card-glass">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-brand" />
                  Visual Career Progression Ladder
                </h3>

                <div className="relative border-l-2 border-orange-brand/30 ml-4 pl-6 space-y-6">
                  {plan.career_ladder.map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Step Circle Indicator */}
                      <span className={`absolute -left-[33px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        idx === plan.career_ladder.length - 1
                          ? 'border-orange-brand bg-orange-brand text-charcoal'
                          : 'border-orange-brand/60 bg-charcoal'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-brand" />
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-brand">
                            {step.stage}
                          </span>
                          <span className="text-xs font-bold text-text-white">{step.title}</span>
                        </div>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">
                          {step.focus}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-STAGE TIME-ADJUSTED LEARNING SCHEDULE */}
              <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-4 shadow-card-glass">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-yellow-brand" />
                    Time-Adjusted Upskilling Schedule
                  </h3>
                  <span className="text-xs font-semibold text-lime-brand">
                    Pace: {plan.learning_pace} • {plan.available_hours_week}h/week
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plan.learning_stages.map((stg) => (
                    <div key={stg.stage_number} className="p-4 rounded-xl bg-charcoal border border-charcoal-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-orange-brand">Stage {stg.stage_number}</span>
                        <span className="text-[10px] text-text-muted">~{stg.duration_weeks} Weeks</span>
                      </div>
                      <h4 className="text-xs font-bold text-text-white leading-snug">{stg.title}</h4>
                      
                      <div className="space-y-1 pt-1">
                        {stg.topics.map((t, i) => (
                          <div key={i} className="text-[11px] text-text-muted flex items-start gap-1.5">
                            <span className="text-orange-brand shrink-0">•</span>
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESUME REPOSITIONING GUIDE FOR DOMAIN SWITCHERS */}
              <div className="p-6 rounded-2xl bg-charcoal-card border border-lime-brand/30 space-y-3 shadow-card-glass">
                <h3 className="text-xs font-bold uppercase tracking-wider text-lime-brand flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-lime-brand" />
                  Resume Repositioning Strategy for Domain Switchers
                </h3>
                <p className="text-xs text-text-muted">
                  How to frame past domain experience so recruiters value your unique multi-disciplinary strengths rather than discounting your past tenure:
                </p>

                <div className="space-y-2">
                  {plan.resume_repositioning_tips.map((tip, i) => (
                    <div key={i} className="p-3 rounded-lg bg-charcoal border border-charcoal-border text-xs text-text-white leading-relaxed flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-brand shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRACTICAL PORTFOLIO PROJECTS & CERTIFICATIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Practical Projects */}
                <div className="p-5 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-orange-brand" />
                    Practical Readiness Projects
                  </h4>
                  <div className="space-y-2.5">
                    {plan.practical_projects.map((proj, i) => (
                      <div key={i} className="p-3 rounded-lg bg-charcoal border border-charcoal-border space-y-1">
                        <h5 className="text-xs font-bold text-text-white">{proj.title}</h5>
                        <p className="text-[11px] text-text-muted leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Certifications */}
                <div className="p-5 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-yellow-brand" />
                    Recommended Industry Certifications
                  </h4>
                  <div className="space-y-2">
                    {plan.recommended_certifications.map((cert, i) => (
                      <div key={i} className="p-3 rounded-lg bg-charcoal border border-charcoal-border text-xs text-text-white flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-yellow-brand shrink-0" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] text-text-muted block mb-1 font-semibold">Key Interview Topics:</span>
                    <ul className="text-xs text-text-muted space-y-1">
                      {plan.interview_topics.map((t, i) => (
                        <li key={i}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* SALARY & COMPANY BENCHMARKS */}
              <div className="p-5 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-charcoal-border/50">
                  <span className="font-bold text-text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-brand" />
                    Industry Compensation & Company Benchmark Insights
                  </span>
                  <span className="text-[10px] text-text-muted">Source: {plan.market_insights.data_source}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold">Estimated Salary</span>
                    <span className="text-sm font-bold text-lime-brand mt-0.5 block">{plan.market_insights.salary_range}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold">Market Demand</span>
                    <span className="text-sm font-bold text-orange-brand mt-0.5 block">{plan.market_insights.demand_level}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold">Sample Hiring Firms</span>
                    <span className="text-xs text-text-white mt-0.5 block truncate">
                      {plan.market_insights.sample_companies.join(', ')}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-text-muted/80 leading-relaxed pt-2 border-t border-charcoal-border/40">
                  {plan.market_insights.hiring_outlook}
                </p>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-charcoal-card border border-charcoal-border text-center space-y-3">
              <Sparkles className="w-8 h-8 text-orange-brand mx-auto animate-pulse" />
              <p className="text-sm text-text-white font-bold">Generating Progression Roadmap...</p>
              <p className="text-xs text-text-muted">Analyzing transferable competencies and gap milestones.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
