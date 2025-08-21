from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import io

# Import functions from our other modules
from . import resume_parser
from . import gemini_client

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-portfolio-code/")
async def generate_portfolio(
    file: UploadFile = File(...), 
    theme: str = Form("Professional"),
    features: str = Form("")  # --- NEW: Accept features, default to empty string ---
):
    """
    Receives a resume, theme, and optional features, then uses Gemini to generate portfolio HTML.
    """
    contents = await file.read()
    file_stream = io.BytesIO(contents)
    
    # 1. Extract text from the resume
    resume_text = resume_parser.get_text_from_resume(file_stream, file.content_type)
    
    # 2. Use Gemini to generate the portfolio code with the specified theme and features
    portfolio_html = gemini_client.generate_portfolio_code(resume_text, theme, features)
    
    # Return the generated HTML code directly
    return {"html_code": portfolio_html}

@app.get("/", response_class=HTMLResponse)
def read_root():
    return "<h1>Resume to Portfolio API is running.</h1>"
