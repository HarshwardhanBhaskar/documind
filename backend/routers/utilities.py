from fastapi import APIRouter, File, UploadFile, HTTPException, status, Form
from fastapi.responses import Response

from services.standalone_services import get_standalone_services

router = APIRouter(prefix="/utilities", tags=["Utilities"])

@router.post(
    "/compress",
    summary="Compress documents into a single ZIP archive",
    description="Accepts multiple files and compresses them losslessly into a ZIP file."
)
async def compress_documents(
    files: list[UploadFile] = File(...),
):
    if not files:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Please provide at least one file to compress.")

    file_tuples = []
    for file in files:
        content = await file.read()
        file_tuples.append((file.filename or "file", content))

    service = get_standalone_services()
    
    try:
        zip_bytes = service.compress_files(file_tuples)
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Error compressing files: {e}")

    return Response(content=zip_bytes, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=compressed_documents.zip"
    })

@router.post(
    "/convert-pdf",
    summary="Convert a PDF file to a series of Images",
    description="Accepts a single PDF and converts it to a ZIP containing PNG or JPEG images of each page."
)
async def convert_pdf(
    file: UploadFile = File(...),
    output_format: str = Form("png"), # 'png' or 'jpeg'
):
    if file.content_type != "application/pdf":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Input file must be a PDF.")

    if output_format not in ["png", "jpeg"]:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Output format must be 'png' or 'jpeg'.")

    content = await file.read()
    service = get_standalone_services()

    try:
        image_streams = service.convert_pdf_to_images(content, format=output_format)
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Error converting PDF: {e}")

    # Zip the images back together
    file_tuples = []
    for i, img_bytes in enumerate(image_streams):
        file_tuples.append((f"page_{i+1}.{output_format}", img_bytes))

    try:
        zip_bytes = service.compress_files(file_tuples)
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Error creating output archive: {e}")

    return Response(content=zip_bytes, media_type="application/zip", headers={
        "Content-Disposition": f"attachment; filename=converted_images.zip"
    })
