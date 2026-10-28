import React, { useState, useEffect } from 'react';
import { ModelABeginner } from './ModelABeginner';
import { ModelBCareerAccelerator } from './ModelBCareerAccelerator';
import { AIChatbotDrawer } from './AIChatbotDrawer';
import { Domain, ProgressRecord, QuizAttempt } from '../../types';
import { api } from '../../services/api';
import { Compass, Target, Sparkles, BookOpen, Layers } from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const [learningModel, setLearningModel] = useState<'A' | 'B'>('A');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [domainsData, progressData] = await Promise.all([
        api.getDomains(),
        api.getStudentProgress().catch(() => ({ progress: [], quizAttempts: [] })),
      ]);
      setDomains(domainsData);
      if (domainsData.length > 0) {
        setSelectedDomain(domainsData[0]);
      }
      setProgress(progressData.progress || []);
      setQuizAttempts(progressData.quizAttempts || []);
    } catch (err) {
      console.error('Error loading student portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshProgress = async () => {
    try {
      const data = await api.getStudentProgress();
      setProgress(data.progress);
      setQuizAttempts(data.quizAttempts);
    } catch (err) {
      console.error('Error refreshing progress:', err);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-charcoal-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-brand/10 text-lime-brand border border-lime-brand/20 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            PathPilot Student Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-text-white tracking-tight">
            Personalized Engineering Trajectory
          </h1>
          <p className="text-sm text-text-muted mt-1.5 max-w-2xl">
            Choose your learning model below. Model A guides beginners from zero to advanced concepts with adaptive quizzes; Model B analyzes your existing skills to bridge the gap to high-paying engineering roles.
          </p>
        </div>
      </div>

      {/* Model Choice Cards (Distinct, Interactive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Model A Card */}
        <div
          onClick={() => setLearningModel('A')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            learningModel === 'A'
              ? 'border-lime-brand bg-charcoal-card shadow-glow-lime'
              : 'border-charcoal-border bg-charcoal-card/60 hover:bg-charcoal-card hover:border-lime-brand/40'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-lime-brand/10 border border-lime-brand/30 flex items-center justify-center text-lime-brand">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              learningModel === 'A'
                ? 'bg-lime-brand text-charcoal'
                : 'bg-charcoal-hover text-text-muted'
            }`}>
              {learningModel === 'A' ? 'Currently Selected' : 'Model A'}
            </span>
          </div>

          <h3 className="text-xl font-bold font-display text-text-white mb-2">
            Model A — Beginner: Scratch to Advanced
          </h3>
          <p className="text-xs text-text-muted leading-relaxed mb-4">
            Ideal for individuals new to a domain. Follow ordered curriculum modules, interactive coding examples, real-time quizzes with automated score persistence, and adaptive recommendations.
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] text-text-muted">
            <span className="px-2.5 py-1 rounded-md bg-charcoal border border-charcoal-border">8 Domains</span>
            <span className="px-2.5 py-1 rounded-md bg-charcoal border border-charcoal-border">Adaptive Quizzes</span>
            <span className="px-2.5 py-1 rounded-md bg-charcoal border border-charcoal-border">Contextual AI Mentor</span>
          </div>
        </div>

        {/* Model B Card */}
        <div
          onClick={() => setLearningModel('B')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            learningModel === 'B'
              ? 'border-orange-brand bg-charcoal-card shadow-glow-orange'
              : 'border-charcoal-border bg-charcoal-card/60 hover:bg-charcoal-card hover:border-orange-brand/40'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-brand/10 border border-orange-brand/30 flex items-center justify-center text-orange-brand">
              <Target className="w-6 h-6" />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              learningModel === 'B'
                ? 'bg-orange-brand text-charcoal'
                : 'bg-charcoal-hover text-text-muted'
            }`}>
              {learningModel === 'B' ? 'Currently Selected' : 'Model B'}
            </span>
          </div>

          <h3 className="text-xl font-bold font-display text-text-white mb-2">
            Model B — Career Accelerator: Job-Ready
          </h3>
          <p className="text-xs text-text-muted leading-relaxed mb-4">
            Ideal for students with some programming foundation seeking employment. Generates a personalized skills-gap analysis, target company matching, ATS resume evaluation, and mock interview practice.
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] text-text-muted">
            <span className="px-2.5 py-1 rounded-md bg-charcoal border border-charcoal-border">Skill-Gap Engine</span>
            <span className="px-2.5 py-1 rounded-md bg-charcoal border border-charcoal-border">ATS Resume Optimizer</span>
            <span className="px-2.5 py-1 rounded-md bg-charcoal border border-charcoal-border">Mock Interviews</span>
          </div>
        </div>

      </div>

      {/* Active Model Body */}
      {learningModel === 'A' ? (
        <ModelABeginner
          domains={domains}
          selectedDomain={selectedDomain}
          onSelectDomain={setSelectedDomain}
          progress={progress}
          quizAttempts={quizAttempts}
          onRefreshProgress={handleRefreshProgress}
        />
      ) : (
        <ModelBCareerAccelerator />
      )}

      {/* Contextual Persistent AI Learning Chatbot Drawer */}
      <AIChatbotDrawer
        currentDomain={selectedDomain?.title}
        currentLesson={learningModel === 'A' ? 'Active Module Concepts' : 'Career Readiness'}
      />

    </div>
  );
};
