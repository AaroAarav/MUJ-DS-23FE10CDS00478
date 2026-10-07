import os
import requests
import json
from dotenv import load_dotenv
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv(override=True)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_KEY")
MODEL_NAME = "nvidia/nemotron-3-super-120b-a12b:free"

def _call_openrouter(prompt: str) -> str:
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured. Check OPENROUTER_KEY in .env")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.6
    }
    
    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        response.raise_for_status()
        response_json = response.json()
        
        if "choices" not in response_json:
            error_msg = f"Missing 'choices' in OpenRouter response: {response.text}"
            logger.error(error_msg)
            raise ValueError(error_msg)
            
        generated_code = response_json["choices"][0]["message"]["content"].strip()
        
        # Clean up response formatting
        if generated_code.startswith("```html"):
            generated_code = generated_code[7:]
        if generated_code.startswith("```"):
            generated_code = generated_code[3:]
        if generated_code.endswith("```"):
            generated_code = generated_code[:-3]
            
        return generated_code.strip()
    except Exception as e:
        logger.error(f"Error calling OpenRouter: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating content with OpenRouter: {e}")

from .prompts import get_base_prompt, get_dual_prompt

def generate_portfolio_code(resume_text: str, theme: str, features: str) -> str:
    """
    Uses the OpenRouter API to generate a professional, single-page portfolio website.
    """
    prompt = get_base_prompt(resume_text, theme, features)
    logger.info("Calling OpenRouter model for generation...")
    return _call_openrouter(prompt)

def refine_portfolio_code(existing_html: str, resume_text: str, theme: str, features: str) -> str:
    """
    Uses the OpenRouter API to refine an existing HTML portfolio website.
    """
    prompt = get_dual_prompt(existing_html, resume_text, theme, features)
    logger.info("Calling OpenRouter model for refinement...")
    return _call_openrouter(prompt)
