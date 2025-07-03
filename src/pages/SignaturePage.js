import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Draggable from 'react-draggable';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js';

  const SignaturePage = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);
    }
  };

  // Update signature position when dragging ends
  const handleStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
    console.log('Signature dragged to:', data.x, data.y);
  };

  // Save signature position to backend
  const handleSaveSignature = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/docs/save-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file?.name,
          x: position.x,
          y: position.y,
        }),
      });

      const data = await res.json();
      alert(data.message || 'Signature saved successfully!');
    } catch (err) {
      console.error('Error saving signature:', err);
      alert('Failed to save signature.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>PDF Signature Tool</h2>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <br /><br />

      {fileUrl && (
        <div style={{ position: 'relative', width: '600px', border: '1px solid #ccc' }}>
          <Document file={fileUrl}>
            <Page pageNumber={1} width={600} />
          </Document>

          <Draggable position={position} onStop={handleStop}>
            <div
              style={{
                position: 'absolute',
                width: '120px',
                height: '40px',
                backgroundColor: '#007bff',
                color: '#fff',
                textAlign: 'center',
                lineHeight: '40px',
                borderRadius: '4px',
                cursor: 'move',
                zIndex: 10,
                top: 0,
                left: 0,
              }}
            >
              ✍ Signature
            </div>
          </Draggable>

          <button
            onClick={handleSaveSignature}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Save Signature
          </button>
        </div>
      )}
    </div>
  );
};

export default SignaturePage;

