import io
import os
import zipfile
from typing import Literal


class PdfConversionUnavailableError(RuntimeError):
    """Raised when the runtime cannot rasterize PDFs into images."""

class StandaloneServices:
    def compress_files(self, file_streams: list[tuple[str, bytes]]) -> bytes:
        """
        Compresses a list of (filename, bytes) into a single ZIP archive byte array.
        """
        output_stream = io.BytesIO()
        with zipfile.ZipFile(output_stream, "w", zipfile.ZIP_DEFLATED) as zipf:
            for filename, file_bytes in file_streams:
                zipf.writestr(filename, file_bytes)
                
        return output_stream.getvalue()

    def convert_pdf_to_images(self, pdf_bytes: bytes, format: Literal["png", "jpeg"] = "png") -> list[bytes]:
        """
        Converts a PDF into a list of image byte arrays using pdf2image.
        """
        try:
            from pdf2image import convert_from_bytes  # type: ignore
        except Exception as exc:  # pragma: no cover - import depends on runtime image libs
            raise PdfConversionUnavailableError(
                "PDF conversion runtime is unavailable. Install pdf2image and Poppler on the backend host."
            ) from exc

        poppler_path = os.getenv("POPPLER_PATH") or None
        try:
            images = convert_from_bytes(pdf_bytes, poppler_path=poppler_path)
        except Exception as exc:
            raise PdfConversionUnavailableError(
                "PDF page rendering is unavailable in this environment. "
                "Install Poppler or set POPPLER_PATH on the backend host."
            ) from exc
        
        image_streams = []
        for img in images:
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format=format.upper())
            image_streams.append(img_byte_arr.getvalue())
            
        return image_streams

# Singleton instance
_standalone_services = StandaloneServices()

def get_standalone_services() -> StandaloneServices:
    return _standalone_services
