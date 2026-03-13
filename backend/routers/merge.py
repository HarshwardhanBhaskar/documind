from fastapi import APIRouter, File, UploadFile, HTTPException, status
from fastapi.responses import Response

from services.pdf_merge_service import get_pdf_merge_service

router = APIRouter(prefix="/utilities", tags=["Utilities"])

@router.post(
    "/merge-pdfs",
    summary="Merge multiple PDF files into one",
    description="Accepts multiple PDF files from a multipart form and returns a single merged PDF."
)
async def merge_pdfs(
    files: list[UploadFile] = File(...),
):
    if len(files) < 2:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Please provide at least two PDF files to merge.")

    file_streams: list[bytes] = []

    for file in files:
        if file.content_type != "application/pdf":
            raise HTTPException(status.HTTP_400_BAD_REQUEST, f"File {file.filename} is not a PDF.")
        
        content = await file.read()
        file_streams.append(content)

    # Use the service to merge the byte streams
    merge_service = get_pdf_merge_service()
    
    try:
        merged_pdf_bytes = merge_service.merge_pdfs(file_streams)
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Error merging PDFs: {e}")

    # Return the file stream directly as a downloadable PDF
    return Response(content=merged_pdf_bytes, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=merged_document.pdf"
    })
