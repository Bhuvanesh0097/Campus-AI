import { useState, useRef } from 'react';
import { HiOutlineCloudArrowUp, HiOutlineDocumentText } from 'react-icons/hi2';

export default function FileUpload({
    onUpload,
    loading = false,
    accept = '.pdf',
    title = 'Upload Study Material',
    subtitle = 'Drag & drop a PDF file or click to browse',
}) {
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
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && !loading && inputRef.current?.click()}
            aria-label="Upload file"
            id="file-upload-zone"
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                style={{ display: 'none' }}
                aria-hidden="true"
            />
            {loading ? (
                <>
                    <div className="spinner" style={{ width: 28, height: 28 }} />
                    <p className="upload-title">Uploading & processing…</p>
                    <p className="upload-subtitle">This may take a moment</p>
                </>
            ) : (
                <>
                    <div className="upload-icon-wrapper">
                        {dragActive ? (
                            <HiOutlineDocumentText className="upload-icon" />
                        ) : (
                            <HiOutlineCloudArrowUp className="upload-icon" />
                        )}
                    </div>
                    <p className="upload-title">
                        {dragActive ? 'Drop your file here!' : title}
                    </p>
                    <p className="upload-subtitle">{subtitle}</p>
                </>
            )}

            <style>{`
                .file-upload-zone {
                    padding: 28px 24px;
                    border: 2px dashed var(--border);
                    border-radius: var(--radius-md);
                    text-align: center;
                    cursor: pointer;
                    transition: all var(--transition-base);
                    background: var(--bg-surface);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                }

                .file-upload-zone:hover {
                    border-color: var(--primary);
                    background: var(--primary-pale);
                }

                .file-upload-zone.drag-active {
                    border-color: var(--accent);
                    background: var(--accent-pale);
                    transform: scale(1.01);
                    box-shadow: 0 0 0 4px rgba(143, 214, 198, 0.15);
                }

                .file-upload-zone.uploading {
                    cursor: not-allowed;
                    opacity: 0.8;
                }

                .upload-icon-wrapper {
                    width: 52px;
                    height: 52px;
                    border-radius: var(--radius-md);
                    background: var(--primary-pale);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 4px;
                    transition: all var(--transition-base);
                }

                .drag-active .upload-icon-wrapper {
                    background: var(--accent-pale);
                }

                .upload-icon {
                    font-size: 1.6rem;
                    color: var(--primary);
                    transition: all var(--transition-base);
                }

                .drag-active .upload-icon {
                    color: var(--accent-hover);
                }

                .upload-title {
                    font-size: 0.9rem;
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
