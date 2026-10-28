import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SkillGapAnalysis } from '../../types';
import { 
  Briefcase, Target, CheckCircle, AlertCircle, Plus, X, ArrowRight, 
  Sparkles, FileText, MessageSquare, Award, Building2, TrendingUp, DollarSign, Check 
} from 'lucide-react';

export const ModelBCareerAccelerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gap' | 'resume' | 'interview'>('gap');
  
  // Skill Gap Analysis State
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([
    'HTML5', 'CSS3', 'JavaScript', 'React', 'Git', 'REST APIs'
  ]);
  const [education, setEducation] = useState('B.S. in Computer Science / Bootcamp');
  const [availableHours, setAvailableHours] = useState(15);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SkillGapAnalysis | null>(null);

  // Resume Builder State
  const [resumeText, setResumeText] = useState(
    `ALEX RIVERA\nFull Stack Developer | alex.rivera@example.com | github.com/alexrivera\n\nSUMMARY\nEnthusiastic full-stack engineer with hands-on experience building reactive web apps using React, TypeScript, and Node.js. Passionate about web performance, clean architecture, and building accessible user experiences.\n\nTECHNICAL SKILLS\nFrontend: React, TypeScript, Tailwind CSS, Next.js, HTML5/CSS3\nBackend: Node.js, Express, REST APIs, PostgreSQL\nTools & Practices: Git, Docker basics, Agile, CI/CD pipelines\n\nPROJECTS\nCollaborative Task Manager (React, Node.js, WebSockets)\n- Engineered real-time Kanban board supporting multi-user simultaneous updates.\n- Implemented optimistic UI updates and local caching reducing perceived latency by 45%.\n\nE-Commerce Dashboard (React, Tailwind CSS, Chart.js)\n- Developed responsive analytics dashboard with virtualized tables handling 10,000+ records.`
  );
  const [resumeEvaluation, setResumeEvaluation] = useState<any | null>(null);
  const [isEvaluatingResume, setIsEvaluatingResume] = useState(false);

  // Mock Interview State
  const [interviewRole, setInterviewRole] = useState('Full Stack Engineer');
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState<any | null>(null);
  const [isEvaluatingInterview, setIsEvaluatingInterview] = useState(false);

  // Initial load
  useEffect(() => {
    handleRunAnalysis();
    loadInterviewQuestions();
  }, []);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skillsList.includes(skillInput.trim())) {
      setSkillsList([...skillsList, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await api.analyzeCareerAccelerator({
        existing_skills: skillsList,
        target_role: targetRole,
        education_experience: education,
        available_hours: availableHours,
      });
      setAnalysisResult(result);
    } catch (err) {
      console.error('Skill gap analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEvaluateResume = async () => {
    if (!resumeText.trim()) return;
    setIsEvaluatingResume(true);
    try {
      const res = await api.evaluateResume({
        resume_text: resumeText,
        target_role: targetRole,
      });
      setResumeEvaluation(res);
    } catch (err) {
      console.error('Resume evaluation failed:', err);
    } finally {
      setIsEvaluatingResume(false);
    }
  };

  const loadInterviewQuestions = async (roleToQuery?: string) => {
    try {
      const data = await api.getInterviewQuestions(roleToQuery || interviewRole);
      setQuestions(data);
      setSelectedQuestionIndex(0);
      setInterviewAnswer('');
      setInterviewFeedback(null);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const handleSubmitInterviewAnswer = async () => {
    if (!interviewAnswer.trim() || !questions[selectedQuestionIndex]) return;
    setIsEvaluatingInterview(true);
    try {
      const res = await api.evaluateInterviewAnswer({
        role: interviewRole,
        question: questions[selectedQuestionIndex].question,
        answer: interviewAnswer,
      });
      setInterviewFeedback(res);
    } catch (err) {
      console.error('Error evaluating interview answer:', err);
    } finally {
      setIsEvaluatingInterview(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-brand px-2.5 py-0.5 rounded-full bg-orange-brand/10 border border-orange-brand/20">
              Model B: Career Accelerator
            </span>
            <span className="text-xs text-text-muted">Target: {targetRole}</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-text-white">
            Existing Skills to Job-Ready
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Audit your current capabilities against industry job descriptions. Prioritize missing high-impact competencies, optimize your resume, and practice live technical interviews.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-charcoal border border-charcoal-border shrink-0">
          <button
            onClick={() => setActiveTab('gap')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'gap'
                ? 'bg-orange-brand text-charcoal shadow-glow-orange'
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Skill-Gap Analysis
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'resume'
                ? 'bg-orange-brand text-charcoal shadow-glow-orange'
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Resume Optimizer
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'interview'
                ? 'bg-orange-brand text-charcoal shadow-glow-orange'
                : 'text-text-muted hover:text-text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Mock Interview
          </button>
        </div>
      </div>

      {/* TAB 1: SKILL GAP ANALYSIS */}
      {activeTab === 'gap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Config Panel (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-5 shadow-card-glass">
            <div>
              <h3 className="text-sm font-bold text-text-white mb-1">Career Configuration</h3>
              <p className="text-xs text-text-muted">Input your existing toolkit and intended engineering role.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-white mb-1.5">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-orange-brand"
              >
                <option value="Frontend Engineer">Frontend Engineer ($95k - $145k)</option>
                <option value="Full Stack Engineer">Full Stack Engineer ($110k - $165k)</option>
                <option value="AI / LLM Application Engineer">AI / LLM Application Engineer ($130k - $190k)</option>
                <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer ($115k - $170k)</option>
                <option value="Data Scientist">Data Scientist ($105k - $160k)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-white mb-1.5">
                Current Technical Skills
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="e.g. Docker, TypeScript, SQL..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white placeholder:text-text-muted/60 focus:outline-none focus:border-orange-brand"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="p-2 rounded-xl bg-charcoal-hover border border-charcoal-border hover:border-orange-brand text-orange-brand"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-1">
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-charcoal border border-charcoal-border text-xs text-text-white group"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-text-muted hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-white mb-1">
                  Available Hours/Wk
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-white mb-1">
                  Background
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white"
                />
              </div>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-orange-brand text-charcoal font-bold text-xs hover:bg-orange-brand/90 transition-all flex items-center justify-center gap-2 shadow-glow-orange disabled:opacity-50"
            >
              {isAnalyzing ? (
                <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
              ) : (
                'Run AI Skill-Gap Analysis'
              )}
            </button>
          </div>

          {/* Right Results Dashboard (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {analysisResult ? (
              <div className="space-y-6">
                
                {/* Readiness Gauge & Salary Hero */}
                <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border grid grid-cols-1 sm:grid-cols-3 gap-6 items-center shadow-card-glass">
                  <div className="sm:col-span-1 text-center sm:border-r border-charcoal-border/50 sm:pr-4">
                    <span className="text-[10px] uppercase font-bold text-text-muted">
                      Job Readiness Score
                    </span>
                    <div className="text-4xl font-extrabold font-display text-orange-brand mt-1">
                      {analysisResult.readiness_score}%
                    </div>
                    <div className="w-full bg-charcoal h-2 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-brand to-orange-brand"
                        style={{ width: `${analysisResult.readiness_score}%` }}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-lime-brand" />
                      <span className="text-xs text-text-muted">Published Salary Benchmark:</span>
                      <span className="text-xs font-bold text-text-white">{analysisResult.salary_range}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-brand" />
                      <span className="text-xs text-text-muted">Hiring Companies:</span>
                      <span className="text-xs text-text-white truncate">
                        {analysisResult.top_hiring_companies.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-brand" />
                      <span className="text-xs text-text-muted">Experience Level:</span>
                      <span className="text-xs text-text-white">{analysisResult.experience_level}</span>
                    </div>
                  </div>
                </div>

                {/* Skills Comparison Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Matched Skills */}
                  <div className="p-5 rounded-xl bg-charcoal-card border border-green-500/20 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-green-400 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        Skills You Already Have ({analysisResult.matched_skills.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.matched_skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/30 text-xs font-medium text-green-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="p-5 rounded-xl bg-charcoal-card border border-orange-500/20 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-orange-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        Critical Skills to Acquire ({analysisResult.missing_skills.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.missing_skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-xs font-medium text-orange-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Prioritized Upskilling Roadmap */}
                <div className="p-5 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-white">
                    Targeted Upskilling Sequence
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.prioritized_roadmap.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-charcoal border border-charcoal-border flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-bold text-orange-brand mt-0.5">#{idx + 1}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-bold text-text-white">{item.skill}</h5>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-brand/20 text-orange-brand font-semibold uppercase">
                                {item.priority} Priority
                              </span>
                            </div>
                            <p className="text-[11px] text-text-muted mt-1">{item.recommended_action}</p>
                          </div>
                        </div>
                        <span className="text-[11px] text-text-muted shrink-0 font-medium">
                          ~{item.estimated_weeks} wks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Portfolio Projects */}
                <div className="p-5 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-brand" />
                    Portfolio Projects That Prove Readiness
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.recommended_projects.map((proj, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-charcoal border border-charcoal-border text-xs text-text-white font-medium flex items-center gap-2"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-lime-brand shrink-0" />
                        <span>{proj}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-xs text-text-muted">Loading analysis results...</p>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: RESUME OPTIMIZER */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Markdown / Text Resume Editor */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-4 shadow-card-glass">
            <div className="flex items-center justify-between pb-2 border-b border-charcoal-border/50">
              <div>
                <h3 className="text-sm font-bold text-text-white">Professional Resume Builder</h3>
                <p className="text-xs text-text-muted">Structured text format formatted for modern ATS parsing.</p>
              </div>
              <button
                onClick={handleEvaluateResume}
                disabled={isEvaluatingResume}
                className="px-4 py-2 rounded-xl bg-orange-brand text-charcoal font-bold text-xs hover:bg-orange-brand/90 transition-all flex items-center gap-1.5 shadow-glow-orange disabled:opacity-50"
              >
                {isEvaluatingResume ? (
                  <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    AI ATS Evaluation
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={18}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-4 rounded-xl bg-charcoal border border-charcoal-border text-xs font-mono text-text-white leading-relaxed focus:outline-none focus:border-orange-brand"
            />
          </div>

          {/* Right Column: AI Resume Feedback */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-4 shadow-card-glass">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-brand" />
                ATS & Hiring Manager Scorecard
              </h4>

              {resumeEvaluation ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-charcoal border border-charcoal-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase font-bold">Overall ATS Score</span>
                      <div className="text-3xl font-extrabold text-orange-brand mt-0.5">
                        {resumeEvaluation.overall_score}/100
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-orange-brand/10 text-orange-brand font-semibold">
                      {resumeEvaluation.overall_score >= 80 ? 'Interview Ready' : 'Optimization Recommended'}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-text-white mb-2">High-Impact Verbs Detected</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {resumeEvaluation.action_verbs_found.map((verb: string) => (
                        <span
                          key={verb}
                          className="px-2 py-0.5 rounded bg-lime-brand/10 border border-lime-brand/30 text-lime-brand text-[11px]"
                        >
                          ✓ {verb}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-text-white mb-2">Actionable Suggestions</h5>
                    <div className="space-y-2">
                      {resumeEvaluation.suggestions.map((sug: string, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-charcoal border border-charcoal-border text-xs text-text-muted leading-relaxed"
                        >
                          • {sug}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-3">
                  <Sparkles className="w-8 h-8 text-orange-brand mx-auto opacity-60" />
                  <p className="text-xs text-text-muted max-w-xs mx-auto">
                    Click 'AI ATS Evaluation' to inspect bullet point impact, quantifiable metrics, and role keywords.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: MOCK INTERVIEW SUITE */}
      {activeTab === 'interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Role Selector & Question List */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-4 shadow-card-glass">
            <div>
              <label className="block text-xs font-medium text-text-white mb-1.5">
                Target Interview Domain
              </label>
              <select
                value={interviewRole}
                onChange={(e) => {
                  setInterviewRole(e.target.value);
                  loadInterviewQuestions(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white"
              >
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="AI / LLM Application Engineer">AI / LLM Application Engineer</option>
              </select>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Interview Questions ({questions.length})
              </span>
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedQuestionIndex(idx);
                    setInterviewAnswer('');
                    setInterviewFeedback(null);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedQuestionIndex === idx
                      ? 'border-orange-brand bg-charcoal shadow-sm'
                      : 'border-charcoal-border bg-charcoal/50 hover:bg-charcoal'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-orange-brand">Question {idx + 1}</span>
                    <span className="text-[10px] text-text-muted">{q.difficulty}</span>
                  </div>
                  <p className="text-text-white font-medium line-clamp-2">{q.question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Question Answering & AI Grading */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-charcoal-card border border-charcoal-border space-y-5 shadow-card-glass">
            {questions[selectedQuestionIndex] ? (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-charcoal border border-charcoal-border">
                  <span className="text-[10px] uppercase font-bold text-orange-brand">
                    Scenario Prompt • {questions[selectedQuestionIndex].role} ({questions[selectedQuestionIndex].difficulty})
                  </span>
                  <h4 className="text-sm font-bold text-text-white mt-1 leading-relaxed">
                    {questions[selectedQuestionIndex].question}
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-white mb-1.5">
                    Your Technical Answer (Type your in-depth architectural response)
                  </label>
                  <textarea
                    rows={6}
                    value={interviewAnswer}
                    onChange={(e) => setInterviewAnswer(e.target.value)}
                    placeholder="Structure your answer: core data structures, algorithms, failure handling, caching strategies, and system trade-offs..."
                    className="w-full p-4 rounded-xl bg-charcoal border border-charcoal-border text-xs text-text-white placeholder:text-text-muted/60 focus:outline-none focus:border-orange-brand"
                  />
                </div>

                <button
                  onClick={handleSubmitInterviewAnswer}
                  disabled={isEvaluatingInterview || !interviewAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-orange-brand text-charcoal font-bold text-xs hover:bg-orange-brand/90 transition-all flex items-center gap-2 shadow-glow-orange disabled:opacity-50"
                >
                  {isEvaluatingInterview ? (
                    <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Submit Answer for Evaluation'
                  )}
                </button>

                {/* AI Evaluation Output */}
                {interviewFeedback && (
                  <div className="p-5 rounded-xl bg-charcoal border border-charcoal-border space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/50">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-text-muted">Assessment Score</span>
                        <div className="text-2xl font-extrabold text-orange-brand">
                          {interviewFeedback.score}/100
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-orange-brand/20 text-orange-brand font-bold">
                        {interviewFeedback.score >= 80 ? 'Strong Answer' : 'Passing with Revisions'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <span className="font-bold text-green-400">Key Strengths</span>
                        {interviewFeedback.strengths.map((str: string, i: number) => (
                          <div key={i} className="text-text-muted">• {str}</div>
                        ))}
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-bold text-orange-400">Areas for Improvement</span>
                        {interviewFeedback.improvements.map((imp: string, i: number) => (
                          <div key={i} className="text-text-muted">• {imp}</div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-charcoal-border/50">
                      <span className="text-xs font-bold text-text-white block mb-1.5">Model Answer Structure:</span>
                      <div className="space-y-1 text-xs text-text-muted/90">
                        {interviewFeedback.model_answer_highlights.map((h: string, i: number) => (
                          <p key={i}>✓ {h}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-text-muted">Loading interview questions...</p>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
