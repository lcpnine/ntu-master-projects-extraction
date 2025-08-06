import React, { useEffect, useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [isOnTargetPage, setIsOnTargetPage] = useState(false);
  const [extractedCount, setExtractedCount] = useState(0);

  useEffect(() => {
    // Check if we're on the target page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        const targetUrl = 'https://wis.ntu.edu.sg/pls/webexe/mas_sce_student.Filter_Options';
        setIsOnTargetPage(url === targetUrl);
      }
    });

    // Get extracted count from storage
    chrome.storage.local.get(['extractedCount'], (result) => {
      if (result.extractedCount) {
        setExtractedCount(result.extractedCount);
      }
    });
  }, []);

  const openTargetPage = () => {
    chrome.tabs.create({
      url: 'https://wis.ntu.edu.sg/pls/webexe/mas_sce_student.Filter_Options'
    });
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h2>NTU Project Extractor</h2>
        <div className="version">v1.0.0</div>
      </div>
      
      <div className="popup-content">
        {isOnTargetPage ? (
          <div className="status-active">
            <div className="status-icon">✓</div>
            <p className="status-text">Extension is active on this page!</p>
            <p className="hint">Look for the extractor panel at the top of the page.</p>
          </div>
        ) : (
          <div className="status-inactive">
            <div className="status-icon">⚠</div>
            <p className="status-text">Not on the NTU CCDS Master page</p>
            <button className="open-page-btn" onClick={openTargetPage}>
              Open NTU CCDS Master Page
            </button>
          </div>
        )}
        
        <div className="features">
          <h3>Features:</h3>
          <ul>
            <li>Search and filter projects by keywords</li>
            <li>Extract all projects or filtered results</li>
            <li>Convert to clean Markdown format</li>
            <li>Copy to clipboard or download as .md file</li>
          </ul>
        </div>
        
        {extractedCount > 0 && (
          <div className="stats">
            <p>Last extraction: {extractedCount} projects</p>
          </div>
        )}
      </div>
      
      <div className="popup-footer">
        <p>Made for NTU CCDS Master Students</p>
      </div>
    </div>
  );
};

export default Popup;
