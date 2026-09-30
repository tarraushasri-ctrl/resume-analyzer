import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, Sparkles, Copy, Check } from 'lucide-react';
import { ATSScoreResult } from '../types';

interface ATSJobMatcherProps {
  currentAtsResult?: ATSScoreResult | null;
  onNavigateToUpload: () => void;
}

export const ATSJobMatcher: React.FC<ATSJobMatcherProps> = ({
  currentAtsResult,
  onNavigateToUpload,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const sampleJobListing = `
Senior Software Engineer (Frontend / Full-Stack)
We are seeking an experienced Senior Software Engineer to build scalable web applications.
Key Requirements:
- 5+ years building production applications with React, TypeScript, and Node.js
- Strong proficiency in modern CSS (Tailwind CSS), REST APIs, and GraphQL
- Experience with Docker, CI/CD pipelines, and cloud platforms (AWS / GCP)
- Familiarity with PostgreSQL, microservices architecture, and automated testing (Jest, Cypress)
- Demonstrated ability to mentor engineers and lead technical architecture initiatives.
  `.trim();

  const handleUseSampleJob = () => {
    setJobDescription(sampleJobListing);
    runMatch(sampleJobListing);
  };

  const runMatch = (descText: string) => {
    if (!descText.trim()) return;

    // Standard high-value keywords to look for in job description
    const keywordsList = [
      'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'PostgreSQL',
      'Docker', 'Kubernetes', 'AWS', 'GCP', 'REST APIs', 'GraphQL',
      'CI/CD', 'Git', 'Agile', 'Microservices', 'Tailwind CSS',
      'Automated Testing', 'Jest', 'Cypress', 'System Architecture',
      'Performance Optimization', 'Security', 'Mentorship'
    ];

    const lowerDesc = descText.toLowerCase();
    const candidateSkills = currentAtsResult?.detectedSkills || [
      'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'Agile'
    ];

    const matched: string[] = [];
    const missing: string[] = [];

    keywordsList.forEach((kw) => {
      if (lowerDesc.includes(kw.toLowerCase())) {
        const hasSkill = candidateSkills.some(
          (cs) => cs.toLowerCase() === kw.toLowerCase() || cs.toLowerCase().includes(kw.toLowerCase())
        );
        if (hasSkill) {
          matched.push(kw);
        } else {
          missing.push(kw);
        }
      }
    });

    const totalTarget = matched.length + missing.length;
    const score = totalTarget > 0 ? Math.round((matched.length / totalTarget) * 100) : 85;

    setMatchedKeywords(matched);
    setMissingKeywords(missing);
    setMatchPercentage(Math.max(40, score));
    setAnalyzed(true);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    runMatch(jobDescription);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Targeted Job Description Matcher</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Compare Resume Against Specific Job Posting
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Paste the vacancy requirements below to detect ATS keyword gaps before applying.
            </p>
          </div>

          <button
            type="button"
            onClick={handleUseSampleJob}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Load Sample Job Description</span>
          </button>
        </div>

        <form onSubmit={handleAnalyze} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Paste Job Description or Requirements:
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full job description including responsibilities, qualifications, and tech stack..."
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!jobDescription.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Analyze Keyword Match
            </button>
            <button
              type="button"
              onClick={() => {
                setJobDescription('');
                setAnalyzed(false);
              }}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </form>

        {analyzed && (
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Keyword Alignment Rate
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold font-mono tabular-nums text-slate-900">
                    {matchPercentage}%
                  </span>
                  <span className="text-xs text-slate-500">
                    {matchPercentage >= 80
                      ? 'Exceptional match with candidate credentials'
                      : 'Good baseline — recommend closing missing keyword gaps'}
                  </span>
                </div>
              </div>

              <button
                onClick={onNavigateToUpload}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Upload Resume to n8n
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Keywords */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-emerald-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Matched In Resume ({matchedKeywords.length})
                  </h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {matchedKeywords.length > 0 ? (
                    matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No direct keyword overlap found yet.</span>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
                  <XCircle className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Missing in Resume ({missingKeywords.length})
                  </h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {missingKeywords.length > 0 ? (
                    missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-white text-amber-800 border border-amber-200 px-2 py-0.5 rounded"
                      >
                        + {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-700">All scanned key qualifications satisfied!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
