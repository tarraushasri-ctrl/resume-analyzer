/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ResumeUploadForm } from './components/ResumeUploadForm';
import { AnalysisResultView } from './components/AnalysisResultView';
import { ATSJobMatcher } from './components/ATSJobMatcher';
import { N8NIntegrationGuide } from './components/N8NIntegrationGuide';
import { SubmissionHistory } from './components/SubmissionHistory';
import { Footer } from './components/Footer';
import { ATSScoreResult, SubmissionHistoryItem } from './types';
import {
  Sparkles,
  FileCheck,
  ShieldCheck,
  Zap,
  ArrowRight,
  Target,
  BarChart3,
  Bot,
} from 'lucide-react';
import atsVisual from './assets/images/ats_screening_visual_1790759243050.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'matcher' | 'workflow' | 'history'>('analyzer');
  const [activeResult, setActiveResult] = useState<ATSScoreResult | null>(null);
  const [activeSubmission, setActiveSubmission] = useState<SubmissionHistoryItem | null>(null);

  const handleAnalysisSuccess = (result: ATSScoreResult, submission: SubmissionHistoryItem) => {
    setActiveResult(result);
    setActiveSubmission(submission);
    // Smooth scroll up to results
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleResetAnalysis = () => {
    setActiveResult(null);
    setActiveSubmission(null);
  };

  const handleSelectHistoryItem = (item: SubmissionHistoryItem) => {
    if (item.atsScore) {
      setActiveResult(item.atsScore);
      setActiveSubmission(item);
      setActiveTab('analyzer');
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const handleScrollToUpload = () => {
    setActiveTab('analyzer');
    setActiveResult(null);
    setTimeout(() => {
      const el = document.getElementById('upload-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={handleScrollToUpload}
      />

      <main className="flex-1">
        {activeTab === 'analyzer' && (
          <>
            <HeroSection
              onStartAnalysis={handleScrollToUpload}
              onExploreWorkflow={() => setActiveTab('workflow')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
              {/* Form or Analysis Results */}
              {activeResult && activeSubmission ? (
                <AnalysisResultView
                  result={activeResult}
                  submission={activeSubmission}
                  onReset={handleResetAnalysis}
                  onOpenJobMatcher={() => setActiveTab('matcher')}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8">
                    <ResumeUploadForm onAnalysisSuccess={handleAnalysisSuccess} />
                  </div>

                  {/* Sidebar with Guidance & Quick Proof */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Visual Asset Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                      <img
                        src={atsVisual}
                        alt="Applicant Tracking System parsing interface"
                        className="w-full h-auto object-cover aspect-[4/3]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-5 space-y-2">
                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                          ATS Ingestion Standard
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Automated Filtering Simulation
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          98% of Fortune 500 enterprises use ATS bots to pre-screen candidates before any human recruiter reads a page. Our n8n workflow models these exact parsing algorithms.
                        </p>
                      </div>
                    </div>

                    {/* Checkpoints Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Evaluated In Real-Time
                      </h4>
                      <ul className="space-y-3 text-xs text-slate-600">
                        <li className="flex items-start gap-2.5">
                          <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>Font hierarchy & standard margins compliance</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <Target className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>Action verb density & leadership indicators</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <BarChart3 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>Quantifiable revenue & speed metric extraction</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>Direct n8n webhook payload integrity verification</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Bento Grid: 01, 02, 03 Capabilities */}
              <div className="pt-6">
                <div className="mb-6">
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Core Capabilities
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                    How the Resume Analyzer Workflow Operates
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                    <span className="text-xs font-semibold font-mono text-slate-400">01</span>
                    <h3 className="text-base font-bold text-slate-900">
                      Webhook Ingestion & Validation
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Captures the binary document through n8n’s Cloud form trigger node. Cleans and decodes multi-page PDFs, DOCX, and text files.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                    <span className="text-xs font-semibold font-mono text-slate-400">02</span>
                    <h3 className="text-base font-bold text-slate-900">
                      Heuristic Matrix Scoring
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Evaluates impact verbs, structural hierarchy, contact signals, and high-frequency industry keywords against enterprise benchmarks.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                    <span className="text-xs font-semibold font-mono text-slate-400">03</span>
                    <h3 className="text-base font-bold text-slate-900">
                      Actionable Optimization
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Yields an instant, prioritized roadmap of missing keywords, phrasing enhancements, and formatting corrections to maximize interview call rates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'matcher' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ATSJobMatcher
              currentAtsResult={activeResult}
              onNavigateToUpload={handleScrollToUpload}
            />
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <N8NIntegrationGuide />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SubmissionHistory
              onSelectSubmission={handleSelectHistoryItem}
              onNavigateToUpload={handleScrollToUpload}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
