# NTU CCDS Master Project Extractor Chrome Extension

A Chrome extension designed specifically for NTU CCDS Master students to extract, filter, and convert project information from the NTU SCE website into clean Markdown format.

## Features

- 🔍 **Smart Search**: Filter projects by keywords across all fields
- 📝 **Markdown Export**: Convert project data into well-formatted Markdown
- 📋 **Quick Copy**: Copy extracted content to clipboard with one click
- 💾 **Download Option**: Save extracted projects as `.md` files
- 🎨 **Clean Interface**: All controls in the extension popup - no page modifications
- ⚡ **Instant Results**: Real-time extraction without page reload
- 💾 **Remember Last**: Automatically saves and displays last extraction

## Installation

1. Clone or download this repository
2. Run `npm install` to install dependencies
3. Run `npm start` for development mode or `npm run build` for production
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" in the top right
6. Click "Load unpacked" and select the `build` folder

## Usage

1. Navigate to the NTU CCDS Master projects page:  
   `https://wis.ntu.edu.sg/pls/webexe/mas_sce_student.Filter_Options`
   But to access this page, you need to access from `https://wis.ntu.edu.sg/webexe/owa/eservices_search.index_search?t=3&p_name=CCDS` first.
   (If you are not on the page, the extension will not work.)

2. Click the extension icon in your Chrome toolbar

3. **To extract projects:**
   - Leave search field empty to extract ALL projects
   - Enter keywords to filter specific projects
   - Click "Extract to Markdown" or press Enter

4. **View results:**
   - Preview the extracted markdown
   - See the count of extracted projects

5. **Export options:**
   - Click "Copy to Clipboard" to copy the markdown
   - Click "Download .md" to save as a file

6. **Navigate back:**
   - Use the "← Back" button to perform another search
   - View last results anytime from the main screen

## Markdown Format

The extension converts each project into the following format:

```markdown
# [S/No]. [Topic]

## [Department] | [Supervisor]

**Type:** [Project Type] | **Status:** [Status]

## Summary

[Project summary content]

## Pre-requisites

[Prerequisites content]

---
```

## Development

### Prerequisites
- Node.js v20.17.0
- npm

### Commands
- `npm start` - Run in development mode with hot reload
- `npm run build` - Build for production
- `npm run prettier` - Format code

### Customization

You can customize the extraction format by modifying the `generateMarkdown` function in `src/pages/Content/index.js`.

## Technical Details

- Built with React 18 and Webpack 5
- Uses Chrome Extension Manifest V3
- Content script for data extraction only (no page modification)
- All UI contained within the extension popup
- Utilizes Chrome Storage API for persistence
- Message passing between popup and content script

## Permissions

The extension requires the following permissions:
- `clipboardWrite`: To copy markdown to clipboard
- `storage`: To save extraction results and statistics
- `tabs`: To detect current page and send messages to content script

## Features in Detail

### Search Functionality
- Case-insensitive search
- Searches across all fields (S/No, Topic, Supervisor, Department, Summary, Prerequisites, Type, Status)
- Empty search extracts all projects
- Prevents duplicate entries (uses S/No as unique key)

### Results Management
- Automatically saves last extraction
- View previous results without re-extracting
- Shows extraction count
- Preview of markdown output

### Export Options
- **Copy to Clipboard**: One-click copy with visual feedback
- **Download**: Saves as `.md` file with current date

## Troubleshooting

**Extension not working?**
- Ensure you're on the exact URL: `https://wis.ntu.edu.sg/pls/webexe/mas_sce_student.Filter_Options`
- Refresh the page after installing the extension
- Check if the extension is enabled in Chrome

**No extraction results?**
- Make sure the page is fully loaded before extracting
- Check if the table structure has changed on the website

**Search not working?**
- The search is case-insensitive and searches across all fields
- Try with simpler keywords

**Can't copy to clipboard?**
- Ensure the browser has clipboard permissions
- Try using the download option instead

## Privacy

This extension:
- Only works on the specified NTU website
- Does not collect or transmit any data
- Stores extraction results locally in your browser only
- Does not modify the webpage content

## License

MIT License - Feel free to modify and distribute as needed.

## Support

For issues or suggestions, please create an issue in the repository.

---

Made with ❤️ for NTU CCDS Master Students
