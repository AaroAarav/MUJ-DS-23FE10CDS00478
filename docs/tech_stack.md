# Tech Stack

PortfolioGen is built using a modern, lightweight, and performant stack combining Python, React, and various AI integrations.

## Frontend Stack

- **React (v18+)**: The core UI library used for building the component-based user interface.
- **Axios**: Used for making promise-based HTTP requests to the FastAPI backend.
- **Vanilla CSS (Custom Properties)**: Used exclusively for styling to maintain a zero-dependency design system without the overhead of heavy UI frameworks. Implements modern web features like CSS Grid, Flexbox, and `backdrop-filter` for glassmorphism.
- **HTML5 iFrame**: Used as a secure sandbox for live-previewing the generated HTML portfolio code directly in the browser.

## Backend Stack

- **Python (v3.9+)**: The core programming language for the backend infrastructure.
- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python. It is used to handle file uploads and route data to the AI models asynchronously.
- **Uvicorn**: A lightning-fast ASGI server implementation used to run the FastAPI application.
- **python-dotenv**: Loads environment variables from the `.env` file into the system environment.

### Parsing Libraries
To handle multiple types of resume uploads, PortfolioGen integrates specific parsers:
- **PyPDF2**: A pure-python PDF library used to extract text from uploaded `.pdf` resumes.
- **python-docx**: Used to parse text and paragraphs from `.docx` Word documents.
- **Pillow (PIL)**: The Python Imaging Library, used to open and prepare uploaded `.jpg` and `.png` resumes for OCR.
- **pytesseract**: A python wrapper for Google's Tesseract-OCR Engine, enabling text extraction from image-based resumes.

## AI Integration Stack

- **Ollama**: An open-source tool for running large language models locally. We interact directly with its REST API exposed on `localhost:11434`.
- **OpenRouter API**: A unified interface to access a wide variety of cloud-hosted LLMs.
- **Tailwind CSS (CDN)**: While not used to style the *application* itself, the AI models are heavily prompted to utilize Tailwind utility classes (injected via CDN) to style the *generated portfolios*.

## Development Tools
- **Git**: For version control.
- **NPM**: Node package manager for handling frontend dependencies.
- **Pip & venv**: Python package manager and virtual environment tools.
