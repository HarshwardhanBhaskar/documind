import io
from pypdf import PdfWriter, PdfReader

class PDFMergeService:
    def merge_pdfs(self, file_streams: list[bytes]) -> bytes:
        """
        Takes a list of PDF byte arrays and merges them in sequence.
        Returns the merged PDF as a byte array.
        """
        writer = PdfWriter()

        for file_bytes in file_streams:
            # Read each PDF from bytes in memory
            reader = PdfReader(io.BytesIO(file_bytes))
            # Append all pages to the writer
            writer.append(reader)

        output_stream = io.BytesIO()
        writer.write(output_stream)
        
        return output_stream.getvalue()

# Singleton instance
_pdf_merge_service = PDFMergeService()

def get_pdf_merge_service() -> PDFMergeService:
    return _pdf_merge_service
