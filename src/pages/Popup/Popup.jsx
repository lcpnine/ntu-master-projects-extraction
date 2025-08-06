import React, { useEffect, useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [isOnTargetPage, setIsOnTargetPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [lastExtractedCount, setLastExtractedCount] = useState(0);
  const [markdown, setMarkdown] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Check if we're on the target page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        const targetUrl = 'https://wis.ntu.edu.sg/pls/webexe/mas_sce_student.Filter_Options';
        setIsOnTargetPage(url === targetUrl);
      }
    });

    // Get last extraction data from storage
    chrome.storage.local.get(['lastExtractedCount', 'lastMarkdown'], (result) => {
      if (result.lastExtractedCount) {
        setLastExtractedCount(result.lastExtractedCount);
      }
      if (result.lastMarkdown) {
        setMarkdown(result.lastMarkdown);
      }
    });
  }, []);

  const openTargetPage = () => {
    chrome.tabs.create({
      url: 'https://wis.ntu.edu.sg/pls/webexe/mas_sce_student.Filter_Options'
    });
  };

  const handleExtract = () => {
    setIsExtracting(true);
    
    // Send message to content script to extract data
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { 
          action: 'extractProjects', 
          searchTerm: searchTerm.trim() 
        },
        (response) => {
          setIsExtracting(false);
          
          if (response && response.success) {
            setMarkdown(response.markdown);
            setLastExtractedCount(response.count);
            setShowResults(true);
            
            // Save to storage
            chrome.storage.local.set({
              lastExtractedCount: response.count,
              lastMarkdown: response.markdown
            });
          } else if (response && response.error) {
            alert(response.error);
          }
        }
      );
    });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      // Show feedback
      const btn = document.getElementById('copy-btn');
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('success');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('success');
      }, 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ntu-projects-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isOnTargetPage && !isExtracting) {
      handleExtract();
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h2>NTU Project Extractor</h2>
        <div className="version">v1.0.0</div>
      </div>
      
      <div className="popup-content">
        {!isOnTargetPage ? (
          <div className="status-inactive">
            <div className="status-icon">⚠</div>
            <p className="status-text">Not on the NTU SCE page</p>
            <button className="open-page-btn" onClick={openTargetPage}>
              Open NTU SCE Page
            </button>
          </div>
        ) : (
          <>
            {!showResults ? (
              <>
                <div className="status-active">
                  <div className="status-icon">✓</div>
                  <p className="status-text">Ready to extract projects!</p>
                </div>
                
                <div className="search-section">
                  <input
                    type="text"
                    id="search-input"
                    className="search-input"
                    placeholder="Search keywords (empty = all projects)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isExtracting}
                  />
                  
                  <button 
                    className="extract-btn"
                    onClick={handleExtract}
                    disabled={isExtracting}
                  >
                    {isExtracting ? 'Extracting...' : 'Extract to Markdown'}
                  </button>
                </div>
                
                <div className="tips">
                  <p className="tip-title">Tips:</p>
                  <ul>
                    <li>Leave empty to extract all projects</li>
                    <li>Search is case-insensitive</li>
                    <li>Searches across all fields</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="results-section">
                <div className="results-header">
                  <button 
                    className="back-btn"
                    onClick={() => setShowResults(false)}
                  >
                    ← Back
                  </button>
                  <span className="results-count">
                    {searchTerm 
                      ? `Found ${lastExtractedCount} matching "${searchTerm}"`
                      : `Extracted ${lastExtractedCount} projects`}
                  </span>
                </div>
                
                <div className="results-preview">
                  <textarea
                    className="markdown-preview"
                    value={markdown.substring(0, 500) + (markdown.length > 500 ? '...' : '')}
                    readOnly
                  />
                </div>
                
                <div className="action-buttons">
                  <button 
                    id="copy-btn"
                    className="action-btn"
                    onClick={handleCopyToClipboard}
                  >
                    Copy to Clipboard
                  </button>
                  <button 
                    className="action-btn"
                    onClick={handleDownload}
                  >
                    Download .md
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        
        {lastExtractedCount > 0 && !showResults && (
          <div className="last-extraction">
            <p>Last extraction: {lastExtractedCount} projects</p>
            <button 
              className="view-last-btn"
              onClick={() => setShowResults(true)}
            >
              View Last Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
