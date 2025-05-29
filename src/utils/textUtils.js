// textUtils.js

/**
 * Extracts structured text content from HTML while preserving formatting markers
 * @param {string} htmlContent - The HTML content to process
 * @returns {string} - Structured text with markdown-like formatting
 */
export const extractStructuredContent = (htmlContent) => {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return '';
  }

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Function to recursively extract text with structure markers
  const extractWithStructure = (element) => {
    let result = '';
    
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim();
        if (text) {
          result += text + ' ';
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();
        
        switch (tagName) {
          case 'h1':
            result += `\n# ${extractWithStructure(child).trim()}\n\n`;
            break;
          case 'h2':
            result += `\n## ${extractWithStructure(child).trim()}\n\n`;
            break;
          case 'h3':
            result += `\n### ${extractWithStructure(child).trim()}\n\n`;
            break;
          case 'h4':
            result += `\n#### ${extractWithStructure(child).trim()}\n\n`;
            break;
          case 'h5':
            result += `\n##### ${extractWithStructure(child).trim()}\n\n`;
            break;
          case 'h6':
            result += `\n###### ${extractWithStructure(child).trim()}\n\n`;
            break;
          case 'p':
            const pContent = extractWithStructure(child).trim();
            if (pContent) {
              result += `${pContent}\n\n`;
            }
            break;
          case 'ul':
            result += '\n';
            for (const li of child.children) {
              const liContent = extractWithStructure(li).trim();
              if (liContent) {
                result += `• ${liContent}\n`;
              }
            }
            result += '\n';
            break;
          case 'ol':
            result += '\n';
            Array.from(child.children).forEach((li, index) => {
              const liContent = extractWithStructure(li).trim();
              if (liContent) {
                result += `${index + 1}. ${liContent}\n`;
              }
            });
            result += '\n';
            break;
          case 'li':
            result += extractWithStructure(child);
            break;
          case 'strong':
          case 'b':
            result += `**${extractWithStructure(child).trim()}**`;
            break;
          case 'em':
          case 'i':
            result += `*${extractWithStructure(child).trim()}*`;
            break;
          case 'u':
            result += `__${extractWithStructure(child).trim()}__`;
            break;
          case 'blockquote':
            result += `\n> ${extractWithStructure(child).trim()}\n\n`;
            break;
          case 'br':
            result += '\n';
            break;
          default:
            result += extractWithStructure(child);
        }
      }
    }
    
    return result;
  };

  const extracted = extractWithStructure(tempDiv);
  // Clean up excessive whitespace
  return extracted.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
};

/**
 * Converts markdown-like formatted text back to HTML
 * @param {string} enhancedText - The formatted text to convert
 * @returns {string} - HTML content
 */
export const convertToHTML = (enhancedText) => {
  if (!enhancedText || typeof enhancedText !== 'string') {
    return '';
  }

  // Split by double newlines to handle paragraphs
  const sections = enhancedText.split('\n\n');
  let html = '';

  for (let section of sections) {
    section = section.trim();
    if (!section) continue;

    // Handle headers (check longest first to avoid conflicts)
    if (section.startsWith('######')) {
      html += `<h6>${section.substring(6).trim()}</h6>`;
    } else if (section.startsWith('#####')) {
      html += `<h5>${section.substring(5).trim()}</h5>`;
    } else if (section.startsWith('####')) {
      html += `<h4>${section.substring(4).trim()}</h4>`;
    } else if (section.startsWith('###')) {
      html += `<h3>${section.substring(3).trim()}</h3>`;
    } else if (section.startsWith('##')) {
      html += `<h2>${section.substring(2).trim()}</h2>`;
    } else if (section.startsWith('#')) {
      html += `<h1>${section.substring(1).trim()}</h1>`;
    }
    // Handle blockquotes
    else if (section.startsWith('>')) {
      html += `<blockquote><p>${section.substring(1).trim()}</p></blockquote>`;
    }
    // Handle lists
    else if (section.includes('•') || /^\d+\./.test(section)) {
      const lines = section.split('\n');
      let isOrderedList = /^\d+\./.test(lines[0]);
      let listItems = '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('•')) {
          listItems += `<li>${processInlineFormatting(trimmed.substring(1).trim())}</li>`;
        } else if (/^\d+\./.test(trimmed)) {
          listItems += `<li>${processInlineFormatting(trimmed.replace(/^\d+\.\s/, ''))}</li>`;
        }
      }
      
      if (listItems) {
        html += isOrderedList ? `<ol>${listItems}</ol>` : `<ul>${listItems}</ul>`;
      }
    }
    // Handle regular paragraphs
    else {
      html += `<p>${processInlineFormatting(section)}</p>`;
    }
  }

  return html;
};

/**
 * Processes inline formatting (bold, italic, underline) in text
 * @param {string} text - The text to process
 * @returns {string} - Text with HTML formatting tags
 */
export const processInlineFormatting = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Handle bold text (**text**)
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Handle italic text (*text*)
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Handle underline text (__text__)
  text = text.replace(/__([^_]+)__/g, '<u>$1</u>');
  
  // Handle line breaks
  text = text.replace(/\n/g, '<br>');
  
  return text;
};

/**
 * Validates if content is meaningful and not empty
 * @param {string} content - The content to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} - True if content is valid
 */
export const isValidContent = (content, minLength = 10) => {
  if (!content || typeof content !== 'string') {
    return false;
  }

  // Remove HTML tags and whitespace for validation
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  
  // Check if it's just empty paragraph tags
  if (content.trim() === '<p><br></p>' || content.trim() === '<p></p>') {
    return false;
  }
  
  return textContent.length >= minLength;
};

/**
 * Cleans up text by removing excessive whitespace and empty elements
 * @param {string} text - The text to clean
 * @returns {string} - Cleaned text
 */
export const cleanText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .replace(/[ \t]+/g, ' ')    // Replace multiple spaces/tabs with single space
    .replace(/^\s+|\s+$/g, '')  // Trim start and end
    .replace(/(<p><\/p>|<p><br><\/p>)/g, ''); // Remove empty paragraphs
};