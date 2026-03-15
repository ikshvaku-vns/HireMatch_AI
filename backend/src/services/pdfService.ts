import { PDFParse } from 'pdf-parse';

export const extractTextFromPdfBuffer = async (buffer: Buffer): Promise<string> => {
  try {
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    return data.text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to parse PDF document.");
  }
};
