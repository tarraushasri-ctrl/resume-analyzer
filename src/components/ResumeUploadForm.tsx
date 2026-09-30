import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Sparkles,
  Send,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import {
  DEFAULT_N8N_URL,
  submitResumeToN8N,
  analyzeResumeFile,
  createSampleResumeFile,
} from '../services/n8nService';
import { ATSScoreResult, SubmissionHistoryItem } from '../types';

interface ResumeUploadFormProps {
  onAnalysisSuccess: (result: ATSScoreResult, submission: SubmissionHistoryItem) => void;
}

export const ResumeUploadForm: React.FC<ResumeUploadFormProps> = ({
  onAnalysisSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [targetJobRole, setTargetJobRole] = useState('');
  const [customN8nUrl, setCustomN8nUrl] = useState(DEFAULT_N8N_URL);
  const [showEndpointSettings, setShowEndpointSettings] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusStep, setStatusStep] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const hasValidExt = validExtensions.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExt) {
      setErrorMessage('Please upload a PDF, DOCX, DOC, or TXT file.');
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 15MB limit.');
      return;
    }

    setErrorMessage('');
    setFile(selectedFile);
  };

  const handleLoadSample = () => {
    const sample = createSampleResumeFile();
    setFile(sample);
    if (!name) setName('Alexander Morgan');
    if (!email) setEmail('alexander.morgan@example.com');
    if (!targetJobRole) setTargetJobRole('Senior Full-Stack Engineer');
    setErrorMessage('');
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Please enter your full name (field-0).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address (field-1).');
      return;
    }
    if (!file) {
      setErrorMessage('Please upload your resume document (field-2).');
      return;
    }

    setErrorMessage('');
    setStatus('uploading');
    setStatusStep('Transmitting document to n8n workflow webhook...');

    try {
      // 1. Submit to n8n Form trigger
      const n8nResult = await submitResumeToN8N({
        name: name.trim(),
        email: email.trim(),
        file: file,
        targetUrl: customN8nUrl.trim(),
      });

      setStatusStep('Parsing ATS heuristics and keyword indexing...');
      setStatus('analyzing');

      // 2. Perform deep ATS heuristics & document intelligence
      const atsResult = await analyzeResumeFile(file, name.trim(), targetJobRole.trim());

      const historyItem: SubmissionHistoryItem = {
        id: 'sub_' + Date.now().toString(36),
        timestamp: Date.now(),
        name: name.trim(),
        email: email.trim(),
        fileName: file.name,
        fileSize: file.size,
        status: n8nResult.success ? 'completed' : 'processing',
        n8nResponse: n8nResult.success
          ? JSON.stringify(n8nResult.data || { status: 200 })
          : n8nResult.error,
        atsScore: atsResult,
      };

      // Persist in localStorage
      try {
        const stored = localStorage.getItem('resume_analyzer_history');
        const list: SubmissionHistoryItem[] = stored ? JSON.parse(stored) : [];
        list.unshift(historyItem);
        localStorage.setItem('resume_analyzer_history', JSON.stringify(list.slice(0, 30)));
      } catch (err) {
        console.error('LocalStorage write error', err);
      }

      setStatus('success');
      setStatusStep('Analysis complete! Redirecting to report view...');

      setTimeout(() => {
        onAnalysisSuccess(atsResult, historyItem);
      }, 700);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An error occurred during workflow dispatch.');
    }
  };

  return (
    <div id="upload-section" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Submit Document for ATS Evaluation
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Target Workflow: n8n Cloud</span>
            <span aria-hidden="true">·</span>
            <span>Fields: field-0, field-1, field-2</span>
            <span aria-hidden="true">·</span>
            <span>Encrypted in Transit</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Pre-fills a realistic senior engineer resume for instant testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Load Sample Resume</span>
          </button>
          <button
            type="button"
            onClick={() => setShowEndpointSettings(!showEndpointSettings)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            title="Configure n8n webhook URL"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Optional endpoint configuration toggle */}
      {showEndpointSettings && (
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              n8n Form Target Webhook URL:
            </label>
            <button
              onClick={() => setCustomN8nUrl(DEFAULT_N8N_URL)}
              className="text-[11px] text-blue-600 hover:underline cursor-pointer"
            >
              Reset to Default
            </button>
          </div>
          <input
            type="url"
            value={customN8nUrl}
            onChange={(e) => setCustomN8nUrl(e.target.value)}
            className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Posts multipart/form-data with field-0, field-1, and field-2</span>
            <a
              href={customN8nUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-600 hover:text-blue-600"
            >
              <span>Verify endpoint</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Upload & Data Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* field-0: Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Candidate Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="field-0"
              required
              placeholder="e.g. Alexander Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-colors"
            />
            <span className="text-[11px] text-slate-400">Maps to n8n parameter: field-0</span>
          </div>

          {/* field-1: Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="field-1"
              required
              placeholder="e.g. alexander.morgan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-colors"
            />
            <span className="text-[11px] text-slate-400">Maps to n8n parameter: field-1</span>
          </div>
        </div>

        {/* Optional Target Job Role */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Target Job Title / Domain Focus (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Software Engineer, Product Manager, Data Scientist"
            value={targetJobRole}
            onChange={(e) => setTargetJobRole(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-colors"
          />
          <span className="text-[11px] text-slate-400">Calibrates keyword relevance benchmarking</span>
        </div>

        {/* field-2: File Drag & Drop Zone */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Upload Resume Document <span className="text-rose-500">*</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            name="field-2"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                  : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-slate-800">
                Click to browse or drop resume file here
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, DOCX, DOC, or TXT formats (up to 15MB)
              </p>
              <span className="inline-block mt-3 text-[11px] text-slate-400 font-mono">
                Payload Key: field-2 (multipart/form-data binary)
              </span>
            </div>
          ) : (
            <div className="border border-slate-200 bg-slate-50/60 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase">{file.name.split('.').pop()} Document</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 font-medium">Ready for transmission</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Execution Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={status === 'uploading' || status === 'analyzing'}
            className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === 'uploading' || status === 'analyzing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{statusStep || 'Processing with n8n workflow...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit to Resume Analyzer Workflow</span>
              </>
            )}
          </button>

          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500 text-center">
            <span>Direct execution on n8n Cloud</span>
            <span aria-hidden="true">·</span>
            <span>Zero document storage on external relays</span>
            <span aria-hidden="true">·</span>
            <span>Real-time ATS parser feedback</span>
          </div>
        </div>
      </form>
    </div>
  );
};
