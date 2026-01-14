// =============================================================================
// PDF PAGE MODEL
// =============================================================================

export interface PdfPage {
  id: string;
  pageNumber: number;
  title: string;
  thumbnailUrl?: string;
}
