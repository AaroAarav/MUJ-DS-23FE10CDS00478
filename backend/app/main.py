from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import io
import logging

# Configure basic logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

# Import functions from our other modules
from . import resume_parser
from . import ollama_client
from . import openrouter_client

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
    features: str = Form(""),  # --- NEW: Accept features, default to empty string ---
    model: str = Form("ollama")
):
    """
    Receives a resume, theme, and optional features, then uses Gemini to generate portfolio HTML.
    """
    contents = await file.read()
    file_stream = io.BytesIO(contents)
    
    logger.info(f"Received request to generate portfolio (Theme: {theme}, Features: {features})")
    
    # 1. Extract text from the resume
    logger.info("Extracting text from the uploaded resume...")
    resume_text = resume_parser.get_text_from_resume(file_stream, file.content_type)
    
    # 2. Use specified model to generate the portfolio code
    if model.lower() == "openrouter":
        logger.info("Sending request to OpenRouter API to generate the HTML...")
        portfolio_html = openrouter_client.generate_portfolio_code(resume_text, theme, features)
    elif model.lower() == "dual":
        logger.info("Dual Intelligence: Sending request to Ollama API first...")
        ollama_html = ollama_client.generate_portfolio_code(resume_text, theme, features)
        logger.info("Dual Intelligence: Sending Ollama output to OpenRouter API for refinement...")
        portfolio_html = openrouter_client.refine_portfolio_code(ollama_html, resume_text, theme, features)
    else:
        logger.info("Sending request to Ollama API to generate the HTML. This may take a minute or two locally...")
        portfolio_html = ollama_client.generate_portfolio_code(resume_text, theme, features)
    logger.info("Portfolio generation complete!")
    
    # Return the generated HTML code directly
    return {"html_code": portfolio_html}

@app.get("/", response_class=HTMLResponse)
def read_root():
    return "<h1>Resume to Portfolio API is running.</h1>"
