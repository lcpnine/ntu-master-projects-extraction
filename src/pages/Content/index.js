// NTU Project Extractor Content Script
(function () {
  console.log('NTU CCDS Master Project Extractor content script loaded!');

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);

    if (request.action === 'extractProjects') {
      console.log('Starting extraction with search term:', request.searchTerm);

      // Use setTimeout to ensure async response
      setTimeout(() => {
        try {
          const result = extractProjects(request.searchTerm);
          console.log('Extraction successful, found', result.count, 'projects');
          sendResponse({
            success: true,
            markdown: result.markdown,
            count: result.count,
          });
        } catch (error) {
          console.error('Extraction error:', error);
          sendResponse({
            success: false,
            error: 'Failed to extract projects: ' + error.message,
          });
        }
      }, 0);

      return true; // Keep the message channel open for async response
    }
  });

  function extractProjects(searchTerm) {
    // Find the table
    const targetContainer = document.getElementById('ui_body_container');
    if (!targetContainer) {
      throw new Error(
        'Target container not found. Make sure you are on the correct page.'
      );
    }

    const tables = targetContainer.querySelectorAll('table');
    if (!tables.length) {
      throw new Error('No project table found on this page.');
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
      const summaryMatch = topicContent.match(
        /<b>Summary:\s*<\/b>(.*?)(?:<b>Pre-requisites:|$)/s
      );
      const prereqMatch = topicContent.match(
        /<b>Pre-requisites:\s*<\/b>(.*?)$/s
      );

      const topic = topicMatch ? cleanHTML(topicMatch[1]) : '';
      const summary = summaryMatch ? cleanHTML(summaryMatch[1]) : '';
      const prerequisites = prereqMatch ? cleanHTML(prereqMatch[1]) : '';

      // Check if this row matches the search term (if provided)
      if (searchTerm) {
        const rowText =
          `${sNo} ${supervisor} ${dept} ${topic} ${summary} ${prerequisites} ${type} ${status}`.toLowerCase();
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
        status,
      });
    }

    // Generate markdown
    const markdown = generateMarkdown(projects);

    return {
      markdown: markdown,
      count: projects.length,
    };
  }

  function cleanHTML(html) {
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
  }

  function generateMarkdown(projects) {
    if (projects.length === 0) {
      return '# No Projects Found\n\nNo projects matched your search criteria.';
    }

    let markdown = `# NTU SCE Projects Extract\n\n`;
    markdown += `*Generated on ${new Date().toLocaleString()}*\n\n`;
    markdown += `**Total Projects: ${projects.length}**\n\n`;
    markdown += `---\n\n`;

    projects.forEach((project) => {
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
  }
})();
