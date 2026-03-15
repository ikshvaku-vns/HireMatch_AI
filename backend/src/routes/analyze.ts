import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extractTextFromPdfBuffer } from '../services/pdfService';
import { analyzeResumeMatch } from '../services/geminiService';
import AnalysisResult from '../models/AnalysisResult';

const router = express.Router();

// Memory storage for multer (we don't need to save the PDF to disk)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/analyze', upload.single('resume'), async (req, res): Promise<void> => {
  try {
    const jdText = req.body.jdText;
    const file = req.file;

    if (!jdText) {
      res.status(400).json({ error: 'Job description text is required.' });
      return;
    }
    
    if (!file) {
       res.status(400).json({ error: 'Resume PDF file is required.' });
       return;
    }

    if (file.mimetype !== 'application/pdf') {
       res.status(400).json({ error: 'Only PDF files are supported currently.' });
       return;
    }

    // 1. Extract text from PDF
    const resumeText = await extractTextFromPdfBuffer(file.buffer);

    // 2. Call Gemini
    const analysisData = await analyzeResumeMatch(jdText, resumeText);

    // 3. Store result in MongoDB
    const shareId = uuidv4();
    const resultDoc = new AnalysisResult({
      shareId,
      jdText,
      resumeText,
      ...analysisData
    });

    await resultDoc.save();

    // 4. Return to frontend
    res.status(200).json({ shareId, ...analysisData });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during analysis." });
  }
});

// Endpoint to retrieve a shared result
router.get('/analyze/:shareId', async (req, res): Promise<void> => {
  try {
    const { shareId } = req.params;
    const result = await AnalysisResult.findOne({ shareId });

    if (!result) {
      res.status(404).json({ error: 'Analysis result not found or has expired.' });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analysis.' });
  }
});

export default router;
