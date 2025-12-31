import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePostModal.module.css';
import overviewIcon from '../../assets/icons/overviewIcon.svg';
import addpostIcon from '../../assets/icons/addpostIcon.svg';
import uploadIcon from '../../assets/icons/uploadIcon.svg';
import locationIcon from '../../assets/icons/locationIcon.svg';
import mediaIcon from '../../assets/icons/mediaIcon.svg';
import discussionService from '../../services/discussionService';
import mediaService from '../../services/mediaService';
import { API_BASE_URL } from '../../services/api';

const CreatePostModal = ({ isOpen, onClose, fixedParkName = null }) => {
    const navigate = useNavigate();
    const [postType, setPostType] = useState(fixedParkName ? 'nationalPark' : 'thread'); // 'thread' or 'nationalPark'
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [toast, setToast] = useState(null);
    
    // National Park specific fields
    const [parkName, setParkName] = useState(fixedParkName || '');
    const [nationalParks, setNationalParks] = useState([]);
    const [location, setLocation] = useState('');
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    // Fetch categories when modal opens
    useEffect(() => {
        if (isOpen && postType === 'thread') {
            loadCategories();
        }
    }, [isOpen, postType]);

    // Fetch national parks when modal opens
    useEffect(() => {
        if (isOpen) {
            loadNationalParks();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        try {
            const data = await discussionService.getCategories();
            // API returns array directly
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load categories:', error);
            // Provide default categories if API fails
            setCategories([
                { id: '1', name: 'Research & Conservation', slug: 'research-conservation' },
                { id: '2', name: 'Wildlife Photography', slug: 'wildlife-photography' },
                { id: '3', name: 'Field Guides', slug: 'field-guides' },
                { id: '4', name: 'Citizen Science', slug: 'citizen-science' },
            ]);
        }
    };

    const loadNationalParks = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/national-parks?is_active=true`);
            const data = await response.json();
            setNationalParks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load national parks:', error);
            setNationalParks([]);
        }
    };

    if (!isOpen) return null;

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleMediaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setMediaPreview({ url: previewUrl, type: file.type });
        }
    };

    const handleBannerUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerImage(file);
            // Create preview URL for banner
            const previewUrl = URL.createObjectURL(file);
            setBannerPreview(previewUrl);
        }
    };

    const handleSubmit = async () => {
        // Validation with detailed feedback
        if (postType === 'thread') {
            if (!title.trim()) {
                showToast('Please enter a title for your discussion');
                return;
            }
            if (title.trim().length < 10) {
                showToast('Title must be at least 10 characters long');
                return;
            }
            if (title.trim().length > 500) {
                showToast('Title must be less than 500 characters');
                return;
            }
            if (!description.trim()) {
                showToast('Please enter a description for your discussion');
                return;
            }
            if (description.trim().length < 50) {
                showToast('Description must be at least 50 characters long');
                return;
            }
        } else {
            if (!parkName.trim()) {
                showToast('Please select a national park');
                return;
            }
            if (!location.trim()) {
                showToast('Please enter the location');
                return;
            }
            if (!description.trim()) {
                showToast('Please enter a description for your post');
                return;
            }
            if (description.trim().length < 50) {
                showToast('Description must be at least 50 characters long');
                return;
            }
            if (description.trim().length > 2000) {
                showToast('National park description must be less than 2000 characters');
                return;
            }
            if (!bannerImage) {
                showToast('Please upload a banner image for your national park post');
                return;
            }
        }

        setIsSubmitting(true);

        try {
            let response;
            let mediaUrl = null;
            let bannerUrl = null;
            
            // Upload media file if present (for thread discussions)
            if (postType === 'thread' && media) {
                try {
                    console.log('📤 Uploading media file...');
                    const mediaResponse = await discussionService.uploadMedia(media);
                    mediaUrl = mediaResponse.file_url;
                    console.log('✅ Media uploaded:', mediaUrl);
                } catch (uploadError) {
                    console.error('❌ Media upload failed:', uploadError);
                    console.warn('⚠️ Continuing without media - discussion will be created');
                }
            }
            
            // Upload banner image if present (for national park discussions)
            if (postType === 'nationalPark' && bannerImage) {
                try {
                    console.log('📤 Uploading banner image...');
                    const bannerResponse = await discussionService.uploadBanner(bannerImage);
                    bannerUrl = bannerResponse.file_url;
                    console.log('✅ Banner uploaded:', bannerUrl);
                } catch (uploadError) {
                    console.error('❌ Banner upload failed:', uploadError);
                    console.warn('⚠️ Continuing without banner - discussion will be created');
                }
            }
            
            if (postType === 'thread') {
                // Create thread discussion
                response = await discussionService.createThreadDiscussion({
                    title: title.trim(),
                    description: description.trim(),
                    category_id: category || null,
                    tags: tags,
                    media_url: mediaUrl,
                });
                
                console.log('✅ Thread discussion created:', response);
                
                // Show success message
                showToast('Discussion created successfully! It will be reviewed before being published.', 'success');
                
                // Reset form and close modal after delay
                setTimeout(() => {
                    handleCancel();
                }, 1500);
                
            } else {
                // Create national park discussion
                response = await discussionService.createNationalParkDiscussion({
                    parkName: parkName.trim(),
                    location: location.trim(),
                    description: description.trim(),
                    tags: tags,
                    banner_image: bannerUrl,
                });
                
                console.log('✅ National Park discussion created:', response);
                
                // Show success message
                showToast('National Park post created successfully! It will be reviewed before being published.', 'success');
                
                // Reset form and close modal after delay
                setTimeout(() => {
                    handleCancel();
                }, 1500);
            }
            // navigate(`/community/discussion/${response.id}`);
            
        } catch (error) {
            console.error('❌ Error creating discussion:', error);
            
            // Handle specific error cases
            if (error.response) {
                if (error.response.status === 401) {
                    // Show login prompt modal instead of alert
                    setShowLoginPrompt(true);
                } else if (error.response.status === 400) {
                    const errorMsg = error.response.data?.detail || 'Invalid input. Please check your information and try again.';
                    showToast(errorMsg);
                } else {
                    const errorMsg = error.response.data?.detail || error.response.data?.message || 'Failed to create discussion';
                    showToast(errorMsg);
                }
            } else if (error.request) {
                showToast('Network error. Please check your connection and try again.');
            } else {
                showToast('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Clean up preview URLs to prevent memory leaks
        if (mediaPreview?.url) {
            URL.revokeObjectURL(mediaPreview.url);
        }
        if (bannerPreview) {
            URL.revokeObjectURL(bannerPreview);
        }
        
        // Reset form
        setPostType(fixedParkName ? 'nationalPark' : 'thread');
        setTitle('');
        setCategory('');
        setDescription('');
        setTags([]);
        setCurrentTag('');
        setMedia(null);
        setMediaPreview(null);
        setParkName(fixedParkName || '');
        setLocation('');
        setBannerImage(null);
        setBannerPreview(null);
        setShowLoginPrompt(false);
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Create a Post</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.modalContent}>
                    {/* Post Type Buttons */}
                    {!fixedParkName && (
                        <div className={styles.postTypeButtons}>
                            <button 
                                className={`${styles.typeButton} ${postType === 'thread' ? styles.active : ''}`}
                                onClick={() => setPostType('thread')}
                            >
                                <img src={overviewIcon} alt="Thread" className={styles.typeIcon} />
                                Thread
                            </button>
                            <button 
                                className={`${styles.typeButton} ${postType === 'nationalPark' ? styles.active : ''}`}
                                onClick={() => setPostType('nationalPark')}
                            >
                                <img src={locationIcon} alt="National Park" className={styles.typeIcon} />
                                National Park
                            </button>
                        </div>
                    )}

                    {postType === 'thread' ? (
                        <>
                            {/* Thread Form Fields */}
                            {/* Title Input */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Title <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="What's your topic?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={500}
                                />
                                <div className={styles.characterCount}>
                                    {title.length} / 500 characters (minimum 10)
                                </div>
                            </div>

                            {/* Category Select */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Category</label>
                                <select
                                    className={styles.select}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Select a category (Optional)</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description Textarea */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Description <span className={styles.required}>*</span>
                                </label>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Share your thoughts, observations, or questions... (minimum 50 characters)"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={5000}
                                />
                                <div className={styles.characterCount}>
                                    {description.length} / 5000 characters (minimum 50)
                                </div>
                                
                                {/* Emoji, Mention, Link Icons */}
                                <div className={styles.textareaIcons}>
                                    <button className={styles.iconButton} title="Add emoji">😊</button>
                                    <button className={styles.iconButton} title="Mention someone">@</button>
                                    <button className={styles.iconButton} title="Add link">🔗</button>
                                </div>
                            </div>

                            {/* Media Upload */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Attach Media (Optional)</label>
                                <div className={styles.uploadArea}>
                                    <input
                                        type="file"
                                        id="mediaUpload"
                                        className={styles.fileInput}
                                        accept="image/jpeg,image/png,video/mp4,video/webm"
                                        onChange={handleMediaUpload}
                                    />
                                    {!mediaPreview ? (
                                        <label htmlFor="mediaUpload" className={styles.uploadLabel}>
                                            <img src={uploadIcon} alt="Upload" className={styles.uploadIcon} />
                                            <div className={styles.uploadText}>Drag & drop or click to upload</div>
                                            <div className={styles.uploadSupport}>Supports: JPG, PNG, MP4, WebM (Max 50MB)</div>
                                        </label>
                                    ) : (
                                        <div className={styles.previewContainer}>
                                            {mediaPreview.type.startsWith('image/') ? (
                                                <img 
                                                    src={mediaPreview.url} 
                                                    alt="Preview" 
                                                    className={styles.mediaPreview}
                                                />
                                            ) : (
                                                <video 
                                                    src={mediaPreview.url} 
                                                    controls 
                                                    className={styles.mediaPreview}
                                                />
                                            )}
                                            <button 
                                                className={styles.removePreview}
                                                onClick={() => {
                                                    URL.revokeObjectURL(mediaPreview.url);
                                                    setMedia(null);
                                                    setMediaPreview(null);
                                                    // Reset file input to allow re-uploading the same file
                                                    const fileInput = document.getElementById('mediaUpload');
                                                    if (fileInput) fileInput.value = '';
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                    {media && !mediaPreview && (
                                        <div className={styles.uploadedFile}>
                                            <span>{media.name}</span>
                                            <button onClick={() => {
                                                setMedia(null);
                                                // Reset file input
                                                const fileInput = document.getElementById('mediaUpload');
                                                if (fileInput) fileInput.value = '';
                                            }}>×</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* National Park Form Fields */}
                            {/* Park Name Select */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Park Name <span className={styles.required}>*</span>
                                </label>
                                {fixedParkName ? (
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={parkName}
                                        disabled
                                        style={{
                                            backgroundColor: 'rgba(68, 122, 101, 0.2)',
                                            cursor: 'not-allowed',
                                            opacity: 0.7
                                        }}
                                    />
                                ) : (
                                    <select
                                        className={styles.select}
                                        value={parkName}
                                        onChange={(e) => setParkName(e.target.value)}
                                    >
                                        <option value="">Select a national park</option>
                                        {nationalParks.map((park) => (
                                            <option key={park.id} value={park.name}>
                                                {park.name} {park.state && `- ${park.state}`}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Location Input */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Location <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="State, India"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            {/* Banner Image Upload */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Banner Image <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.bannerUploadArea}>
                                    <input
                                        type="file"
                                        id="bannerUpload"
                                        className={styles.fileInput}
                                        accept="image/jpeg,image/png"
                                        onChange={handleBannerUpload}
                                    />
                                    {!bannerPreview ? (
                                        <label htmlFor="bannerUpload" className={styles.bannerUploadLabel}>
                                            <img src={mediaIcon} alt="Upload" className={styles.bannerUploadIcon} />
                                            <div className={styles.bannerUploadText}>Upload landscape banner image</div>
                                            <div className={styles.bannerUploadSupport}>Recommended: 1920x820px (21:9 ratio)</div>
                                        </label>
                                    ) : (
                                        <div className={styles.previewContainer}>
                                            <img 
                                                src={bannerPreview} 
                                                alt="Banner Preview" 
                                                className={styles.bannerPreview}
                                            />
                                            <button 
                                                className={styles.removePreview}
                                                onClick={() => {
                                                    URL.revokeObjectURL(bannerPreview);
                                                    setBannerImage(null);
                                                    setBannerPreview(null);
                                                    // Reset file input to allow re-uploading the same file
                                                    const fileInput = document.getElementById('bannerUpload');
                                                    if (fileInput) fileInput.value = '';
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                    {bannerImage && !bannerPreview && (
                                        <div className={styles.uploadedFile}>
                                            <span>{bannerImage.name}</span>
                                            <button onClick={() => {
                                                setBannerImage(null);
                                                // Reset file input
                                                const fileInput = document.getElementById('bannerUpload');
                                                if (fileInput) fileInput.value = '';
                                            }}>×</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description Textarea */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Description <span className={styles.required}>*</span>
                                </label>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Describe the park, its wildlife, and unique features... (minimum 50 characters)"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={2000}
                                />
                                <div className={styles.characterCount}>
                                    {description.length} / 2000 characters (minimum 50)
                                </div>
                            </div>
                        </>
                    )}

                    {/* Tags Input - Common for both types */}
                    {/* Tags Input - Common for both types */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tags</label>
                        <div className={styles.tagsInputContainer}>
                            <input
                                type="text"
                                className={styles.tagsInput}
                                placeholder={postType === 'thread' ? "Add tags (press Enter)" : "Add tags (e.g., Tigers, Grassland)"}
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className={styles.addTagButton} onClick={handleAddTag}>
                                <img src={addpostIcon} alt="Add" className={styles.addIcon} />
                                Add
                            </button>
                        </div>
                        {tags.length > 0 && (
                            <div className={styles.tagsContainer}>
                                {tags.map((tag, index) => (
                                    <span key={index} className={styles.tag}>
                                        {tag}
                                        <button 
                                            className={styles.removeTag}
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                        <button 
                            className={styles.cancelButton} 
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            className={styles.postButton} 
                            onClick={handleSubmit}
                            disabled={isSubmitting || (postType === 'thread' ? !title.trim() || !description.trim() : !parkName.trim() || !description.trim())}
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className={styles.loginPromptOverlay} onClick={() => setShowLoginPrompt(false)}>
                    <div className={styles.loginPromptModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.loginPromptHeader}>
                            <h3>Login Required</h3>
                            <button 
                                className={styles.closeButton} 
                                onClick={() => setShowLoginPrompt(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.loginPromptBody}>
                            <p>You need to be logged in to post a discussion.</p>
                            <p>Please login to continue.</p>
                        </div>
                        <div className={styles.loginPromptActions}>
                            <button 
                                className={styles.cancelButton}
                                onClick={() => setShowLoginPrompt(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className={styles.loginButton}
                                onClick={() => {
                                    setShowLoginPrompt(false);
                                    navigate('/login');
                                }}
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`${styles.toast} ${styles[toast.type]}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default CreatePostModal;