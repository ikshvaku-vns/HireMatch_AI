import pdfParse from "pdf-parse";

export const extractTextFromPdfBuffer = async (
  buffer: Buffer,
): Promise<string> => {
  try {
    const { text } = await pdfParse(buffer);
    return text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to parse PDF document.");
  }
};
