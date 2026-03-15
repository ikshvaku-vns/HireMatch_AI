import { GoogleGenAI } from "@google/genai";

export const analyzeResumeMatch = async (
  jdText: string,
  resumeText: string,
) => {
  const prompt = `
ROLE: You are an expert technical recruiter and hiring manager evaluating a candidate's resume against a Job Description (JD).

INSTRUCTIONS:
You must return ONLY a valid JSON object matching the exact schema below. Do not include markdown codeblocks, preambles, or explanations outside the JSON.
Analyze the candidate's resume against the JD to determine fit, identify gaps, and generate relevant interview questions based on those gaps and the role.

SCORING GUIDE:
- 85-100: Near-perfect match, candidate has almost every required skill
- 70-84: Strong match, minor gaps only
- 50-69: Moderate match, some important skills missing
- 30-49: Weak match, significant gaps
- 0-29: Poor match, wrong role entirely
Be honest and strict. Do not inflate scores.

JSON SCHEMA:
{
  "overallScore": <integer 0-100>,
  "breakdown": {
    "skillsMatch": <integer 0-100>,
    "experienceRelevance": <integer 0-100>,
    "educationFit": <integer 0-100>,
    "keywordsCoverage": <integer 0-100>
  },
  "verdict": "<Short 1-line verdict e.g. 'Strong Match — ready to apply'>",
  "skillsFound": ["<string>", "<string>"],
  "skillsMissing": ["<string>", "<string>"],
  "suggestions": [
  {
    "original": "<weak bullet from resume>",
    "improved": "<rewritten version>",
    "reason": "<why this change helps>"
  }
],
  "interviewQuestions": [
    {
      "question": "<string>",
      "category": "<'Technical' | 'Behavioural' | 'Gap Probing'>",
      "hint": "<string explanation of what a good answer looks like>"
    }
  ]
}

Ensure you provide exactly 10 interview questions (5 Technical, 3 Behavioural, 2 Gap Probing).
Ensure you provide at most 5 actionable suggestions for improving the resume.

---
JOB DESCRIPTION:
${jdText}

---
CANDIDATE RESUME:
${resumeText}
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from the environment");
    }
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) throw new Error("No response from Gemini");

    // Attempt to parse to ensure it's valid JSON before returning
    const parsedData = JSON.parse(response.text);
    return parsedData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze resume with Gemini.");
  }
};
