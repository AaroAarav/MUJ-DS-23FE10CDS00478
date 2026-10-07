import PyPDF2
import docx
from PIL import Image
import pytesseract
import io
from fastapi import HTTPException

def extract_text_from_pdf(file_stream: io.BytesIO) -> str:
    """Extracts text from a PDF file stream."""
    try:
        pdf_reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {e}")

def extract_text_from_docx(file_stream: io.BytesIO) -> str:
    """Extracts text from a DOCX file stream."""
    try:
        doc = docx.Document(file_stream)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing DOCX: {e}")

def extract_text_from_image(file_stream: io.BytesIO) -> str:
    """Extracts text from an image file stream using OCR."""
    try:
        image = Image.open(file_stream)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")

def get_text_from_resume(file_stream: io.BytesIO, content_type: str) -> str:
    """
    Extracts raw text from a resume file based on its content type.
    """
    text = ""
    if content_type == "application/pdf":
        text = extract_text_from_pdf(file_stream)
    elif content_type in ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]:
        text = extract_text_from_docx(file_stream)
    elif content_type.startswith("image/"):
        text = extract_text_from_image(file_stream)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the file.")
        
    return text
