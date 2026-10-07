import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import openrouter_client

try:
    result = openrouter_client.generate_portfolio_code(
        resume_text="Software Engineer with 5 years of experience in Python and JS.",
        theme="Professional",
        features=""
    )
    print("SUCCESS")
    print(result)
except Exception as e:
    import traceback
    traceback.print_exc()
