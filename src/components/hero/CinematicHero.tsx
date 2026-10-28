import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Compass, Briefcase, ShieldCheck, ChevronDown } from 'lucide-react';

interface CinematicHeroProps {
  onSelectPortal: (portal: 'student' | 'employee' | 'admin') => void;
  onExploreCurriculum: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onSelectPortal,
  onExploreCurriculum,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [framesLoaded, setFramesLoaded] = useState<number>(0);
  const [totalFrames] = useState<number>(299);
  const [imagesCache, setImagesCache] = useState<Map<number, HTMLImageElement>>(new Map());
  const [useCanvas, setUseCanvas] = useState<boolean>(true);

  // Format frame number to 3-digit string (e.g., 1 -> "001")
  const getFrameUrl = (index: number) => {
    const padded = String(index).padStart(3, '0');
    return `/assets/frames/ezgif-frame-${padded}.jpg`;
  };

  // Preload key initial frames and populate image cache
  useEffect(() => {
    const cache = new Map<number, HTMLImageElement>();
    let loadedCount = 0;

    // Load initial start frame and end frame immediately
    const startImg = new Image();
    startImg.src = '/assets/pathpilot-start.jpg';
    startImg.onload = () => {
      cache.set(1, startImg);
      setFramesLoaded((prev) => prev + 1);
      drawFrame(startImg);
    };

    const endImg = new Image();
    endImg.src = '/assets/pathpilot-end.jpg';
    endImg.onload = () => {
      cache.set(totalFrames, endImg);
      setFramesLoaded((prev) => prev + 1);
    };

    // Stagger-load key interval frames (every 3rd frame) for ultra-fast responsive scrubbing
    for (let i = 1; i <= totalFrames; i += 2) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        cache.set(i, img);
        loadedCount++;
        setFramesLoaded(loadedCount);
      };
    }

    setImagesCache(cache);
  }, [totalFrames]);

  // Canvas drawing helper with crisp aspect-ratio cover
  const drawFrame = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Compute cover sizing
    const hRatio = rect.width / img.width;
    const vRatio = rect.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (rect.width - img.width * ratio) / 2;
    const centerShiftY = (rect.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShiftX,
      centerShiftY,
      img.width * ratio,
      img.height * ratio
    );

    // Dark cinematic overlay gradient to guarantee accessibility and high contrast
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
    gradient.addColorStop(0, 'rgba(23, 25, 22, 0.7)');
    gradient.addColorStop(0.5, 'rgba(23, 25, 22, 0.4)');
    gradient.addColorStop(1, 'rgba(23, 25, 22, 0.85)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.restore();
  };

  // Scroll listener tracking progress through pinned hero container
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
          
          if (totalScrollable <= 0) return;

          // Compute progress strictly between 0 and 1
          const currentScroll = -rect.top;
          const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
          setScrollProgress(progress);

          // Map progress to frame index 1..299
          const frameIndex = Math.min(totalFrames, Math.max(1, Math.round(progress * (totalFrames - 1)) + 1));
          
          // Find closest loaded frame in cache
          let targetImg = imagesCache.get(frameIndex);
          if (!targetImg) {
            // Find nearest loaded frame
            let minDiff = Infinity;
            for (const [idx, img] of imagesCache.entries()) {
              const diff = Math.abs(idx - frameIndex);
              if (diff < minDiff) {
                minDiff = diff;
                targetImg = img;
              }
            }
          }

          if (targetImg) {
            drawFrame(targetImg);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [imagesCache, totalFrames]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[240vh] bg-charcoal"
      id="cinematic-hero"
    >
      {/* Pinned Sticky Window */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        
        {/* Background Canvas Layer */}
        {useCanvas ? (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ filter: 'brightness(0.92) contrast(1.05)' }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <img
              src="/assets/pathpilot-start.jpg"
              alt="PathPilot Flow Start"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: 1 - scrollProgress }}
            />
            <img
              src="/assets/pathpilot-end.jpg"
              alt="PathPilot Flow End"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: scrollProgress }}
            />
            <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-xs" />
          </div>
        )}

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-brand/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content Overlay (Always above visual) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-32 pb-12 flex-1 flex flex-col justify-center">
          
          {/* Top Pill Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal-card/90 border border-charcoal-border backdrop-blur-md mb-6 w-fit shadow-card-glass">
            <span className="w-2 h-2 rounded-full bg-lime-brand animate-pulse" />
            <span className="text-xs font-medium text-text-white uppercase tracking-wider">
              Google Flow Architecture • Interactive Scroll Scrub
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-brand/20 text-lime-brand font-semibold">
              {Math.round(scrollProgress * 100)}% Journey
            </span>
          </div>

          {/* Main Headline */}
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display text-text-white leading-[1.08] mb-6">
              From First Skill to <br />
              <span className="bg-gradient-to-r from-lime-brand via-yellow-brand to-orange-brand bg-clip-text text-transparent">
                Job-Ready
              </span>{' '}
              Professional.
            </h1>
            
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed mb-8 max-w-2xl font-normal">
              PathPilot AI connects beginner learning, accelerated career preparation, and professional employee progression into one unified, intelligent platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => onSelectPortal('student')}
                className="px-6 py-3.5 rounded-xl bg-lime-brand text-charcoal font-semibold hover:bg-lime-brand/90 transition-all flex items-center gap-2 shadow-glow-lime transform hover:-translate-y-0.5"
              >
                <Compass className="w-5 h-5" />
                Launch Student Portal
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectPortal('employee')}
                className="px-6 py-3.5 rounded-xl bg-charcoal-card/90 border border-orange-brand/30 hover:border-orange-brand text-text-white font-medium hover:bg-charcoal-hover transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <Briefcase className="w-5 h-5 text-orange-brand" />
                Employee Career Progression
              </button>

              <button
                onClick={() => onSelectPortal('admin')}
                className="px-5 py-3.5 rounded-xl bg-charcoal-card/80 border border-charcoal-border hover:border-purple-brand/50 text-text-muted hover:text-text-white text-sm font-medium transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-purple-brand" />
                Admin Dashboard
              </button>
            </div>
          </div>

          {/* Three Live Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl pt-4">
            <div 
              onClick={() => onSelectPortal('student')}
              className="p-4 rounded-xl bg-charcoal-card/75 border border-charcoal-border hover:border-lime-brand/40 backdrop-blur-md transition-all cursor-pointer group shadow-card-glass"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-lime-brand uppercase tracking-wider">Model A & B</span>
                <span className="text-xs text-text-muted">Students</span>
              </div>
              <h3 className="text-base font-bold text-text-white group-hover:text-lime-brand transition-colors">
                Scratch to Advanced & Job-Ready
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Adaptive quizzes, structured paths, and real-time AI skill gap analysis.
              </p>
            </div>

            <div 
              onClick={() => onSelectPortal('employee')}
              className="p-4 rounded-xl bg-charcoal-card/75 border border-charcoal-border hover:border-orange-brand/40 backdrop-blur-md transition-all cursor-pointer group shadow-card-glass"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-orange-brand uppercase tracking-wider">Chaos Round Feature</span>
                <span className="text-xs text-text-muted">Working Pros</span>
              </div>
              <h3 className="text-base font-bold text-text-white group-hover:text-orange-brand transition-colors">
                Cross-Domain Career Transition
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Growth, switch (Mech/Hardware to Tech), and hybrid career ladders.
              </p>
            </div>

            <div 
              onClick={() => onSelectPortal('admin')}
              className="p-4 rounded-xl bg-charcoal-card/75 border border-charcoal-border hover:border-purple-brand/40 backdrop-blur-md transition-all cursor-pointer group shadow-card-glass"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-purple-brand uppercase tracking-wider">Enterprise Ops</span>
                <span className="text-xs text-text-muted">Platform Admin</span>
              </div>
              <h3 className="text-base font-bold text-text-white group-hover:text-purple-brand transition-colors">
                Full Curriculum CRUD & Heartbeat
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Real-time online/offline tracking, audit logs, and analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Prompt Bar */}
        <div className="relative z-10 w-full px-6 py-4 border-t border-charcoal-border/50 bg-charcoal/80 backdrop-blur-md flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-lime-brand animate-bounce" />
            <span>Scroll down to control cinematic transition video</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">
              Assets: 299 Sequential Frames • 60 FPS Bidirectional Scrubbing
            </span>
            <div className="w-24 h-1.5 bg-charcoal-hover rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-lime-brand to-orange-brand transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
