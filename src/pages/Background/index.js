console.log('NTU Project Extractor - Background service initialized');

// Listen for messages from content script if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateExtractedCount') {
    // Save the extracted count to storage
    chrome.storage.local.set({ extractedCount: request.count });
    sendResponse({ success: true });
  }
  return true;
});
