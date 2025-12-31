import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styles from './DiscussionDetailPage.module.css';
import { discussionService } from '../../services/discussionService';
import authService from '../../services/auth';

// Import icons
import backArrow from '../../assets/icons/backIcon.svg';
import eyeIcon from '../../assets/icons/eyeIcon.svg';
import commentsIcon from '../../assets/icons/commentsIcon.svg';
import likeIcon from '../../assets/icons/likeIcon.svg';
import dislikeIcon from '../../assets/icons/dislikeIcon.svg';
import saveIcon from '../../assets/icons/saveIcon.svg';
import shareIcon from '../../assets/icons/shareIcon.svg';
import deleteIcon from '../../assets/icons/deleteIcon.svg';

function DiscussionDetailPage() {
    const navigate = useNavigate();
    const { discussionId } = useParams();

    // State management
    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [showReplies, setShowReplies] = useState({});
    const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
    const [replyText, setReplyText] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Get current user
    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
    }, []);

    // Fetch discussion and comments on mount
    useEffect(() => {
        if (discussionId) {
            console.log('📌 DiscussionDetailPage mounted with ID/slug:', discussionId);
            loadDiscussion();
            loadComments();
        }
    }, [discussionId]);

    const loadDiscussion = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Attempting to load discussion:', discussionId);
            const data = await discussionService.getDiscussionById(discussionId);
            console.log('📄 Discussion data loaded:', data);
            console.log('🖼️ Media URL:', data.media_url);
            console.log('🎨 Banner Image:', data.banner_image);
            setDiscussion(data);
            setIsSaved(data.is_saved_by_user || false);
            console.log('✅ Discussion loaded successfully');
        } catch (err) {
            console.error('❌ Error loading discussion:', err);
            
            // Provide more specific error messages
            let errorMessage = 'Failed to load discussion';
            if (err.response) {
                // Server responded with an error status
                if (err.response.status === 404) {
                    errorMessage = 'Discussion not found';
                } else if (err.response.status === 403) {
                    errorMessage = "You don't have permission to view this discussion";
                } else if (err.response.status === 500) {
                    errorMessage = 'Server error. The backend encountered an issue. Please try again.';
                } else if (err.response.status === 401) {
                    errorMessage = 'Authentication issue. Please try logging in again.';
                } else {
                    errorMessage = err.response.data?.detail || 'Failed to load discussion';
                }
            } else if (err.request) {
                // Request was made but no response received
                errorMessage = 'Cannot connect to server. Please check your connection.';
            } else if (err.code === 'ERR_BAD_RESPONSE') {
                errorMessage = 'Received invalid response from server. Please try again.';
            }
            
            setError(errorMessage);
            setDiscussion(null);
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        try {
            console.log('💬 Loading comments for discussion:', discussionId);
            const data = await discussionService.getComments(discussionId);
            
            // DETAILED DEBUGGING
            console.log('===========================================');
            console.log('🔍 RAW API RESPONSE');
            console.log('===========================================');
            console.log('Total items received:', data.length);
            console.log('Full data:', JSON.stringify(data, null, 2));
            
            data.forEach((comment, idx) => {
                console.log(`\n📝 Comment #${idx}:`);
                console.log('  ID:', comment.id);
                console.log('  Content:', comment.content);
                console.log('  Parent ID:', comment.parent_id || 'NONE (top-level)');
                console.log('  Depth Level:', comment.depth_level);
                console.log('  Has replies array:', !!comment.replies);
                console.log('  Replies count:', comment.replies?.length || 0);
                if (comment.replies && comment.replies.length > 0) {
                    console.log('  Replies:', comment.replies.map(r => ({ id: r.id, content: r.content })));
                }
            });
            
            // Check if backend already provides nested structure
            const hasNestedStructure = data.some(c => c.replies && c.replies.length > 0);
            console.log('\n✅ Backend provides nested structure:', hasNestedStructure);
            
            let processedComments;
            
            if (hasNestedStructure) {
                // Backend already returns tree structure
                console.log('✅ Using backend tree structure');
                processedComments = data.filter(comment => 
                    !comment.depth_level || comment.depth_level === 0
                );
            } else {
                // Backend returns flat list - build tree manually
                console.log('⚠️ Building comment tree manually...');
                processedComments = buildCommentTree(data);
            }
            
            console.log('\n===========================================');
            console.log('📊 PROCESSED COMMENTS FOR DISPLAY');
            console.log('===========================================');
            console.log('Number of top-level comments:', processedComments.length);
            processedComments.forEach((comment, idx) => {
                console.log(`\n📌 Top-level Comment #${idx}:`);
                console.log('  ID:', comment.id);
                console.log('  Content:', comment.content);
                console.log('  Has replies:', !!comment.replies && comment.replies.length > 0);
                console.log('  Reply count:', comment.replies?.length || 0);
            });
            console.log('===========================================\n');
            
            // Sort comments by created_at (newest first - recent on top)
            const sortedComments = processedComments.sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
            
            setComments(sortedComments);
            
            // Auto-expand replies for comments that have them
            const newShowReplies = {};
            sortedComments.forEach(comment => {
                if (comment.replies && comment.replies.length > 0) {
                    newShowReplies[comment.id] = true; // Show replies by default
                }
            });
            setShowReplies(newShowReplies);
        } catch (err) {
            console.error('❌ Error loading comments:', {
                discussionId,
                error: err.message,
                response: err.response?.data
            });
            // Don't fail the whole page if comments fail to load
            setComments([]);
        }
    };
    
    // Build comment tree from flat list
    const buildCommentTree = (flatComments) => {
        const commentMap = {};
        const rootComments = [];
        
        // First pass: create map of all comments
        flatComments.forEach(comment => {
            commentMap[comment.id] = { ...comment, replies: [] };
        });
        
        // Second pass: build tree structure
        flatComments.forEach(comment => {
            if (comment.parent_id) {
                // This is a reply - add to parent's replies array
                const parent = commentMap[comment.parent_id];
                if (parent) {
                    parent.replies.push(commentMap[comment.id]);
                } else {
                    // Parent not found - treat as root
                    rootComments.push(commentMap[comment.id]);
                }
            } else {
                // This is a root comment
                rootComments.push(commentMap[comment.id]);
            }
        });
        
        console.log('Built tree structure:', rootComments);
        return rootComments;
    };

    // Format date to relative time
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    // Helper function to get initials
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleBack = () => {
        navigate('/community/discussions');
    };

    const handleLike = async () => {
        if (!discussion) return;
        
        try {
            const response = await discussionService.toggleLike(discussion.id);
            // Update discussion state with new like count and status
            setDiscussion(prev => ({
                ...prev,
                is_liked_by_user: response.is_liked,
                like_count: response.like_count
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
            if (error.response?.status === 401) {
                alert('Please log in to like discussions');
            }
        }
    };

    const handleSave = async () => {
        if (!discussion) return;
        
        try {
            const response = await discussionService.toggleSave(discussion.id);
            setIsSaved(response.is_saved);
        } catch (error) {
            console.error('Error toggling save:', error);
            if (error.response?.status === 401) {
                alert('Please log in to save discussions');
            }
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        const shareData = {
            title: discussion?.title || 'Check out this discussion',
            text: discussion?.excerpt || discussion?.content?.substring(0, 100) + '...' || '',
            url: url
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                    // Fallback to clipboard
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                }
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            try {
                await navigator.clipboard.writeText(url);
                alert('Link copied to clipboard! You can now paste it to share.');
            } catch (err) {
                console.error('Failed to copy:', err);
                // Create a temporary input element as ultimate fallback
                const input = document.createElement('input');
                input.value = url;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                alert('Link copied to clipboard!');
            }
        }
    };

    const handleDelete = async () => {
        if (!discussion) return;
        
        if (!window.confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) {
            return;
        }

        try {
            await discussionService.deleteDiscussion(discussion.id);
            alert('Discussion deleted successfully');
            navigate('/community/discussions');
        } catch (error) {
            console.error('Error deleting discussion:', error);
            if (error.response?.status === 401) {
                alert('Please log in to delete discussions');
            } else if (error.response?.status === 403) {
                alert('You do not have permission to delete this discussion');
            } else {
                alert('Failed to delete discussion. Please try again.');
            }
        }
    };

    const handlePostComment = async () => {
        if (!commentText.trim()) return;
        
        try {
            const newComment = await discussionService.createComment(discussionId, commentText);
            setComments(prev => [newComment, ...prev]);
            setCommentText('');
            // Update comment count
            setDiscussion(prev => ({
                ...prev,
                comment_count: prev.comment_count + 1
            }));
        } catch (error) {
            console.error('Error posting comment:', error);
            if (error.response?.status === 401) {
                alert('Please log in to comment');
            } else {
                alert('Failed to post comment. Please try again.');
            }
        }
    };

    const handleCancelComment = () => {
        setCommentText('');
    };

    const toggleReplies = (commentId) => {
        setShowReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const handleReply = (commentId) => {
        setReplyingTo(commentId);
        setReplyText('');
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    const handlePostReply = async (commentId) => {
        if (!replyText.trim()) return;
        
        try {
            // Find the parent comment to add reply
            await discussionService.createComment(discussionId, replyText, commentId);
            // Reload comments to get the updated tree
            await loadComments();
            setReplyText('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Error posting reply:', error);
            if (error.response?.status === 401) {
                alert('Please log in to reply');
            } else {
                alert('Failed to post reply. Please try again.');
            }
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            await discussionService.voteComment(commentId, 'like');
            // Reload comments to get accurate counts and vote status
            await loadComments();
        } catch (error) {
            console.error('Error voting on comment:', error);
            if (error.response?.status === 401) {
                alert('Please log in to vote on comments');
            }
        }
    };

    const handleCommentDislike = async (commentId) => {
        try {
            await discussionService.voteComment(commentId, 'dislike');
            // Reload comments to get accurate counts and vote status
            await loadComments();
        } catch (error) {
            console.error('Error voting on comment:', error);
            if (error.response?.status === 401) {
                alert('Please log in to vote on comments');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            await discussionService.deleteComment(commentId);
            // Reload comments to reflect the deletion
            await loadComments();
            // Update comment count
            setDiscussion(prev => ({
                ...prev,
                comment_count: Math.max(0, prev.comment_count - 1)
            }));
        } catch (error) {
            console.error('Error deleting comment:', error);
            if (error.response?.status === 401) {
                alert('Please log in to delete comments');
            } else if (error.response?.status === 404) {
                alert("Comment not found or you don't have permission to delete it");
            } else {
                alert('Failed to delete comment. Please try again.');
            }
        }
    };

    // Render a single comment with its replies
    const renderComment = (comment, depth = 0) => {
        const voteCount = comment.like_count - comment.dislike_count;
        const hasReplies = comment.replies && comment.replies.length > 0;
        const isAuthor = currentUser && comment.author.id === currentUser.id;
        
        console.log(`Rendering comment at depth ${depth}:`, {
            id: comment.id,
            content: comment.content.substring(0, 30),
            hasReplies,
            replyCount: comment.replies?.length || 0,
            showReplies: showReplies[comment.id]
        });
        
        return (
            <div key={comment.id} className={`${styles.commentItem} ${depth > 0 ? styles.nestedComment : ''}`}>
                <div className={styles.commentLeft}>
                    <button 
                        className={`${styles.voteButton} ${comment.user_vote === 'like' ? styles.voted : ''}`}
                        onClick={() => handleCommentLike(comment.id)}
                        title="Like"
                    >
                        <img src={likeIcon} alt="Like" className={styles.voteIcon} />
                    </button>
                    <span className={styles.voteCount}>{voteCount}</span>
                    <button 
                        className={`${styles.voteButton} ${comment.user_vote === 'dislike' ? styles.voted : ''}`}
                        onClick={() => handleCommentDislike(comment.id)}
                        title="Dislike"
                    >
                        <img src={dislikeIcon} alt="Dislike" className={styles.voteIcon} />
                    </button>
                </div>
                <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                        <div className={styles.avatar}>
                            {comment.author.avatar_url ? (
                                <img src={comment.author.avatar_url} alt={comment.author.username} />
                            ) : (
                                getInitials(comment.author.full_name || comment.author.username)
                            )}
                        </div>
                        <div className={styles.commentAuthorInfo}>
                            <div className={styles.commentAuthorName}>
                                <span className={styles.commentAuthor}>
                                    {comment.author.full_name || comment.author.username}
                                </span>
                                {comment.author.professional_title && (
                                    <span className={styles.commentBadge}>{comment.author.professional_title}</span>
                                )}
                            </div>
                            <div className={styles.commentTime}>
                                {formatRelativeTime(comment.created_at)}
                                {comment.is_edited && ' (edited)'}
                            </div>
                        </div>
                    </div>
                    <p className={styles.commentText}>{comment.content}</p>
                    <div className={styles.commentActions}>
                        <button 
                            className={styles.commentActionButton}
                            onClick={() => handleReply(comment.id)}
                        >
                            <img src={commentsIcon} alt="Reply" className={styles.commentActionIcon} />
                            Reply
                        </button>
                        {hasReplies && (
                            <button 
                                className={styles.commentActionButton}
                                onClick={() => toggleReplies(comment.id)}
                            >
                                {showReplies[comment.id] 
                                    ? `Hide ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
                                    : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
                                }
                            </button>
                        )}
                        {isAuthor && (
                            <button 
                                className={styles.commentActionButton}
                                onClick={() => handleDeleteComment(comment.id)}
                                title="Delete comment"
                            >
                                <img src={deleteIcon} alt="Delete" className={styles.commentActionIcon} />
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                        <div className={styles.replyInputSection}>
                            <div className={styles.replyInputWrapper}>
                                <textarea
                                    className={styles.replyInput}
                                    placeholder={`Reply to ${comment.author.full_name || comment.author.username}...`}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    autoFocus
                                />
                                <div className={styles.replyActions}>
                                    <button 
                                        className={styles.cancelButton}
                                        onClick={handleCancelReply}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className={styles.postButton}
                                        onClick={() => handlePostReply(comment.id)}
                                        disabled={!replyText.trim()}
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Replies */}
                    {hasReplies && showReplies[comment.id] && (
                        <div className={styles.replySection}>
                            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    color: 'rgba(255, 232, 161, 1)',
                    gap: '15px'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid rgba(255, 232, 161, 0.2)',
                        borderTop: '4px solid rgba(255, 232, 161, 1)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ fontSize: '16px' }}>Loading discussion...</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    if (error || !discussion) {
        return (
            <div className={styles.container}>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    color: 'rgba(255, 232, 161, 1)',
                    gap: '20px',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
                        {error || 'Discussion not found'}
                    </h2>
                    {error && error.includes('Server error') && (
                        <p style={{ fontSize: '14px', opacity: 0.8, maxWidth: '400px' }}>
                            The server encountered an error while loading this discussion. 
                            This may be temporary. Please try again.
                        </p>
                    )}
                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button 
                            onClick={() => {
                                setError(null);
                                setLoading(true);
                                loadDiscussion();
                            }}
                            style={{
                                padding: '12px 24px',
                                background: 'rgba(255, 232, 161, 0.2)',
                                color: 'rgba(255, 232, 161, 1)',
                                border: '2px solid rgba(255, 232, 161, 0.5)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 232, 161, 0.3)';
                                e.target.style.borderColor = 'rgba(255, 232, 161, 0.8)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 232, 161, 0.2)';
                                e.target.style.borderColor = 'rgba(255, 232, 161, 0.5)';
                            }}
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={() => navigate('/community/discussions')}
                            style={{
                                padding: '12px 24px',
                                background: 'rgba(255, 232, 161, 1)',
                                color: 'rgba(26, 49, 35, 1)',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            Back to Discussions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* SEO and Social Media Meta Tags */}
            <Helmet>
                <title>{discussion.title} - Junglore Community</title>
                <meta name="description" content={discussion.content.substring(0, 160)} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:title" content={discussion.title} />
                <meta property="og:description" content={discussion.content.substring(0, 160)} />
                {(discussion.media_url || discussion.banner_image) && (
                    <meta property="og:image" content={
                        (discussion.media_url || discussion.banner_image).startsWith('http') 
                            ? (discussion.media_url || discussion.banner_image)
                            : `${window.location.origin}${discussion.media_url || discussion.banner_image}`
                    } />
                )}
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={window.location.href} />
                <meta name="twitter:title" content={discussion.title} />
                <meta name="twitter:description" content={discussion.content.substring(0, 160)} />
                {(discussion.media_url || discussion.banner_image) && (
                    <meta name="twitter:image" content={
                        (discussion.media_url || discussion.banner_image).startsWith('http') 
                            ? (discussion.media_url || discussion.banner_image)
                            : `${window.location.origin}${discussion.media_url || discussion.banner_image}`
                    } />
                )}
            </Helmet>

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.backSection} onClick={handleBack}>
                        <img src={backArrow} alt="Back" className={styles.backArrow} />
                        <span className={styles.backText}>Back to Community</span>
                    </div>
                    <div className={styles.headerActions}>
                        <button 
                            className={styles.iconButton}
                            onClick={handleSave}
                            style={{ opacity: isSaved ? 1 : 0.7 }}
                        >
                            <img src={saveIcon} alt="Save" />
                        </button>
                        <button 
                            className={styles.iconButton}
                            onClick={handleShare}
                        >
                            <img src={shareIcon} alt="Share" />
                        </button>
                        {currentUser && discussion?.author?.id === currentUser.id && (
                            <button 
                                className={styles.iconButton}
                                onClick={handleDelete}
                            >
                                <img src={deleteIcon} alt="Delete" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Category Badge */}
                {discussion.category && (
                    <div className={styles.categoryBadge}>{discussion.category.name}</div>
                )}

                {/* Title */}
                <h1 className={styles.title}>{discussion.title}</h1>

                {/* Author Section */}
                <div className={styles.authorSection}>
                    <div className={styles.avatar}>
                        {discussion.author.avatar_url ? (
                            <img src={discussion.author.avatar_url} alt={discussion.author.username} />
                        ) : (
                            getInitials(discussion.author.full_name || discussion.author.username)
                        )}
                    </div>
                    <div className={styles.authorInfo}>
                        <div className={styles.authorName}>{discussion.author.full_name || discussion.author.username}</div>
                        <div className={styles.authorMeta}>
                            {discussion.author.professional_title && (
                                <span className={styles.authorBadge}>{discussion.author.professional_title}</span>
                            )}
                            {discussion.author.organization && (
                                <span className={styles.authorOrg}>{discussion.author.organization}</span>
                            )}
                            <span className={styles.postTime}>• Posted {formatRelativeTime(discussion.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                {discussion.tags && discussion.tags.length > 0 && (
                    <div className={styles.tags}>
                        {discussion.tags.map((tag, index) => (
                            <span key={index} className={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className={styles.content}>
                    <div dangerouslySetInnerHTML={{ __html: discussion.content.replace(/\n/g, '<br />') }} />
                </div>

                {/* Media (Image/Video) - Show uploaded media */}
                {discussion.media_url && (
                    <div className={styles.mediaContainer}>
                        {discussion.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img 
                                src={discussion.media_url.startsWith('http') ? discussion.media_url : `${(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace('/api/v1', '')}${discussion.media_url}`} 
                                alt={discussion.title} 
                                className={styles.contentImage}
                                onError={(e) => {
                                    console.error('Failed to load image:', discussion.media_url);
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : discussion.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video 
                                controls 
                                className={styles.contentImage}
                                onError={(e) => {
                                    console.error('Failed to load video:', discussion.media_url);
                                }}
                            >
                                <source src={discussion.media_url.startsWith('http') ? discussion.media_url : `${(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace('/api/v1', '')}${discussion.media_url}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img 
                                src={discussion.media_url.startsWith('http') ? discussion.media_url : `${(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace('/api/v1', '')}${discussion.media_url}`} 
                                alt={discussion.title} 
                                className={styles.contentImage}
                                onError={(e) => {
                                    console.error('Failed to load media:', discussion.media_url);
                                    e.target.style.display = 'none';
                                }}
                            />
                        )}
                    </div>
                )}

                {/* Banner Image for National Park type */}
                {discussion.banner_image && (
                    <div className={styles.mediaContainer}>
                        <img 
                            src={discussion.banner_image.startsWith('http') ? discussion.banner_image : `${(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace('/api/v1', '')}${discussion.banner_image}`} 
                            alt={discussion.park_name} 
                            className={styles.contentImage}
                            onError={(e) => {
                                console.error('Failed to load banner:', discussion.banner_image);
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                {/* Stats Section */}
                <div className={styles.statsSection}>
                    <div className={styles.statItem}>
                        <img src={eyeIcon} alt="Views" className={styles.statIcon} />
                        <span>{discussion.view_count} views</span>
                    </div>
                    <div className={styles.statItem}>
                        <img src={commentsIcon} alt="Comments" className={styles.statIcon} />
                        <span>{discussion.comment_count} comments</span>
                    </div>
                    <button 
                        className={`${styles.likeButton} ${discussion.is_liked_by_user ? styles.liked : ''}`}
                        onClick={handleLike}
                    >
                        <img src={likeIcon} alt="Like" className={styles.statIcon} />
                        <span>{discussion.like_count}</span>
                    </button>
                </div>

                {/* Comments Section */}
                <section className={styles.commentsSection}>
                    <h2 className={styles.commentsHeader}>Discussion ({comments.length})</h2>

                    {/* Comment Input */}
                    <div className={styles.commentInputSection}>
                        <div className={styles.avatar}>You</div>
                        <div className={styles.commentInputWrapper}>
                            <textarea
                                className={styles.commentInput}
                                placeholder="Share your thoughts or ask a question..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <div className={styles.commentActions}>
                                <span className={styles.commentGuideline}>
                                    Be respectful and constructive
                                </span>
                                <div className={styles.commentButtonGroup}>
                                    <button 
                                        className={styles.cancelButton}
                                        onClick={handleCancelComment}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className={styles.postButton}
                                        onClick={handlePostComment}
                                        disabled={!commentText.trim()}
                                    >
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className={styles.commentsList}>
                        {comments.map((comment) => renderComment(comment))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default DiscussionDetailPage;
