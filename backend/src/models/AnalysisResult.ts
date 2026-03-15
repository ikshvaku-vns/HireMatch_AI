import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysisResult extends Document {
  shareId: string;
  jdText: string;
  resumeText: string;
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
  suggestions: {
    original: string;
    improved: string;
    reason: string;
  }[];
  interviewQuestions: {
    question: string;
    category: string;
    hint: string;
  }[];
  createdAt: Date;
}

const AnalysisResultSchema = new Schema({
  shareId: { type: String, required: true, unique: true },
  jdText: { type: String },
  resumeText: { type: String },
  overallScore: { type: Number, required: true },
  breakdown: {
    skillsMatch: { type: Number, required: true },
    experienceRelevance: { type: Number, required: true },
    educationFit: { type: Number, required: true },
    keywordsCoverage: { type: Number, required: true },
  },
  verdict: { type: String, required: true },
  skillsFound: [String],
  skillsMissing: [String],
  suggestions: [{
    original: String,
    improved: String,
    reason: String,
  }],
  interviewQuestions: [{
    question: String,
    category: String,
    hint: String,
  }],
}, { timestamps: true });

// 24hr TTL index -> Documents expire 86400 seconds after creation
AnalysisResultSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model<IAnalysisResult>('AnalysisResult', AnalysisResultSchema);
