# NTU CCDS Master Project Extractor Chrome Extension

A Chrome extension designed specifically for NTU CCDS Master students to extract, filter, and convert project information from the NTU SCE website into clean Markdown format.

## Features

- 🔍 **Smart Search**: Filter projects by keywords across all fields
- 📝 **Markdown Export**: Convert project data into well-formatted Markdown
- 📋 **Quick Copy**: Copy extracted content to clipboard with one click
- 💾 **Download Option**: Save extracted projects as `.md` files
- 🎨 **Beautiful UI**: Clean, modern interface with collapsible panel
- ⚡ **Instant Results**: Real-time extraction without page reload

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

2. The extractor panel will automatically appear at the top of the page

3. **To extract projects:**
   - Leave search field empty to extract ALL projects
   - Enter keywords to filter specific projects
   - Click "Extract to Markdown" or press Enter

4. **Export options:**
   - Click "Copy to Clipboard" to copy the markdown
   - Click "Download MD" to save as a file

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

## Project Structure

```
src/
├── pages/
│   ├── Background/      # Background service worker
│   ├── Content/         # Content script and extractor module
│   │   ├── index.js    # Main content script
│   │   ├── modules/
│   │   │   └── extractor.js  # Core extraction logic
│   │   └── content.styles.css # Extractor UI styles
│   └── Popup/          # Extension popup
│       ├── Popup.jsx   # Popup component
│       └── Popup.css   # Popup styles
└── manifest.json       # Extension manifest
```

## Key Files

- **`extractor.js`**: Core extraction logic and UI creation
- **`content.styles.css`**: Styling for the extractor panel
- **`Popup.jsx`**: Extension popup interface
- **`manifest.json`**: Extension configuration

## Development

### Prerequisites
- Node.js >= 18
- npm or yarn

### Commands
- `npm start` - Run in development mode with hot reload
- `npm run build` - Build for production
- `npm run prettier` - Format code

### Customization

You can customize the extraction format by modifying the `generateMarkdown` function in `src/pages/Content/modules/extractor.js`.

## Technical Details

- Built with React 18 and Webpack 5
- Uses Chrome Extension Manifest V3
- Implements content script injection for seamless integration
- Utilizes Chrome Storage API for persistence

## Permissions

The extension requires the following permissions:
- `clipboardWrite`: To copy markdown to clipboard
- `storage`: To save extraction statistics
- `tabs`: To detect if user is on the correct page

## Troubleshooting

**Extension not appearing on the page?**
- Ensure you're on the exact URL: `https://wis.ntu.edu.sg/pls/webexe/mas_sce_student.Filter_Options`
- Refresh the page after installing the extension
- Check if the extension is enabled in Chrome

**Search not working?**
- The search is case-insensitive and searches across all fields
- Make sure the table is fully loaded before searching

**Can't copy to clipboard?**
- Ensure the browser has clipboard permissions
- Try using the download option instead

## License

MIT License - Feel free to modify and distribute as needed.

## Support

For issues or suggestions, please create an issue in the repository.

---

Made with ❤️ for NTU CCDS Master Students
