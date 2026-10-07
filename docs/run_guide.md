# Run Guide

This guide covers how to set up and run PortfolioGen locally. PortfolioGen consists of a FastAPI backend and a React frontend. Both servers need to be running simultaneously.

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v18+) - Required for the React frontend.
- **Python** (v3.9+) - Required for the FastAPI backend.
- **Ollama** (v0.1+) - Required for local AI generation.
- **Tesseract OCR** - Required for parsing text from image resumes.
  - Windows: [Download from UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)
  - macOS: `brew install tesseract`
  - Linux: `sudo apt install tesseract-ocr`

---

## 1. Local AI Setup (Ollama)

If you plan to use the "Local" or "Dual Intelligence" model, you must have Ollama running in the background.

1. Install [Ollama](https://ollama.com/).
2. Open a terminal and pull the required model:
   ```bash
   ollama pull llama3.2
   ```
3. Ensure the Ollama background service is running. You can start it manually via `ollama serve` or run `ollama run llama3.2` to keep it active.

---

## 2. Backend Setup

The backend handles resume parsing and communicating with the AI models.

1. Open a new terminal window.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Create your environment file:
   ```bash
   cp .env.example .env
   ```
6. Open `.env` and add your OpenRouter API key:
   ```env
   OPENROUTER_KEY=your_actual_api_key_here
   ```
7. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *The API will be available at `http://127.0.0.1:8000`.*

---

## 3. Frontend Setup

The frontend is a React SPA (Single Page Application).

1. Open a **second** terminal window.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm start
   ```
   *The React app will automatically open in your default browser at `http://localhost:3000`.*

---

## Usage

1. Open `http://localhost:3000` in your web browser.
2. Drag and drop your resume (PDF, DOCX, or Image).
3. Select your desired visual theme and AI engine.
4. Click **Generate My Portfolio** and preview the live HTML output!
