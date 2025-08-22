import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';

// --- Reusable Icon Components ---
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const RegenerateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    </svg>
);


function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [portfolioHtmlCode, setPortfolioHtmlCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [theme, setTheme] = useState('Professional');
  const [customTheme, setCustomTheme] = useState('');
  const [features, setFeatures] = useState(''); // --- NEW: Features state ---
  const [copySuccess, setCopySuccess] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [lastGenerated, setLastGenerated] = useState(null);

  const PRESET_THEMES = [
    { name: 'Professional', color: '#818cf8' }, { name: 'Forest', color: '#34d399' },
    { name: 'Coffee', color: '#d2b48c' }, { name: 'Space', color: '#93c5fd' },
  ];

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setPortfolioHtmlCode('');
      setError('');
      setLastGenerated(null);
    }
  }, []);

  const handleGeneration = useCallback(async () => {
    if (!selectedFile) {
      setError('Please upload a resume file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    const finalTheme = theme === 'Custom' ? customTheme : theme;
    if (!finalTheme) {
        setError('Please select or enter a theme.');
        setIsLoading(false);
        return;
    }
    formData.append('theme', finalTheme);
    formData.append('features', features); // --- NEW: Append features ---

    try {
      const response = await axios.post('http://127.0.0.1:8000/generate-portfolio-code/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPortfolioHtmlCode(response.data.html_code);
      setLastGenerated({ theme: finalTheme, features }); // Track generated state
    } catch (err) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, theme, customTheme, features]);
  
  const handleDownload = () => {
    if (!portfolioHtmlCode) return;
    const blob = new Blob([portfolioHtmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(portfolioHtmlCode).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
        setCopySuccess('Failed!');
    });
  };

  const finalTheme = theme === 'Custom' ? customTheme : theme;
  const showRegenerateButton = portfolioHtmlCode && (lastGenerated?.theme !== finalTheme || lastGenerated?.features !== features);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h1>AI Portfolio Generator</h1>
          <p>Instantly craft a stunning, themed portfolio website from your resume.</p>
        </div>
      </header>
      
      <main className="container">
        <div className="card upload-card">
          <div className="steps-container">
            <div className="step">
              <h2 className="card-title">1. Upload Resume</h2>
              <div className="file-upload-wrapper">
                <input type="file" id="resume-upload" className="file-input" onChange={handleFileChange} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                <label htmlFor="resume-upload" className="file-label">
                  <UploadIcon />
                  <span>{fileName || 'Choose a file...'}</span>
                </label>
              </div>
            </div>
            <div className="step">
              <h2 className="card-title">2. Select a Theme</h2>
              <div className="theme-selector-visual">
                {PRESET_THEMES.map(t => (
                    <button key={t.name} className={`theme-button ${theme === t.name ? 'active' : ''}`} onClick={() => setTheme(t.name)}>
                        <span className="theme-swatch" style={{'--theme-color': t.color}}></span>
                        {t.name}
                    </button>
                ))}
                <button className={`theme-button ${theme === 'Custom' ? 'active' : ''}`} onClick={() => setTheme('Custom')}>
                    <span className="theme-swatch plus-icon"><PlusIcon /></span>
                    Custom
                </button>
              </div>
              {theme === 'Custom' && (
                  <input
                      type="text"
                      className="custom-theme-input"
                      placeholder="e.g., 'Cyberpunk Neon'"
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value)}
                  />
              )}
            </div>
          </div>

          {/* --- NEW: Features Input Section --- */}
          <div className="step">
            <h2 className="card-title">3. Optional Features</h2>
            <input
                type="text"
                className="custom-theme-input"
                placeholder="e.g., 'add a navbar', 'multi-page layout'"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
            />
          </div>
          
          <div className="main-cta-container">
            {showRegenerateButton ? (
                <button onClick={handleGeneration} disabled={isLoading} className="cta-button regenerate-button">
                    <span className="button-content">
                        {isLoading ? <div className="loader"></div> : <><RegenerateIcon /> Regenerate Portfolio</>}
                    </span>
                </button>
            ) : (
                <button onClick={handleGeneration} disabled={isLoading || !selectedFile} className="cta-button">
                    <span className="button-content">
                        {isLoading ? <div className="loader"></div> : 'Generate Portfolio'}
                    </span>
                </button>
            )}
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        {portfolioHtmlCode && (
          <div className="card result-card">
            <div className="result-header">
                <div className="tabs">
                    <button className={`tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
                    <button className={`tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
                </div>
                <button onClick={handleDownload} className="action-button download-button">
                    <DownloadIcon />
                    Download
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'preview' && (
                    <div className="iframe-container">
                        <iframe
                            srcDoc={portfolioHtmlCode}
                            title="Portfolio Preview"
                            className="portfolio-iframe"
                        />
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="code-container">
                        <div className="code-header">
                            <h3>HTML Code</h3>
                            <button onClick={handleCopyCode} className="copy-button">
                                <CopyIcon />
                                {copySuccess || 'Copy'}
                            </button>
                        </div>
                        <pre className="code-block">
                            <code>{portfolioHtmlCode}</code>
                        </pre>
                    </div>
                )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="App-footer">
        <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;
