import React, { useState } from 'react';
import styles from './MediaUploadModal.module.css';
import { API_BASE_URL } from '../../services/api';

const MediaUploadModal = ({ isOpen, onClose, uploadType, parkId, parkName }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const acceptedFormats = uploadType === 'media' 
        ? 'image/jpeg,image/png,image/gif,image/webp'
        : 'video/mp4,video/webm,video/mov';

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setError('');
        
        // Validate files
        const validFiles = files.filter(file => {
            if (file.size > maxFileSize) {
                setError(`File ${file.name} exceeds 10MB limit`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setSelectedFiles(prev => [...prev, ...validFiles]);

        // Generate previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, {
                    file: file,
                    url: reader.result,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError('Please select at least one file');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');
        setUploadProgress(0);

        try {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });
            formData.append('park_id', parkId);
            formData.append('upload_type', uploadType);

            const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
            
            if (!token) {
                setError('Please log in to upload media');
                setUploading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/national-parks/upload-media`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                const approvalMessage = result.approval_message || 'Your upload is pending admin approval.';
                setSuccess(`Successfully uploaded ${selectedFiles.length} ${uploadType === 'media' ? 'image(s)' : 'video(s)'}. ${approvalMessage}`);
                setSelectedFiles([]);
                setPreviews([]);
                
                // Close modal after 4 seconds to give time to read approval message
                setTimeout(() => {
                    onClose();
                    window.location.reload(); // Refresh to show new media
                }, 4000);
            } else {
                const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
                if (response.status === 401) {
                    setError('Authentication required. Please log in and try again.');
                } else {
                    setError(errorData.detail || `Upload failed (${response.status})`);
                }
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload files. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Upload {uploadType === 'media' ? 'Photos' : 'Videos'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.parkInfo}>
                        <strong>Park:</strong> {parkName}
                    </div>

                    <div className={styles.infoMessage}>
                        ℹ️ <strong>Note:</strong> Your uploads will be reviewed by an admin before appearing publicly on the park page.
                    </div>

                    <div className={styles.uploadSection}>
                        <label className={styles.uploadLabel}>
                            <input
                                type="file"
                                multiple
                                accept={acceptedFormats}
                                onChange={handleFileSelect}
                                disabled={uploading}
                                style={{ display: 'none' }}
                            />
                            <div className={styles.uploadButton}>
                                <span className={styles.uploadIcon}>📁</span>
                                <span>Choose {uploadType === 'media' ? 'Images' : 'Videos'}</span>
                                <span className={styles.uploadHint}>
                                    (JPEG, PNG, GIF, WebP - max 10MB each)
                                </span>
                            </div>
                        </label>
                    </div>

                    {previews.length > 0 && (
                        <div className={styles.previewSection}>
                            <h3>Selected Files ({previews.length})</h3>
                            <div className={styles.previewGrid}>
                                {previews.map((preview, index) => (
                                    <div key={index} className={styles.previewItem}>
                                        {uploadType === 'media' ? (
                                            <img src={preview.url} alt={preview.name} />
                                        ) : (
                                            <video src={preview.url} controls />
                                        )}
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => removeFile(index)}
                                            disabled={uploading}
                                        >
                                            ×
                                        </button>
                                        <div className={styles.fileName}>{preview.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={styles.successMessage}>
                            {success}
                        </div>
                    )}

                    {uploading && (
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill} 
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button 
                        className={styles.cancelButton} 
                        onClick={onClose}
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button 
                        className={styles.uploadSubmitButton}
                        onClick={handleUpload}
                        disabled={uploading || selectedFiles.length === 0}
                    >
                        {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaUploadModal;