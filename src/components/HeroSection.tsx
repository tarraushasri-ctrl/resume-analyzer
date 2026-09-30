import React from 'react';
import { ArrowDown, CheckCircle2, CloudLightning, ShieldCheck, FileCheck } from 'lucide-react';
import heroImage from '../assets/images/hero_resume_analyzer_1790759228995.jpg';

interface HeroSectionProps {
  onStartAnalysis: () => void;
  onExploreWorkflow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAnalysis,
  onExploreWorkflow,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background glow styling */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Proposition Block */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed editorial category marker (No pills!) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <span>Automated Career Intelligence</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>n8n Cloud Webhook Integration</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Enterprise ATS Compliance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight [text-wrap:balance]">
              Transform your resume into recruiter-ready precision.
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Submit your document directly to our intelligent automation workflow. Receive rigorous ATS compatibility scoring, keyword density benchmarks, and impactful phrasing recommendations within seconds.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartAnalysis}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition-all transform active:scale-98 flex items-center gap-2 cursor-pointer"
              >
                <span>Upload & Analyze Document</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreWorkflow}
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Inspect n8n Architecture
              </button>
            </div>

            {/* Proof of Rigor Adjacency */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white">35+</div>
                <div className="text-xs text-slate-400 mt-1">ATS Parser Checkpoints</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-blue-400">&lt;2.4s</div>
                <div className="text-xs text-slate-400 mt-1">Webhook Execution Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">100%</div>
                <div className="text-xs text-slate-400 mt-1">Zero-Data Retention Privacy</div>
              </div>
            </div>
          </div>

          {/* Focal Image Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 group">
              <img
                src={heroImage}
                alt="Resume analytics workspace with document scanning metrics"
                className="w-full h-auto object-cover aspect-[16/9] lg:aspect-[4/3] transform group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
              
              {/* Subtle overlay verification badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium text-white">n8n Form Endpoint Online</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">usha2006.app.n8n.cloud</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
