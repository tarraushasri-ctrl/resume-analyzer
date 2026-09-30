import React, { useState, useEffect } from 'react';
import { History, FileText, CheckCircle2, Clock, Trash2, Eye, ExternalLink } from 'lucide-react';
import { SubmissionHistoryItem, ATSScoreResult } from '../types';

interface SubmissionHistoryProps {
  onSelectSubmission: (item: SubmissionHistoryItem) => void;
  onNavigateToUpload: () => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  onSelectSubmission,
  onNavigateToUpload,
}) => {
  const [history, setHistory] = useState<SubmissionHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('resume_analyzer_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleClearAll = () => {
    if (confirm('Clear all local submission history?')) {
      localStorage.removeItem('resume_analyzer_history');
      setHistory([]);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem('resume_analyzer_history', JSON.stringify(updated));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>Submission Ledger</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Local Resume Submissions ({history.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Persisted history of resumes dispatched to the n8n Resume Analyzer workflow.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 self-start sm:self-auto cursor-pointer"
          >
            Clear Ledger
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold text-slate-700">No submissions recorded yet</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your resume or load the sample resume to test the n8n automation pipeline.
          </p>
          <button
            onClick={onNavigateToUpload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Upload Resume Now
          </button>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-slate-100">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectSubmission(item)}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 p-3 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{item.email}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.fileName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{(item.fileSize / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                {item.atsScore && (
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">ATS Score</span>
                    <span className="text-base font-bold font-mono tabular-nums text-slate-900">
                      {item.atsScore.overallScore}/100
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Delivered</span>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  {new Date(item.timestamp).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
