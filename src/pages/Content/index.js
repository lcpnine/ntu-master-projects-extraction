import './content.styles.css';
import { initExtractor } from './modules/extractor';

console.log('NTU Project Extractor loaded!');

// Wait for the page to load completely
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExtractor);
} else {
  initExtractor();
}
