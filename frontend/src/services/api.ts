import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? 'http://localhost:3000/api' : 'https://hirematch-ai-06y2.onrender.com/api');

export interface AnalysisResponse {
  shareId: string;
  overallScore: number;
  breakdown: {
    skillsMatch: number;
    experienceRelevance: number;
    educationFit: number;
    keywordsCoverage: number;
  };
  verdict: string;
  skillsFound: string[];
  skillsMissing: string[];
  suggestions: string[];
  interviewQuestions: {
    question: string;
    category: string;
    hint: string;
  }[];
}

export const analyzeResume = async (jdText: string, resumeFile: File): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('jdText', jdText);
  formData.append('resume', resumeFile);

  const response = await axios.post<AnalysisResponse>(`${API_BASE_URL}/analyze`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getAnalysisResult = async (shareId: string): Promise<AnalysisResponse> => {
  const response = await axios.get<AnalysisResponse>(`${API_BASE_URL}/analyze/${shareId}`);
  return response.data;
};
