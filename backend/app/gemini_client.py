import google.generativeai as genai
import os
from dotenv import load_dotenv
from fastapi import HTTPException

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

def generate_portfolio_code(resume_text: str, theme: str, features: str) -> str:
    """
    Uses the Gemini API to generate a professional, single-page portfolio website.
    """
    if not model:
        raise HTTPException(status_code=500, detail="Gemini API not configured. Check API key.")

    prompt = f"""You are an expert frontend developer specializing in modern, responsive portfolio websites. Generate a complete, single-file HTML portfolio based on the specifications below.

## OUTPUT FORMAT (CRITICAL)
- Response must be ONLY raw HTML code
- Start with <!DOCTYPE html> and end with </html>
- No markdown code blocks, no explanations, no comments
- Clean, production-ready code only

## DESIGN PRINCIPLES
**Visual Hierarchy:** Clear typography scale (h1: 3-4rem, h2: 2-2.5rem, body: 1rem-1.125rem)
**Spacing:** Consistent padding/margins using Tailwind's spacing scale (8, 12, 16, 24, 32)
**Responsive Design:** Mobile-first approach with breakpoints (sm, md, lg, xl)
**Performance:** Optimized images, minimal JavaScript, fast loading

## THEME IMPLEMENTATION: "{theme}"
**Professional:** Navy (#1e293b), Slate (#475569), Light blue (#e2e8f0), Teal accent (#14b8a6)
**Space:** Deep blue (#0f172a), Purple accents (#7c3aed), Silver text (#f1f5f9), Subtle gradients
**Forest:** Forest green (#166534), Earth brown (#92400e), Sage (#84cc16), Cream (#fef3c7)
**Coffee:** Espresso (#451a03), Mocha (#a16207), Latte (#fbbf24), Cream (#fffbeb)
**Ocean:** Deep blue (#1e40af), Turquoise (#06b6d4), Seafoam (#10b981), Pearl (#f0fdfa)
**Sunset:** Deep orange (#ea580c), Coral (#f97316), Gold (#eab308), Peach (#fef3c7)

## REQUIRED SECTIONS & STRUCTURE

**1. Hero Section**
- Full viewport height with centered content
- Name in large, bold typography
- Professional title/tagline
- Subtle call-to-action button
- Optional: Professional headshot placeholder or geometric background

**2. About Section**
- Engaging 2-3 paragraph summary
- Key strengths highlighted
- Personal touch that shows personality

**3. Experience Section**
- Timeline or card-based layout
- Each position in distinct, well-spaced cards
- Company, role, duration, key achievements
- Use bullet points for accomplishments

**4. Skills Section (Two Distinct Subsections)**
- **Technical Skills:** Categorized by type
  - Programming Languages
  - Frameworks & Libraries  
  - Databases & Tools
  - Other Technologies
- **Soft Skills:** 6-8 key interpersonal skills
- Visual skill indicators (progress bars or badges)

**5. Projects Section** (if applicable)
- Project cards with descriptions
- Technologies used tags
- Links to demos/repositories (placeholder)

**6. Contact Section**
- Professional contact form or contact info
- Social media links (LinkedIn, GitHub, etc.)
- Location if relevant

## TECHNICAL REQUIREMENTS

**Styling Framework:** Tailwind CSS via CDN
```html
<script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
```

**Typography:** Use Inter or Poppins via Google Fonts
**Icons:** Embed SVG icons directly (Heroicons style)
**Animations:** CSS transitions and transforms only
- Smooth hover effects (0.3s transitions)
- Subtle scroll-triggered animations using Intersection Observer
- Scale/translate effects on cards and buttons

## SPECIAL FEATURES: "{features}"
**Navbar:** Sticky navigation with smooth scrolling to sections
**Dark Mode:** Toggle between light/dark themes
**Multi-page:** JavaScript show/hide sections (single file)
**Contact Form:** Functional styling with validation states
**Animations:** Enhanced scroll animations and micro-interactions
**Portfolio Gallery:** Image grid with lightbox effect

## CONTENT PARSING GUIDELINES
- Extract name, title, contact info from resume
- Summarize experience into compelling descriptions
- Categorize skills appropriately
- Create project cards if projects mentioned
- Generate professional but personalized about section
- **CRITICAL:** Ensure all significant information from the resume is included. If the resume contains sections like 'Certifications', 'Publications', 'Awards', or 'Volunteer Experience', you MUST create dedicated, well-designed sections for them in the portfolio. Do not omit any information.

## CODE QUALITY STANDARDS
- Semantic HTML5 elements
- Accessible markup (ARIA labels, alt text)
- Clean, organized CSS classes
- Minimal, efficient JavaScript
- Cross-browser compatibility
- Mobile-responsive design

## RESUME DATA TO PARSE:
---
{resume_text}
---

Generate the complete HTML file now."""

    try:
        response = model.generate_content(prompt)
        generated_code = response.text.strip()
        
        # Clean up response formatting
        if generated_code.startswith("```html"):
            generated_code = generated_code[7:]
        if generated_code.startswith("```"):
            generated_code = generated_code[3:]
        if generated_code.endswith("```"):
            generated_code = generated_code[:-3]
            
        return generated_code.strip()
        
    except Exception as e:
        error_detail = f"Error generating portfolio with Gemini: {e}"
        print(error_detail)
        raise HTTPException(status_code=500, detail=error_detail)
