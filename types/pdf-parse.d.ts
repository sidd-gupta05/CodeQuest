declare module 'pdf-parse' {
  interface PDFInfo {
    PDFFormatVersion?: string;
    IsAcroFormPresent?: boolean;
    IsXFAPresent?: boolean;
    [key: string]: unknown;
  }

  interface PDFMetadata {
    [key: string]: unknown;
  }

  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata?: PDFMetadata;
    text: string;
    version: string;
  }

  function pdf(
    input: Buffer,
    options?: Record<string, unknown>
  ): Promise<PDFParseResult>;
  export default pdf;
}
