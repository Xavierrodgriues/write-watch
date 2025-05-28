import { Editor } from '@tinymce/tinymce-react';
import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function RichTextEditor({ onKeyPressPause }) {
  const [content, setContent] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const editorRef = useRef(null);

  const handleEditorChange = (newContent, editor) => {
    setContent(newContent);
  };

  const handleDownloadPDF = async () => {
    if (!content || content.trim() === '' || content === '<p><br></p>') {
      alert("No content to download. Please add some notes first.");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Create a temporary container for rendering
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = `
        <div style="
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          background: white;
          box-sizing: border-box;
        ">
          <div style="
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
            margin-bottom: 20px;
          ">
            <h1 style="
              margin: 0;
              font-size: 24px;
              color: #007bff;
              font-weight: 600;
            ">Write-Watch Notes</h1>
            <p style="
              margin: 5px 0 0 0;
              font-size: 12px;
              color: #666;
            ">Generated on: ${new Date().toLocaleString()}</p>
          </div>
          <div class="content-area">
            ${content}
          </div>
        </div>
      `;

      // Style the content for better PDF appearance
      tempContainer.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        background: white;
      `;

      // Process lists to ensure markers are visible
      const contentArea = tempContainer.querySelector('.content-area');
      
      // Handle ordered lists - add visible numbers
      const orderedLists = contentArea.querySelectorAll('ol');
      orderedLists.forEach((ol, olIndex) => {
        ol.style.counterReset = `list-${olIndex}`;
        const listItems = ol.querySelectorAll('li');
        listItems.forEach((li, liIndex) => {
          li.style.counterIncrement = `list-${olIndex}`;
          li.style.position = 'relative';
          li.style.paddingLeft = '25px';
          
          // Create visible number
          const numberSpan = document.createElement('span');
          numberSpan.textContent = `${liIndex + 1}. `;
          numberSpan.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            font-weight: 600;
            color: #333;
          `;
          li.insertBefore(numberSpan, li.firstChild);
        });
      });

      // Handle unordered lists - add visible bullets
      const unorderedLists = contentArea.querySelectorAll('ul');
      unorderedLists.forEach(ul => {
        const listItems = ul.querySelectorAll('li');
        listItems.forEach(li => {
          li.style.position = 'relative';
          li.style.paddingLeft = '25px';
          
          // Create visible bullet
          const bulletSpan = document.createElement('span');
          bulletSpan.textContent = '• ';
          bulletSpan.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            font-weight: bold;
            color: #333;
            font-size: 16px;
          `;
          li.insertBefore(bulletSpan, li.firstChild);
        });
      });

      // Add comprehensive styling to content elements
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        .content-area h1 { font-size: 20px !important; font-weight: 600 !important; margin: 20px 0 12px 0 !important; color: #2c3e50 !important; }
        .content-area h2 { font-size: 18px !important; font-weight: 600 !important; margin: 18px 0 10px 0 !important; color: #34495e !important; }
        .content-area h3 { font-size: 16px !important; font-weight: 600 !important; margin: 16px 0 8px 0 !important; color: #34495e !important; }
        .content-area h4 { font-size: 15px !important; font-weight: 600 !important; margin: 14px 0 7px 0 !important; color: #34495e !important; }
        .content-area h5 { font-size: 14px !important; font-weight: 600 !important; margin: 12px 0 6px 0 !important; color: #34495e !important; }
        .content-area h6 { font-size: 13px !important; font-weight: 600 !important; margin: 10px 0 5px 0 !important; color: #34495e !important; }
        .content-area p { margin: 12px 0 !important; line-height: 1.6 !important; }
        .content-area ul, .content-area ol { 
          margin: 12px 0 !important; 
          padding-left: 0 !important; 
          list-style: none !important;
        }
        .content-area li { 
          margin: 6px 0 !important; 
          line-height: 1.5 !important; 
          list-style: none !important;
        }
        .content-area strong, .content-area b { font-weight: 600 !important; }
        .content-area em, .content-area i { font-style: italic !important; }
        .content-area u { text-decoration: underline !important; }
        .content-area blockquote { 
          margin: 16px 0 !important; 
          padding: 12px 16px !important; 
          border-left: 4px solid #007bff !important; 
          background: #f8f9fa !important; 
          font-style: italic !important; 
        }
        .content-area table { 
          width: 100% !important; 
          border-collapse: collapse !important; 
          margin: 16px 0 !important; 
        }
        .content-area th, .content-area td { 
          border: 1px solid #dee2e6 !important; 
          padding: 8px 12px !important; 
          text-align: left !important; 
        }
        .content-area th { 
          background: #f8f9fa !important; 
          font-weight: 600 !important; 
        }
        .content-area a {
          color: #007bff !important;
          text-decoration: underline !important;
        }
        .content-area code {
          background: #f8f9fa !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
          font-family: 'Courier New', monospace !important;
          font-size: 13px !important;
        }
        .content-area pre {
          background: #f8f9fa !important;
          padding: 12px !important;
          border-radius: 4px !important;
          overflow-wrap: break-word !important;
          white-space: pre-wrap !important;
        }
      `;

      document.head.appendChild(styleSheet);
      document.body.appendChild(tempContainer);

      // Wait a bit for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate canvas from the container
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: tempContainer.offsetWidth,
        height: tempContainer.offsetHeight
      });

      // Clean up
      document.body.removeChild(tempContainer);
      document.head.removeChild(styleSheet);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const filename = `video-notes-${timestamp}.pdf`;
      
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

   const handleKeyPress = (e) => {
    if (onKeyPressPause) {
      onKeyPressPause(); // Call pause on key press
    }
  };

  return (
    <div className="p-4 h-full flex flex-col" onKeyDown={handleKeyPress}>
      <div>
        <Editor
          apiKey={import.meta.env.VITE_MCE_API}
          value={content}
          onEditorChange={handleEditorChange}
          onInit={(evt, editor) => editorRef.current = editor}
          init={{
            height: 'calc(100vh - 200px)',
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic underline | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist outdent indent | removeformat | help',
            content_style: `
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                font-size: 14px; 
                line-height: 1.6; 
              }
            `
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded cursor-pointer hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition-colors"
          title="Download as formatted PDF (preserves styling)"
        >
          {isGeneratingPDF ? '⏳ Generating...' : '📋 Download PDF'}
        </button>
        
      
      </div>
    </div>
  );
}

export default RichTextEditor;