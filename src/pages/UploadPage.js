import React, { useState } from 'react';
import axios from 'axios';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/documents/upload', formData);
      alert('✅ File uploaded successfully!');
      setUploaded(true);
    } catch (err) {
      alert('❌ Upload failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload PDF Document</h2>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload}>Upload</button>
      {uploaded && <p>✅ PDF uploaded! Go to the signature page next.</p>}
    </div>
  );
};

export default UploadPage;
