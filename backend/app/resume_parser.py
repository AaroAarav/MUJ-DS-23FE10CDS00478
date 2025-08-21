import PyPDF2
import docx
from PIL import Image
import pytesseract
import io
from fastapi import HTTPException
from transformers import pipeline

# Load a pre-trained NER model from Hugging Face
ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english", grouped_entities=True)

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

def extract_entities_from_text(text: str) -> dict:
    """
    Extracts named entities from text using a pre-trained NER model.
    """
    entities = ner_pipeline(text)
    structured_data = {
        "persons": [e["word"] for e in entities if e["entity_group"] == "PER"],
        "organizations": [e["word"] for e in entities if e["entity_group"] == "ORG"],
        "locations": [e["word"] for e in entities if e["entity_group"] == "LOC"],
        "misc": [e["word"] for e in entities if e["entity_group"] == "MISC"],
        "raw_text": text
    }
    return structured_data