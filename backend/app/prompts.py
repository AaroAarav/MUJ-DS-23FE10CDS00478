import os

THEMES = {
    "Professional": "Navy (#1e293b), Slate (#475569), Light blue (#e2e8f0), Teal accent (#14b8a6)",
    "Space": "Deep blue (#0f172a), Purple accents (#7c3aed), Silver text (#f1f5f9), Subtle gradients",
    "Forest": "Forest green (#166534), Earth brown (#92400e), Sage (#84cc16), Cream (#fef3c7)",
    "Coffee": "Espresso (#451a03), Mocha (#a16207), Latte (#fbbf24), Cream (#fffbeb)",
    "Ocean": "Deep blue (#1e40af), Turquoise (#06b6d4), Seafoam (#10b981), Pearl (#f0fdfa)",
    "Sunset": "Deep orange (#ea580c), Coral (#f97316), Gold (#eab308), Peach (#fef3c7)"
}

def _load_prompt(filename: str) -> str:
    prompt_path = os.path.join(os.path.dirname(__file__), filename)
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()

def get_base_prompt(resume_text: str, theme: str, features: str) -> str:
    template = _load_prompt("prompt.md")
    theme_description = THEMES.get(theme, theme)
    return template.format(
        resume_text=resume_text,
        theme=theme,
        theme_description=theme_description,
        features=features
    )

def get_dual_prompt(existing_html: str, resume_text: str, theme: str, features: str) -> str:
    template = _load_prompt("dual_prompt.md")
    theme_description = THEMES.get(theme, theme)
    return template.format(
        existing_html=existing_html,
        resume_text=resume_text,
        theme=theme,
        theme_description=theme_description,
        features=features
    )
