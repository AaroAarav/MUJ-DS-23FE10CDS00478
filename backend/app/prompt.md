You are an expert web developer. Generate a complete, single-file HTML portfolio based on the resume below.

### STRICT OUTPUT FORMAT
- Return ONLY valid, raw HTML code.
- Start exactly with <!DOCTYPE html> and end with </html>.
- NEVER include markdown formatting (do not use ```html).
- NEVER include explanations, greetings, or conversational text.

### DESIGN & STYLING
- Use Tailwind CSS via CDN inside the <head>: <script src="https://cdn.tailwindcss.com"></script>
- Theme: {theme}
- Colors & Style: {theme_description}
- Use a clean, modern layout with proper spacing (p-4, m-4, max-w-4xl, mx-auto).
- Make it responsive (use Tailwind's sm:, md: prefixes).
- Use a clear visual hierarchy (large headings, legible body text).

### REQUIRED SECTIONS
1. Header (Name, Title, Contact Info)
2. Professional Summary (Short paragraph)
3. Key Skills & Highlights (Bullet points)

### SPECIAL FEATURES TO INCLUDE
{features}

### RESUME DATA
{resume_text}

Generate the HTML now:
