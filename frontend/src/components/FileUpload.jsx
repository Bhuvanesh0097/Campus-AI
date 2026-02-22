import { useState, useRef } from 'react';
import { HiOutlineCloudArrowUp, HiOutlineDocumentText } from 'react-icons/hi2';

export default function FileUpload({ onUpload, loading = false, accept = '.pdf', title = 'Upload Study Material', subtitle = 'Drag & drop a PDF file or click to browse' }) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files?.[0]) {
            onUpload(files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files?.[0]) {
            onUpload(e.target.files[0]);
            e.target.value = '';
        }
    };

    return (
        <div
            className={`file-upload-zone ${dragActive ? 'drag-active' : ''} ${loading ? 'uploading' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !loading && inputRef.current?.click()}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
            {loading ? (
                <>
                    <div className="spinner" style={{ width: 32, height: 32 }} />
                    <p>Uploading & processing...</p>
                </>
            ) : (
                <>
                    <div className="upload-icon">
                        {dragActive ? <HiOutlineDocumentText /> : <HiOutlineCloudArrowUp />}
                    </div>
                    <p className="upload-title">
                        {dragActive ? 'Drop your file here' : title}
                    </p>
                    <p className="upload-subtitle">
                        {subtitle}
                    </p>
                </>
            )}

            <style>{`
        .file-upload-zone {
          padding: 32px 24px;
          border: 2px dashed var(--border);
          border-radius: var(--radius-md);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-base);
          background: var(--bg-glass);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .file-upload-zone:hover {
          border-color: var(--primary);
          background: rgba(108, 99, 255, 0.05);
        }

        .file-upload-zone.drag-active {
          border-color: var(--accent);
          background: rgba(0, 217, 255, 0.08);
          transform: scale(1.02);
        }

        .file-upload-zone.uploading {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .upload-icon {
          font-size: 2.5rem;
          color: var(--primary);
          margin-bottom: 4px;
        }

        .upload-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .upload-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
