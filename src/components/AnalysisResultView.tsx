import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Printer,
  RotateCcw,
  Zap,
  Tag,
  Check,
  Award,
} from 'lucide-react';
import { ATSScoreResult, SubmissionHistoryItem } from '../types';

interface AnalysisResultViewProps {
  result: ATSScoreResult;
  submission: SubmissionHistoryItem;
  onReset: () => void;
  onOpenJobMatcher?: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  submission,
  onReset,
  onOpenJobMatcher,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 75) return 'bg-blue-600';
    return 'bg-amber-500';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(
        {
          candidate: submission.name,
          email: submission.email,
          file: submission.fileName,
          timestamp: new Date(submission.timestamp).toISOString(),
          evaluation: result,
          n8nWebhookResponse: submission.n8nResponse,
        },
        null,
        2
      )
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${submission.name.replace(/\s+/g, '_')}_Resume_Analysis.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Confirmation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Successfully Transmitted to n8n Cloud</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-mono text-[11px]">HTTP 200 OK</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Resume Analysis: {submission.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
              <span>{submission.fileName}</span>
              <span aria-hidden="true">·</span>
              <span>{(submission.fileSize / 1024).toFixed(1)} KB</span>
              <span aria-hidden="true">·</span>
              <span>{new Date(submission.timestamp).toLocaleDateString()} at {new Date(submission.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Print report"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadReport}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Export report JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <button
              onClick={onReset}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* Executive Score Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
          <div className="lg:col-span-4 bg-slate-50 rounded-xl p-6 border border-slate-200/80 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Overall ATS Score
            </span>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-extrabold font-mono tabular-nums text-slate-900">
                {result.overallScore}
              </span>
              <span className="text-lg font-bold text-slate-400">/100</span>
            </div>
            <div className="mt-3 text-xs text-slate-600">
              Compatibility Tier: <strong className="text-slate-900 font-semibold">{result.compatibilityTier}</strong>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Evaluated across 35+ automated screening factors
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dimension Performance Breakdown
            </h3>
            
            {/* Dimension 1: Formatting */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Format & Parsing Reliability</span>
                <span className="font-mono tabular-nums">{result.metrics.formatScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getBarColor(result.metrics.formatScore)}`}
                  style={{ width: `${result.metrics.formatScore}%` }}
                />
              </div>
            </div>

            {/* Dimension 2: Action Verbs */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Action Verb & Leadership Strength</span>
                <span className="font-mono tabular-nums">{result.metrics.actionVerbsScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getBarColor(result.metrics.actionVerbsScore)}`}
                  style={{ width: `${result.metrics.actionVerbsScore}%` }}
                />
              </div>
            </div>

            {/* Dimension 3: Quantifiable Results */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Quantified Metric Achievements</span>
                <span className="font-mono tabular-nums">{result.metrics.quantifiableResultsScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getBarColor(result.metrics.quantifiableResultsScore)}`}
                  style={{ width: `${result.metrics.quantifiableResultsScore}%` }}
                />
              </div>
            </div>

            {/* Dimension 4: Skill Density */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Skills & Industry Keyword Density</span>
                <span className="font-mono tabular-nums">{result.metrics.skillsDensityScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getBarColor(result.metrics.skillsDensityScore)}`}
                  style={{ width: `${result.metrics.skillsDensityScore}%` }}
                />
              </div>
            </div>

            {/* Dimension 5: Contact Info */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Header Completeness & Contact Signals</span>
                <span className="font-mono tabular-nums">{result.metrics.contactInfoScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getBarColor(result.metrics.contactInfoScore)}`}
                  style={{ width: `${result.metrics.contactInfoScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 block mb-1">Evaluation Assessment:</strong>
          {result.summary}
        </div>
      </div>

      {/* Identified Keywords and Recommended Missing Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detected Skills */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Check className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Identified Core Competencies ({result.detectedSkills.length})
            </h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.detectedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-4">
            These keywords were recognized by automated parsing and will match recruiter filter searches.
          </p>
        </div>

        {/* Suggested Missing Keywords */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Recommended Target Keywords
              </h3>
            </div>
            {onOpenJobMatcher && (
              <button
                onClick={onOpenJobMatcher}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Scan Job Match →
              </button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.suggestedKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-md"
              >
                + {kw}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-4">
            Adding these high-frequency domain terms can boost matching for senior-level opportunities.
          </p>
        </div>
      </div>

      {/* Strengths & Critical Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Verified Formatting Strengths
            </h3>
          </div>
          <ul className="mt-4 space-y-3">
            {result.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Fixes */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Recommended High-Priority Revisions
            </h3>
          </div>
          <ul className="mt-4 space-y-3">
            {result.criticalFixes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <ArrowRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
