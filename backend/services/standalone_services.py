import io
import zipfile
from pdf2image import convert_from_bytes
from typing import Literal

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
        # Convert PDF bytes to a list of PIL Images
        images = convert_from_bytes(pdf_bytes)
        
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
