# Architecture

PortfolioGen employs a decoupled client-server architecture, splitting the responsibilities between a client-side React UI and a Python FastAPI backend that interfaces with AI models.

## High-Level Data Flow

1. **Client Interaction:** The user configures generation settings (Resume File, Theme, Features, AI Engine) in the React frontend.
2. **Payload Transmission:** The frontend constructs a `multipart/form-data` payload and POSTs it to the backend endpoint `/generate-portfolio-code/`.
3. **Data Extraction:** The backend intercepts the file stream and routes it to `resume_parser.py`, which uses specialized libraries to extract raw text based on the MIME type.
4. **Prompt Engineering:** The extracted text and user configurations are sent to the dynamic prompt loader (`prompts.py`), which constructs the final AI system prompts (`prompt.md` and `dual_prompt.md`).
5. **AI Generation:** The backend sends the prompt to the selected AI engine (Local Ollama or Cloud OpenRouter).
6. **Delivery:** The generated raw HTML is stripped of any markdown code block formatting and returned as a JSON payload to the frontend.
7. **Rendering:** The frontend securely mounts the raw HTML inside a sandboxed `iframe` for live preview.

## System Components

### 1. The Frontend (React 18)
- **State Management:** Handled natively via React `useState` and `useCallback` hooks to minimize overhead.
- **Styling Architecture:** Relies on CSS Modules / Vanilla CSS. It uses CSS variables (Custom Properties) to define a consistent design system (colors, glassmorphism filters, spacing) making it highly maintainable without bloated UI libraries.
- **Component Layout:** The main view is broken down into a hero section, a configuration grid (steps 1-4), and an interactive preview window.

### 2. The Backend (FastAPI)
FastAPI was chosen for its high performance, native async capabilities, and automatic interactive API documentation (Swagger UI).
- **Controllers (`main.py`):** Defines the API routes, handles CORS, and orchestrates the data pipeline.
- **Parsers (`resume_parser.py`):** Modular extractor functions mapping MIME types to extraction strategies (`PyPDF2` for PDFs, `python-docx` for Word, `pytesseract` for Images).

### 3. The AI Integration Layer
This layer handles formatting the input data and communicating with Language Models.
- **Dynamic Prompt Loader (`prompts.py`):** Acts as a central dictionary mapping user-friendly theme names to precise color palette prompt instructions. 
- **Ollama Client (`ollama_client.py`):** Interfaces with `localhost:11434` to hit local models (e.g., `llama3.2`), ideal for privacy-focused users.
- **OpenRouter Client (`openrouter_client.py`):** Interfaces with cloud models via REST API for heavier lifting.

## Dual Intelligence Mode

A unique architectural feature of PortfolioGen is the **Dual Intelligence Mode**. 

Instead of relying on a single zero-shot generation pass, this mode utilizes a multi-agent pipeline:
1. **Pass 1 (Local Draft):** The local Ollama model quickly drafts the initial HTML structure.
2. **Pass 2 (Cloud Polish):** The drafted HTML is passed as context to the OpenRouter model along with `dual_prompt.md`, instructing the cloud model to strictly focus on refining typography, spacing, and CSS elegance, rather than regenerating content from scratch.
