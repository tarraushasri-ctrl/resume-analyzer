import React from 'react';
import { Sparkles, ExternalLink, Terminal } from 'lucide-react';
import { DEFAULT_N8N_URL } from '../services/n8nService';

interface NavbarProps {
  activeTab: 'analyzer' | 'matcher' | 'workflow' | 'history';
  setActiveTab: (tab: 'analyzer' | 'matcher' | 'workflow' | 'history') => void;
  onOpenUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('analyzer');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Resume Analyzer Pro</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'analyzer'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600 py-5 -mb-px'
                : 'text-slate-600'
            }`}
          >
            Upload & Analyze
          </button>
          <button
            onClick={() => setActiveTab('matcher')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'matcher'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600 py-5 -mb-px'
                : 'text-slate-600'
            }`}
          >
            ATS Job Matcher
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`transition-colors hover:text-slate-900 flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600 py-5 -mb-px'
                : 'text-slate-600'
            }`}
          >
            <Terminal className="w-4 h-4 text-slate-400" />
            <span>n8n Workflow Specs</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'history'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600 py-5 -mb-px'
                : 'text-slate-600'
            }`}
          >
            Submissions
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <a
            href={DEFAULT_N8N_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            title="Open raw n8n cloud form"
          >
            <span>Live n8n Form</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Analyze Resume
          </button>
        </div>
      </div>
    </header>
  );
};
