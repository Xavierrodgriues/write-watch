import { Editor } from '@tinymce/tinymce-react';
import { useState, useRef } from 'react';

function RichTextEditor() {
  const [content, setContent] = useState('');
  const editorRef = useRef(null);

  const handleEditorChange = (newContent, editor) => {
    setContent(newContent);
  };

  const handleDownload = () => {
    const blob = new Blob([`
      <html>
        <head><meta charset="utf-8"></head>
        <body>${content}</body>
      </html>
    `], { type: 'text/html' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <Editor
        apiKey="50wzhjfceoh4dk29b0gwi35cdgkub9p8kby5347owexh8hg8"
        value={content}
        onEditorChange={handleEditorChange}
        onInit={(evt, editor) => editorRef.current = editor}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic underline | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | help'
        }}
      />

      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download Content
      </button>
    </div>
  );
}

export default RichTextEditor;
