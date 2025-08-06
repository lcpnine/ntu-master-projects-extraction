export const initExtractor = () => {
  console.log('Initializing NTU Project Extractor...');
  
  // Create the extractor UI
  createExtractorUI();
};

const createExtractorUI = () => {
  // Check if the target container exists
  const targetContainer = document.getElementById('ui_body_container');
  if (!targetContainer) {
    console.log('Target container not found. Waiting...');
    setTimeout(createExtractorUI, 1000);
    return;
  }

  // Create the extractor panel
  const extractorPanel = document.createElement('div');
  extractorPanel.id = 'ntu-extractor-panel';
  extractorPanel.innerHTML = `
    <div class="extractor-header">
      <h3>NTU Project Extractor</h3>
      <button id="extractor-toggle" class="toggle-btn">▼</button>
    </div>
    <div class="extractor-content">
      <div class="search-container">
        <input type="text" id="extractor-search" placeholder="Search projects... (empty = extract all)" />
        <button id="extract-btn" class="action-btn">Extract to Markdown</button>
      </div>
      <div class="results-container">
        <div class="results-header">
          <span id="results-count">No results yet</span>
          <button id="copy-btn" class="action-btn" style="display:none;">Copy to Clipboard</button>
          <button id="download-btn" class="action-btn" style="display:none;">Download MD</button>
        </div>
        <textarea id="markdown-output" readonly placeholder="Extracted markdown will appear here..."></textarea>
      </div>
    </div>
  `;

  // Insert the panel at the top of the page
  document.body.insertBefore(extractorPanel, document.body.firstChild);

  // Add event listeners
  setupEventListeners();
};

const setupEventListeners = () => {
  // Toggle panel
  const toggleBtn = document.getElementById('extractor-toggle');
  const content = document.querySelector('.extractor-content');
  
  toggleBtn.addEventListener('click', () => {
    content.classList.toggle('collapsed');
    toggleBtn.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
  });

  // Search input
  const searchInput = document.getElementById('extractor-search');
  const extractBtn = document.getElementById('extract-btn');
  
  // Extract button
  extractBtn.addEventListener('click', () => {
    extractProjects(searchInput.value.trim());
  });

  // Enter key in search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      extractProjects(searchInput.value.trim());
    }
  });

  // Copy button
  const copyBtn = document.getElementById('copy-btn');
  copyBtn.addEventListener('click', () => {
    const output = document.getElementById('markdown-output');
    output.select();
    document.execCommand('copy');
    
    // Show feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  });

  // Download button
  const downloadBtn = document.getElementById('download-btn');
  downloadBtn.addEventListener('click', () => {
    const output = document.getElementById('markdown-output');
    const blob = new Blob([output.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ntu-projects-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  });
};

const extractProjects = (searchTerm) => {
  console.log('Extracting projects with search term:', searchTerm);
  
  // Find the table
  const tables = document.querySelectorAll('#ui_body_container table');
  if (!tables.length) {
    alert('No project table found on this page!');
    return;
  }

  const table = tables[0]; // Assuming the first table is the one we want
  const rows = table.querySelectorAll('tr');
  
  const projects = [];
  const processedSNumbers = new Set(); // Track processed S/No. to avoid duplicates
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.querySelectorAll('td');
    
    if (cells.length < 6) continue; // Skip incomplete rows
    
    // Extract data from cells
    const sNo = cells[0].textContent.trim();
    const supervisor = cells[1].textContent.trim();
    const dept = cells[2].textContent.trim();
    const topicContent = cells[3].innerHTML;
    const type = cells[4].textContent.trim();
    const status = cells[5].textContent.trim();
    
    // Parse the topic content
    const topicMatch = topicContent.match(/<b>Topic:\s*<\/b>(.*?)(?:<br>|$)/);
    const summaryMatch = topicContent.match(/<b>Summary:\s*<\/b>(.*?)(?:<b>Pre-requisites:|$)/s);
    const prereqMatch = topicContent.match(/<b>Pre-requisites:\s*<\/b>(.*?)$/s);
    
    const topic = topicMatch ? cleanHTML(topicMatch[1]) : '';
    const summary = summaryMatch ? cleanHTML(summaryMatch[1]) : '';
    const prerequisites = prereqMatch ? cleanHTML(prereqMatch[1]) : '';
    
    // Check if this row matches the search term (if provided)
    if (searchTerm) {
      const rowText = `${sNo} ${supervisor} ${dept} ${topic} ${summary} ${prerequisites} ${type} ${status}`.toLowerCase();
      if (!rowText.includes(searchTerm.toLowerCase())) {
        continue;
      }
    }
    
    // Check if we've already processed this S/No.
    if (processedSNumbers.has(sNo)) {
      continue;
    }
    
    processedSNumbers.add(sNo);
    
    projects.push({
      sNo,
      supervisor: cleanHTML(supervisor),
      dept,
      topic,
      summary,
      prerequisites,
      type,
      status
    });
  }
  
  // Generate markdown
  const markdown = generateMarkdown(projects);
  
  // Display results
  displayResults(markdown, projects.length, searchTerm);
};

const cleanHTML = (html) => {
  // Create a temporary element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Replace <br> tags with newlines
  temp.innerHTML = temp.innerHTML.replace(/<br\s*\/?>/gi, '\n');
  
  // Get text content and clean up
  let text = temp.textContent || temp.innerText || '';
  
  // Clean up excessive whitespace
  text = text.replace(/\n\s*\n/g, '\n\n');
  text = text.trim();
  
  return text;
};

const generateMarkdown = (projects) => {
  if (projects.length === 0) {
    return '# No Projects Found\n\nNo projects matched your search criteria.';
  }
  
  let markdown = `# NTU CCDS Master Projects Extract\n\n`;
  markdown += `*Generated on ${new Date().toLocaleString()}*\n\n`;
  markdown += `**Total Projects: ${projects.length}**\n\n`;
  markdown += `---\n\n`;
  
  projects.forEach(project => {
    markdown += `# ${project.sNo}. ${project.topic}\n\n`;
    markdown += `## ${project.dept} | ${project.supervisor}\n\n`;
    markdown += `**Type:** ${project.type} | **Status:** ${project.status}\n\n`;
    
    if (project.summary) {
      markdown += `## Summary\n\n${project.summary}\n\n`;
    }
    
    if (project.prerequisites) {
      markdown += `## Pre-requisites\n\n${project.prerequisites}\n\n`;
    }
    
    markdown += `---\n\n`;
  });
  
  return markdown;
};

const displayResults = (markdown, count, searchTerm) => {
  const output = document.getElementById('markdown-output');
  const resultsCount = document.getElementById('results-count');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  
  output.value = markdown;
  
  if (searchTerm) {
    resultsCount.textContent = `Found ${count} project(s) matching "${searchTerm}"`;
  } else {
    resultsCount.textContent = `Extracted all ${count} project(s)`;
  }
  
  // Show action buttons
  copyBtn.style.display = count > 0 ? 'inline-block' : 'none';
  downloadBtn.style.display = count > 0 ? 'inline-block' : 'none';
  
  // Auto-adjust textarea height
  output.style.height = 'auto';
  output.style.height = Math.min(output.scrollHeight, 500) + 'px';
  
  // Save extraction count to storage
  if (chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ 
      action: 'updateExtractedCount', 
      count: count 
    });
  }
};
