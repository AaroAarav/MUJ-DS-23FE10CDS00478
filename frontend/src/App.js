import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import './App.css';

// --- Reusable Icon Components ---
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const RegenerateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
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
  const [features, setFeatures] = useState(''); 
  const [model, setModel] = useState('ollama'); 
  const [copySuccess, setCopySuccess] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [lastGenerated, setLastGenerated] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  const PRESET_THEMES = [
    { name: 'Professional', color: '#6366f1' }, 
    { name: 'Forest', color: '#10b981' },
    { name: 'Coffee', color: '#d97706' }, 
    { name: 'Space', color: '#3b82f6' },
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

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
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
    formData.append('features', features);
    formData.append('model', model);

    try {
      const response = await axios.post('http://127.0.0.1:8000/generate-portfolio-code/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPortfolioHtmlCode(response.data.html_code);
      setLastGenerated({ theme: finalTheme, features, model }); 
      // Scroll to result smoothly
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, theme, customTheme, features, model]);
  
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
  const showRegenerateButton = portfolioHtmlCode && (lastGenerated?.theme !== finalTheme || lastGenerated?.features !== features || lastGenerated?.model !== model);

  return (
    <div className="App">
      <div className="background-elements">
        <div className="glow-circle top-left"></div>
        <div className="glow-circle bottom-right"></div>
      </div>

      <header className="navbar">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon"></div>
            <span>PortfolioGen</span>
          </div>
          <div className="nav-links">
            <a href="#/" className="active">Generator</a>
            <a href="#/">Templates</a>
            <a href="#/">Pricing</a>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero-section">
          <div className="badge">✨ AI-Powered Generation</div>
          <h1 className="hero-title">From Resume to <span className="text-gradient">Stunning Portfolio</span></h1>
          <p className="hero-subtitle">Upload your resume, pick a theme, and let our AI craft a personalized, production-ready portfolio website in seconds.</p>
        </section>
        
        <div className="config-grid">
          {/* STEP 1: UPLOAD */}
          <div className="card glass-card">
            <div className="card-header">
              <div className="step-badge">1</div>
              <h2 className="card-title">Upload Resume</h2>
            </div>
            <div 
              className={`dropzone ${isDragging ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden-input" 
                onChange={handleFileChange} 
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
              />
              
              {!selectedFile ? (
                <div className="dropzone-content">
                  <div className="icon-container">
                    <UploadIcon />
                  </div>
                  <p className="dropzone-title">Click or drag & drop</p>
                  <p className="dropzone-subtitle">PDF, DOCX, JPG or PNG</p>
                </div>
              ) : (
                <div className="file-selected-content">
                  <FileIcon />
                  <span className="file-name">{fileName}</span>
                  <button className="change-file-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: THEME */}
          <div className="card glass-card">
            <div className="card-header">
              <div className="step-badge">2</div>
              <h2 className="card-title">Select Design Theme</h2>
            </div>
            <div className="theme-grid">
              {PRESET_THEMES.map(t => (
                  <button 
                    key={t.name} 
                    className={`theme-card ${theme === t.name ? 'active' : ''}`} 
                    onClick={() => setTheme(t.name)}
                  >
                      <div className="theme-swatch-large" style={{'--theme-color': t.color}}>
                        {theme === t.name && <CheckIcon />}
                      </div>
                      <span className="theme-name">{t.name}</span>
                  </button>
              ))}
              <button 
                className={`theme-card custom-theme-card ${theme === 'Custom' ? 'active' : ''}`} 
                onClick={() => setTheme('Custom')}
              >
                  <div className="theme-swatch-large custom-swatch">
                    {theme === 'Custom' ? <CheckIcon /> : <PlusIcon />}
                  </div>
                  <span className="theme-name">Custom</span>
              </button>
            </div>
            
            <div className={`custom-theme-input-wrapper ${theme === 'Custom' ? 'visible' : ''}`}>
                <input
                    type="text"
                    className="styled-input"
                    placeholder="Describe your theme (e.g., 'Cyberpunk Neon')"
                    value={customTheme}
                    onChange={(e) => setCustomTheme(e.target.value)}
                />
            </div>
          </div>

          {/* STEP 3 & 4: MODEL & FEATURES */}
          <div className="card glass-card span-full options-row">
            <div className="options-col">
              <div className="card-header">
                <div className="step-badge">3</div>
                <h2 className="card-title">AI Engine</h2>
              </div>
              <div className="segmented-control">
                  <button className={`segment ${model === 'ollama' ? 'active' : ''}`} onClick={() => setModel('ollama')}>
                      Ollama (Local)
                  </button>
                  <button className={`segment ${model === 'openrouter' ? 'active' : ''}`} onClick={() => setModel('openrouter')}>
                      OpenRouter
                  </button>
                  <button className={`segment ${model === 'dual' ? 'active' : ''}`} onClick={() => setModel('dual')}>
                      Dual Engine
                  </button>
              </div>
            </div>

            <div className="divider-vertical"></div>

            <div className="options-col">
              <div className="card-header">
                <div className="step-badge">4</div>
                <h2 className="card-title">Extra Features (Optional)</h2>
              </div>
              <input
                  type="text"
                  className="styled-input"
                  placeholder="e.g., 'add a dark mode toggle', 'include a blog section'"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
              />
            </div>
          </div>
          
          {/* CTA SECTION */}
          <div className="cta-wrapper span-full">
            {error && (
              <div className="error-alert">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            <button 
              onClick={handleGeneration} 
              disabled={isLoading || (!selectedFile && !showRegenerateButton)} 
              className={`primary-cta ${showRegenerateButton ? 'regenerate' : ''} ${isLoading ? 'loading' : ''}`}
            >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span className="pulsing-text">Generating Portfolio...</span>
                  </>
                ) : showRegenerateButton ? (
                  <>
                    <RegenerateIcon />
                    <span>Regenerate with New Settings</span>
                  </>
                ) : (
                  <span>Generate My Portfolio</span>
                )}
            </button>
          </div>
        </div>

        {/* RESULTS SECTION */}
        {portfolioHtmlCode && (
          <div id="result-section" className="result-section glass-card">
            <div className="result-header">
                <div className="result-tabs">
                    <button className={`result-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>
                      Preview
                    </button>
                    <button className={`result-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>
                      Source Code
                    </button>
                </div>
                <button onClick={handleDownload} className="btn-secondary">
                    <DownloadIcon />
                    Download HTML
                </button>
            </div>

            <div className="result-content">
                {activeTab === 'preview' && (
                    <div className="preview-window">
                        <div className="window-header">
                          <div className="window-controls">
                            <span className="control close"></span>
                            <span className="control minimize"></span>
                            <span className="control maximize"></span>
                          </div>
                          <div className="window-title">portfolio.html</div>
                        </div>
                        <iframe
                            srcDoc={portfolioHtmlCode}
                            title="Portfolio Preview"
                            className="preview-iframe"
                        />
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="code-window">
                        <div className="window-header">
                            <div className="window-controls">
                              <span className="control close"></span>
                              <span className="control minimize"></span>
                              <span className="control maximize"></span>
                            </div>
                            <button onClick={handleCopyCode} className="btn-icon">
                                {copySuccess ? <CheckIcon /> : <CopyIcon />}
                                <span>{copySuccess || 'Copy Code'}</span>
                            </button>
                        </div>
                        <div className="code-scroll-area">
                          <pre className="code-block">
                              <code>{portfolioHtmlCode}</code>
                          </pre>
                        </div>
                    </div>
                )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} PortfolioGen. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
