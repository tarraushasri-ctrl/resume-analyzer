export interface SubmissionHistoryItem {
  id: string;
  timestamp: number;
  name: string;
  email: string;
  fileName: string;
  fileSize: number;
  status: 'completed' | 'processing' | 'failed';
  n8nResponse?: string;
  atsScore?: ATSScoreResult;
}

export interface ATSScoreResult {
  overallScore: number;
  compatibilityTier: 'High' | 'Moderate' | 'Needs Work';
  summary: string;
  metrics: {
    formatScore: number;
    actionVerbsScore: number;
    quantifiableResultsScore: number;
    skillsDensityScore: number;
    contactInfoScore: number;
  };
  detectedSkills: string[];
  suggestedKeywords: string[];
  strengths: string[];
  criticalFixes: string[];
}

export interface JobMatchAnalysis {
  matchPercentage: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  roleTitle: string;
}
