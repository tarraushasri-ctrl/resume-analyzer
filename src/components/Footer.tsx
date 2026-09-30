import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { DEFAULT_N8N_URL } from '../services/n8nService';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-slate-900">Resume Analyzer Pro</span>
            <span aria-hidden="true">·</span>
            <span>Automated Document Intelligence</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href={DEFAULT_N8N_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <span>Target n8n Form</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://n8n.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              Powered by n8n
            </a>
            <span>Zero Data Retention</span>
            <span>Enterprise ATS Standard</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© {new Date().getFullYear()} Resume Analyzer Pro. All rights reserved.</p>
          <p>
            Payload mapped to n8n form trigger: <code className="font-mono text-slate-500">field-0</code> (Name), <code className="font-mono text-slate-500">field-1</code> (Email), <code className="font-mono text-slate-500">field-2</code> (Resume Attachment).
          </p>
        </div>
      </div>
    </footer>
  );
};
