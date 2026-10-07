import requests
import json
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)

from .prompts import get_base_prompt

def generate_portfolio_code(resume_text: str, theme: str, features: str) -> str:
    """
    Uses Ollama (llama3.2:latest) to generate a professional, single-page portfolio website.
    """
    prompt = get_base_prompt(resume_text, theme, features)

    try:
        logger.info("Calling Ollama API (llama3.2:latest)...")
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2:latest",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7
                }
            },
            timeout=300  # Llama locally can take some time
        )
        
        if response.status_code != 200:
            logger.error(f"Ollama API returned an error: {response.text}")
            raise HTTPException(status_code=500, detail="Failed to connect to local Ollama API. Make sure Ollama is running.")

        response_data = response.json()
        logger.info("Received response from Ollama API.")
        generated_code = response_data.get("response", "").strip()
        
        # Clean up response formatting
        if generated_code.startswith("```html"):
            generated_code = generated_code[7:]
        if generated_code.startswith("```"):
            generated_code = generated_code[3:]
        if generated_code.endswith("```"):
            generated_code = generated_code[:-3]
            
        return generated_code.strip()
        
    except requests.exceptions.RequestException as e:
        error_detail = f"Error connecting to Ollama API: {e}. Is Ollama running?"
        logger.error(error_detail)
        raise HTTPException(status_code=500, detail=error_detail)
