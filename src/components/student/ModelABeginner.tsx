import React, { useState, useEffect } from 'react';
import { Domain, Module, QuizAttempt, ProgressRecord } from '../../types';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { 
  BookOpen, CheckCircle2, ChevronRight, Play, Award, Code2, 
  Sparkles, Clock, Compass, FileText, Check, ArrowRight, RotateCcw, AlertTriangle 
} from 'lucide-react';

interface ModelABeginnerProps {
  domains: Domain[];
  selectedDomain: Domain | null;
  onSelectDomain: (d: Domain) => void;
  progress: ProgressRecord[];
  quizAttempts: QuizAttempt[];
  onRefreshProgress: () => void;
}

export const ModelABeginner: React.FC<ModelABeginnerProps> = ({
  domains,
  selectedDomain,
  onSelectDomain,
  progress,
  quizAttempts,
  onRefreshProgress,
}) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState<boolean>(false);

  // Personalization settings
  const [careerGoal, setCareerGoal] = useState('Full Stack Software Engineer');
  const [learningPace, setLearningPace] = useState('Moderate (10-15 hrs/week)');
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);

  useEffect(() => {
    if (selectedDomain) {
      loadModules(selectedDomain.id);
    }
  }, [selectedDomain]);

  const loadModules = async (domainId: string) => {
    try {
      const data = await api.getModules(domainId);
      setModules(data);
      if (data.length > 0) {
        setSelectedModule(data[0]);
        setActiveLessonIndex(0);
        setShowQuiz(false);
        setQuizResult(null);
      }
    } catch (err) {
      console.error('Error loading modules:', err);
    }
  };

  const isModuleCompleted = (moduleId: string) => {
    return progress.some((p) => p.module_id === moduleId && p.completed);
  };

  const getModuleScore = (moduleId: string) => {
    const attempt = quizAttempts.find((a) => a.module_id === moduleId);
    return attempt ? attempt.percentage : null;
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!selectedModule || !selectedModule.quiz) return;
    setIsSubmittingQuiz(true);
    try {
      const res = await api.submitQuiz({
        moduleId: selectedModule.id,
        quizId: selectedModule.quiz.id,
        answers: quizAnswers,
      });

      setQuizResult(res);
      onRefreshProgress();

      if (res.passed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B7F36B', '#FF914D', '#A78BFA'],
        });
      }
    } catch (err) {
      console.error('Quiz submit failed:', err);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Personalization Bar */}
      <div className="p-6 rounded-2xl bg-charcoal-card border border-charcoal-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-brand px-2.5 py-0.5 rounded-full bg-lime-brand/10 border border-lime-brand/20">
              Model A: Scratch to Advanced
            </span>
            <span className="text-xs text-text-muted">Target: {careerGoal}</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-text-white">
            Structured Foundational Learning
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Ordered, verified modules designed to build mental models and technical muscle memory from foundational syntax up to production architecture.
          </p>
        </div>

        <button
          onClick={() => setShowPersonalizeModal(true)}
          className="px-4 py-2 rounded-xl bg-charcoal-hover border border-charcoal-border hover:border-lime-brand text-xs font-semibold text-text-white flex items-center gap-2 transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-lime-brand" />
          Personalize Pace & Goal
        </button>
      </div>

      {/* Domain Selection Tabs Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
          Select Learning Domain
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {domains.map((dom) => {
            const isSelected = selectedDomain?.id === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => onSelectDomain(dom)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-lime-brand bg-lime-brand/10 shadow-glow-lime'
                    : 'border-charcoal-border bg-charcoal-card hover:bg-charcoal-hover hover:border-text-muted/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dom.color || '#B7F36B' }} />
                    <span className="text-[10px] text-text-muted">{dom.estimated_duration}</span>
                  </div>
                  <h4 className="text-xs font-bold text-text-white leading-tight mb-1 truncate">
                    {dom.title}
                  </h4>
                </div>
                {isSelected && (
                  <span className="text-[9px] font-bold text-lime-brand uppercase mt-2">Active Path</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual-Column Learning Experience */}
      {selectedDomain && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Ordered Module Sequence (5 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-charcoal-border/50">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Ordered Curriculum ({modules.length} Modules)
              </span>
              <span className="text-xs text-lime-brand font-semibold">
                {modules.filter((m) => isModuleCompleted(m.id)).length} of {modules.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {modules.map((mod, index) => {
                const completed = isModuleCompleted(mod.id);
                const score = getModuleScore(mod.id);
                const isSelected = selectedModule?.id === mod.id;

                return (
                  <div
                    key={mod.id}
                    onClick={() => {
                      setSelectedModule(mod);
                      setActiveLessonIndex(0);
                      setShowQuiz(false);
                      setQuizResult(null);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-lime-brand bg-charcoal-card shadow-card-glass'
                        : 'border-charcoal-border bg-charcoal-card/60 hover:bg-charcoal-card'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          completed 
                            ? 'bg-lime-brand text-charcoal' 
                            : isSelected
                            ? 'bg-lime-brand/20 text-lime-brand border border-lime-brand/40'
                            : 'bg-charcoal-hover text-text-muted'
                        }`}>
                          {completed ? <Check className="w-3.5 h-3.5" /> : index + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-text-white leading-snug">
                            {mod.title}
                          </h4>
                          <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
                            {mod.description}
                          </p>
                        </div>
                      </div>

                      {score !== null && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-lime-brand/20 text-lime-brand shrink-0">
                          {score}%
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-charcoal-border/40 flex items-center justify-between text-[11px] text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-text-muted" />
                        <span>{mod.estimated_hours}h effort</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-yellow-brand" />
                        <span>Pass: {mod.passing_score}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Module Content & Assessment Reader (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-charcoal-card border border-charcoal-border p-6 shadow-card-glass">
            {selectedModule ? (
              <div>
                
                {/* Module Title Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-charcoal-border/60 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-lime-brand">
                      Module {selectedModule.order_index} • {selectedDomain.title}
                    </span>
                    <h3 className="text-xl font-bold font-display text-text-white mt-0.5">
                      {selectedModule.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowQuiz(false)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        !showQuiz
                          ? 'bg-lime-brand text-charcoal font-semibold'
                          : 'bg-charcoal text-text-muted hover:text-text-white'
                      }`}
                    >
                      Lesson & Code
                    </button>
                    {selectedModule.quiz && (
                      <button
                        onClick={() => {
                          setShowQuiz(true);
                          setQuizResult(null);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          showQuiz
                            ? 'bg-lime-brand text-charcoal font-semibold'
                            : 'bg-charcoal text-text-muted hover:text-text-white'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        Adaptive Assessment
                      </button>
                    )}
                  </div>
                </div>

                {/* VIEW 1: LESSONS & INTERACTIVE CODE VIEW */}
                {!showQuiz && (
                  <div className="space-y-6">
                    {/* Lesson Tab Selector if multiple lessons */}
                    {selectedModule.lessons && selectedModule.lessons.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-charcoal-border/30">
                        {selectedModule.lessons.map((les, idx) => (
                          <button
                            key={les.id}
                            onClick={() => setActiveLessonIndex(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                              activeLessonIndex === idx
                                ? 'bg-charcoal-hover text-text-white border border-lime-brand/30'
                                : 'text-text-muted hover:text-text-white'
                            }`}
                          >
                            Part {idx + 1}: {les.title}
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedModule.lessons && selectedModule.lessons[activeLessonIndex] ? (
                      <div className="space-y-5">
                        <div className="text-xs text-text-muted/90 leading-relaxed whitespace-pre-wrap font-sans">
                          {selectedModule.lessons[activeLessonIndex].content}
                        </div>

                        {selectedModule.lessons[activeLessonIndex].code_example && (
                          <div className="rounded-xl overflow-hidden border border-charcoal-border bg-[#0d0f0c]">
                            <div className="px-4 py-2 bg-charcoal border-b border-charcoal-border flex items-center justify-between text-xs text-text-muted">
                              <span className="flex items-center gap-1.5">
                                <Code2 className="w-3.5 h-3.5 text-lime-brand" />
                                Interactive Code Sandbox
                              </span>
                              <span className="text-[10px] uppercase font-mono text-lime-brand">TypeScript / JSX</span>
                            </div>
                            <pre className="p-4 text-xs font-mono text-lime-brand overflow-x-auto leading-relaxed">
                              <code>{selectedModule.lessons[activeLessonIndex].code_example}</code>
                            </pre>
                          </div>
                        )}

                        {selectedModule.lessons[activeLessonIndex].resources && (
                          <div className="p-4 rounded-xl bg-charcoal border border-charcoal-border/50">
                            <h5 className="text-xs font-bold text-text-white mb-2 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-orange-brand" />
                              Recommended Engineering References
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {selectedModule.lessons[activeLessonIndex].resources!.map((res, i) => (
                                <a
                                  key={i}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-md bg-charcoal-card border border-charcoal-border hover:border-lime-brand text-xs text-text-muted hover:text-text-white transition-all flex items-center gap-1"
                                >
                                  <span>{res.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 flex items-center justify-between border-t border-charcoal-border/40">
                          <span className="text-xs text-text-muted">
                            Mastered this concept? Verify your knowledge to advance.
                          </span>
                          {selectedModule.quiz && (
                            <button
                              onClick={() => {
                                setShowQuiz(true);
                                setQuizResult(null);
                              }}
                              className="px-5 py-2.5 rounded-xl bg-lime-brand text-charcoal font-semibold text-xs hover:bg-lime-brand/90 transition-all flex items-center gap-1.5 shadow-glow-lime"
                            >
                              Take Module Quiz
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-text-muted">Lesson content currently loading...</p>
                    )}
                  </div>
                )}

                {/* VIEW 2: ADAPTIVE MODULE ASSESSMENT QUIZ */}
                {showQuiz && selectedModule.quiz && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-charcoal border border-charcoal-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-text-white">
                          {selectedModule.quiz.title}
                        </span>
                        <span className="text-xs text-yellow-brand font-semibold">
                          Required Passing Score: {selectedModule.quiz.passing_percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">
                        Test your grasp of the concepts covered in this module. Submitting updates your live progress record on the server.
                      </p>
                    </div>

                    {/* Quiz Questions List */}
                    <div className="space-y-6">
                      {selectedModule.quiz.questions.map((q, qIndex) => {
                        const selectedOption = quizAnswers[q.id];
                        const feedback = quizResult?.questionFeedback?.find(
                          (f: any) => f.questionId === q.id
                        );

                        return (
                          <div
                            key={q.id}
                            className="p-4 rounded-xl bg-charcoal/60 border border-charcoal-border space-y-3"
                          >
                            <h5 className="text-xs font-bold text-text-white leading-relaxed">
                              {qIndex + 1}. {q.question}
                            </h5>

                            <div className="space-y-2">
                              {q.options.map((opt, optIndex) => {
                                const isChecked = selectedOption === optIndex;
                                let optionClasses =
                                  'border-charcoal-border bg-charcoal-card text-text-muted hover:border-text-muted/40';

                                if (isChecked) {
                                  optionClasses =
                                    'border-lime-brand bg-lime-brand/10 text-lime-brand font-medium';
                                }

                                if (feedback) {
                                  if (optIndex === feedback.correctIndex) {
                                    optionClasses =
                                      'border-green-500 bg-green-500/20 text-green-300 font-bold';
                                  } else if (isChecked && !feedback.isCorrect) {
                                    optionClasses =
                                      'border-red-500 bg-red-500/20 text-red-300 line-through';
                                  }
                                }

                                return (
                                  <label
                                    key={optIndex}
                                    className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${optionClasses}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      checked={isChecked}
                                      disabled={!!quizResult}
                                      onChange={() => handleAnswerSelect(q.id, optIndex)}
                                      className="mt-0.5 accent-lime-brand"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>

                            {feedback && (
                              <div
                                className={`p-3 rounded-lg text-xs leading-relaxed ${
                                  feedback.isCorrect
                                    ? 'bg-green-500/10 text-green-300 border border-green-500/30'
                                    : 'bg-orange-500/10 text-orange-300 border border-orange-500/30'
                                }`}
                              >
                                <strong>{feedback.isCorrect ? 'Correct!' : 'Key Takeaway:'}</strong>{' '}
                                {feedback.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quiz Result Banner */}
                    {quizResult && (
                      <div
                        className={`p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                          quizResult.passed
                            ? 'bg-green-500/10 border-green-500/40 text-green-300'
                            : 'bg-orange-500/10 border-orange-500/40 text-orange-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              {quizResult.passed ? 'Assessment Passed!' : 'Needs Review'}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 font-bold">
                              {quizResult.percentage}% Score ({quizResult.score}/{quizResult.totalQuestions})
                            </span>
                          </div>
                          <p className="text-xs mt-1 text-text-muted">
                            {quizResult.passed
                              ? 'Your progress record has been persisted. You have unlocked subsequent domain challenges.'
                              : 'Review the explanations above and retake the assessment to solidify your understanding.'}
                          </p>
                        </div>

                        {!quizResult.passed && (
                          <button
                            onClick={() => {
                              setQuizAnswers({});
                              setQuizResult(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-orange-brand text-charcoal font-bold text-xs hover:bg-orange-brand/90 transition-all flex items-center gap-1.5 shrink-0"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Retake Quiz
                          </button>
                        )}
                      </div>
                    )}

                    {/* Submit Button */}
                    {!quizResult && (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={
                          isSubmittingQuiz ||
                          Object.keys(quizAnswers).length <
                            selectedModule.quiz.questions.length
                        }
                        className="w-full py-3 rounded-xl bg-lime-brand text-charcoal font-semibold text-xs hover:bg-lime-brand/90 transition-all flex items-center justify-center gap-2 shadow-glow-lime disabled:opacity-50"
                      >
                        {isSubmittingQuiz ? (
                          <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Submit Assessment for Verification'
                        )}
                      </button>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <p className="text-xs text-text-muted">Select a module from the left to begin.</p>
            )}
          </div>

        </div>
      )}

      {/* Personalization Modal */}
      {showPersonalizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-charcoal-deep border border-charcoal-border p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-display text-text-white">
              Personalize Your Path
            </h3>
            <p className="text-xs text-text-muted">
              PathPilot customizes module duration and suggested milestone projects based on your target role and available schedule.
            </p>

            <div>
              <label className="block text-xs font-medium text-text-white mb-1.5">
                Target Engineering Role
              </label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-card border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-lime-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-white mb-1.5">
                Weekly Time Commitment
              </label>
              <select
                value={learningPace}
                onChange={(e) => setLearningPace(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-card border border-charcoal-border text-xs text-text-white focus:outline-none focus:border-lime-brand"
              >
                <option value="Accelerated (20+ hrs/week)">Accelerated (20+ hrs/week)</option>
                <option value="Moderate (10-15 hrs/week)">Moderate (10-15 hrs/week)</option>
                <option value="Part-time (5-8 hrs/week)">Part-time (5-8 hrs/week)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPersonalizeModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-text-muted hover:text-text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPersonalizeModal(false)}
                className="px-4 py-2 rounded-xl bg-lime-brand text-charcoal font-semibold text-xs hover:bg-lime-brand/90"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
