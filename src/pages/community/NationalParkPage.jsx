// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import styles from './NationalParkPage.module.css';
// import CreatePostModal from '../../components/community/CreatePostModal';
// import MediaUploadModal from '../../components/community/MediaUploadModal';
// import { API_BASE_URL } from '../../services/api';
// // import Header from '../../components/common/Header';

// // Import icons
// import discussionnIcon from '../../assets/icons/discussionnIcon.svg';
// import discussionIcon from '../../assets/icons/discussionIcon.svg';
// import mediaIcon from '../../assets/icons/mediaIcon.svg';
// import videosIcon from '../../assets/icons/videosIcon.svg';
// import aboutIcon from '../../assets/icons/aboutInfo.svg';
// import backIcon from '../../assets/icons/backIcon.svg';
// import locationIcon from '../../assets/icons/locationIcon.svg';
// import postsIcon from '../../assets/icons/postsIcon.svg';
// import eyeIcon from '../../assets/icons/eyeIcon.svg';
// import commentsIcon from '../../assets/icons/commentsIcon.svg';
// import uploadIcon from '../../assets/icons/uploadIcon.svg';

// // Import placeholder images (you can replace these with actual park images)
// import AnimalBirdsImage from '../../assets/images/community/animal_birds.png';
// import AnimalMammalImage from '../../assets/images/community/animal_mammal.png';

// // Mock data for different national parks
// const parkData = {
//     'ranthambore': {
//         name: 'Ranthambore National Park',
//         location: 'Rajasthan, India',
//         followers: '21.3K',
//         posts: '1567',
//         backgroundImage: AnimalMammalImage,
//         description: `One of the largest national parks in northern India, famous for its Bengal tiger population and historic Ranthambore Fort.`,
//         biodiversity: `The park is home to a diverse range of wildlife including:
        
// • Bengal Tigers - The main attraction with around 70-75 tigers
// • Leopards - Frequently spotted in the rocky terrain
// • Sloth Bears - Found in the forest areas
// • Sambar Deer - The largest deer species in India
// • Chital (Spotted Deer) - Most commonly seen herbivore
// • Nilgai - The largest Asian antelope
// • Wild Boar - Common throughout the park
// • Indian Fox and Desert Fox
// • Marsh Crocodiles in the lakes
// • Over 300 species of birds including eagles, vultures, and waterfowl`,
//         conservation: `Ranthambore has been at the forefront of tiger conservation in India. The park is part of Project Tiger, a wildlife conservation movement in India. Conservation efforts include:

// • Anti-poaching measures with dedicated tiger protection force
// • Habitat restoration and maintenance
// • Community involvement programs
// • Scientific research and monitoring of tiger population
// • Eco-tourism initiatives to generate awareness and funds`
//     },
//     'birds': {
//         name: 'Avian Sanctuary',
//         location: 'Multiple Locations, India',
//         followers: '330',
//         posts: '145',
//         backgroundImage: AnimalBirdsImage,
//         description: 'A network of bird sanctuaries across India dedicated to the protection and conservation of avian species.',
//         biodiversity: 'Home to hundreds of bird species including migratory birds.',
//         conservation: 'Focused on habitat preservation and anti-poaching measures.'
//     },
//     'mammals': {
//         name: 'Mammal Reserve',
//         location: 'Central India',
//         followers: '20K',
//         posts: '892',
//         backgroundImage: AnimalMammalImage,
//         description: 'A premier wildlife reserve focusing on large mammal conservation.',
//         biodiversity: 'Tigers, leopards, elephants, and various deer species.',
//         conservation: 'Active conservation programs and research initiatives.'
//     }
// };

// // Mock discussions data
// const discussionsData = [
//     {
//         id: 1,
//         userName: 'Rajesh Kumar',
//         userInitials: 'RK',
//         userRole: 'Wildlife Photographer',
//         postTime: '2 hours ago',
//         content: 'Incredible tiger sighting this morning! T-84 (Arrowhead) was spotted near Malik Talao with her two cubs. The morning light was perfect for photography.',
//         image: AnimalMammalImage,
//         tags: ['#Tiger', '#Wildlife', '#Photography'],
//         views: 342,
//         comments: 28
//     },
//     {
//         id: 2,
//         userName: 'Dr. Meera Patel',
//         userInitials: 'DMP',
//         userRole: 'Conservation Biologist',
//         verified: true,
//         postTime: '5 hours ago',
//         content: 'Park management has successfully reduced human-wildlife conflict by 35% this year through community engagement programs. Here\'s how the corridor project is working...',
//         tags: ['#Conservation', '#Research', '#Community'],
//         views: 567,
//         comments: 42
//     }
// ];

// // Unsplash wildlife images for media section (higher resolution for gallery view)
// const mediaImages = [
//     'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1920&h=1080&fit=crop', // Tiger
//     'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&h=1080&fit=crop', // Leopard
//     'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=1920&h=1080&fit=crop', // Elephant
//     'https://plus.unsplash.com/premium_photo-1669725687150-15c603ac6a73?w=1920&h=1080&fit=crop', // Deer
//     'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1920&h=1080&fit=crop', // Birds
//     'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=1920&h=1080&fit=crop', // Wildlife
//     'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=1920&h=1080&fit=crop', // Nature
//     'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop', // Forest
// ];
//     const tabs = [
//         { id: 'discussions', label: 'Discussions', icon: discussionnIcon },
//         { id: 'media', label: 'Media', icon: mediaIcon },
//         { id: 'videos', label: 'Videos', icon: videosIcon },
//         { id: 'about', label: 'About', icon: aboutIcon },
//     ];
// // Unsplash wildlife videos/nature for videos section (higher resolution for gallery view)
// const videoThumbnails = [
//     'https://images.unsplash.com/photo-1543946207-39bd91e70ca7?w=1920&h=1080&fit=crop', // Wildlife video
//     'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=1920&h=1080&fit=crop', // Nature video
//     'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1920&h=1080&fit=crop', // River video
//     'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop', // Jungle video
//     'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=1920&h=1080&fit=crop', // Animal video
//     'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=1920&h=1080&fit=crop', // Wildlife doc
//     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop', // Mountain video
//     'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop', // Forest video
// ];

// function NationalParkPage() {
//     const { parkId } = useParams(); // This is actually the slug from the URL
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('discussions');
//     const [galleryOpen, setGalleryOpen] = useState(false);
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const [currentGalleryType, setCurrentGalleryType] = useState('media'); // 'media' or 'videos'
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [park, setPark] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [discussions, setDiscussions] = useState([]);
//     const [discussionsLoading, setDiscussionsLoading] = useState(true);
//     const [uploadModalOpen, setUploadModalOpen] = useState(false);
//     const [uploadType, setUploadType] = useState('media'); // 'media' or 'videos'

//     // All handler functions defined before conditional returns
//     const handleBack = () => {
//         navigate('/community');
//     };

//     const handleDiscussionClick = (discussionId, discussionSlug) => {
//         navigate(`/community/discussions/${discussionSlug || discussionId}`);
//     };

//     const handleStartDiscussion = () => {
//         setIsModalOpen(true);
//     };

//     const handleUploadClick = (type) => {
//         setUploadType(type);
//         setUploadModalOpen(true);
//     };

//     const openGallery = (index, type) => {
//         setCurrentImageIndex(index);
//         setCurrentGalleryType(type);
//         setGalleryOpen(true);
//     };

//     const closeGallery = () => {
//         setGalleryOpen(false);
//     };

//     const goToNextImage = () => {
//         const maxIndex = currentGalleryType === 'media' 
//             ? ((park.media_urls && park.media_urls.length > 0 ? park.media_urls.length : mediaImages.length) - 1)
//             : ((park.video_urls && park.video_urls.length > 0 ? park.video_urls.length : videoThumbnails.length) - 1);
//         if (currentImageIndex < maxIndex) {
//             setCurrentImageIndex(currentImageIndex + 1);
//         }
//     };

//     const goToPreviousImage = () => {
//         if (currentImageIndex > 0) {
//             setCurrentImageIndex(currentImageIndex - 1);
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (!galleryOpen) return;
//         if (e.key === 'Escape') closeGallery();
//         if (e.key === 'ArrowRight') goToNextImage();
//         if (e.key === 'ArrowLeft') goToPreviousImage();
//     };

//     // Fetch park data from API using slug
//     React.useEffect(() => {
//         const fetchPark = async () => {
//             try {
//                 // Get all parks and find by slug (since API doesn't have a slug endpoint)
//                 const response = await fetch(`${API_BASE_URL}/national-parks?is_active=true`);
//                 if (response.ok) {
//                     const parks = await response.json();
//                     const foundPark = parks.find(p => p.slug === parkId);
                    
//                     if (foundPark) {
//                         // Transform API data to match the expected format
//                         setPark({
//                             name: foundPark.name,
//                             location: foundPark.state || 'India',
//                             posts: '0', // Will be updated after fetching discussions
//                             backgroundImage: AnimalMammalImage, // Use default for now
//                             description: foundPark.description || 'Explore this beautiful national park',
//                             biodiversity: foundPark.biodiversity || 'Information about wildlife and biodiversity coming soon.',
//                             conservation: foundPark.conservation || 'Conservation efforts information coming soon.',
//                             media_urls: foundPark.media_urls || [],
//                             video_urls: foundPark.video_urls || [],
//                             banner_media_url: foundPark.banner_media_url,
//                             banner_media_type: foundPark.banner_media_type
//                         });
//                     } else {
//                         // Fallback to hardcoded data if park not found
//                         setPark(parkData[parkId] || parkData['ranthambore']);
//                     }
//                 } else {
//                     // Fallback to hardcoded data on error
//                     setPark(parkData[parkId] || parkData['ranthambore']);
//                 }
//             } catch (error) {
//                 console.error('Error fetching park:', error);
//                 // Fallback to hardcoded data
//                 setPark(parkData[parkId] || parkData['ranthambore']);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPark();
//     }, [parkId]);

//     // Fetch discussions for this park
//     React.useEffect(() => {
//         const fetchDiscussions = async () => {
//             if (!park || !park.name) return;
            
//             try {
//                 setDiscussionsLoading(true);
//                 // Fetch discussions filtered by type=national_park and search by park name
//                 const response = await fetch(
//                     `${API_BASE_URL}/discussions?type=national_park&search=${encodeURIComponent(park.name)}&status=approved&sort_by=recent&page_size=50`
//                 );
                
//                 if (response.ok) {
//                     const data = await response.json();
//                     const fetchedDiscussions = data.items || [];
//                     setDiscussions(fetchedDiscussions);
                    
//                     // Update park posts count with actual discussion count
//                     setPark(prevPark => ({
//                         ...prevPark,
//                         posts: fetchedDiscussions.length.toString()
//                     }));
//                 } else {
//                     console.error('Failed to fetch discussions');
//                     setDiscussions([]);
//                 }
//             } catch (error) {
//                 console.error('Error fetching discussions:', error);
//                 setDiscussions([]);
//             } finally {
//                 setDiscussionsLoading(false);
//             }
//         };

//         fetchDiscussions();
//     }, [park?.name]); // Only depend on park.name to avoid infinite loop

//     // Keyboard navigation for gallery
//     React.useEffect(() => {
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [galleryOpen, currentImageIndex]);

//     if (loading) {
//         return (
//             <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//                 minHeight: '100vh',
//                 color: 'rgba(255, 232, 161, 1)',
//                 fontFamily: 'DM Sans',
//                 fontSize: '18px'
//             }}>
//                 Loading park details...
//             </div>
//         );
//     }

//     if (!park) {
//         return (
//             <div style={{ 
//                 display: 'flex', 
//                 flexDirection: 'column',
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//                 minHeight: '100vh',
//                 color: 'rgba(255, 232, 161, 1)',
//                 fontFamily: 'DM Sans',
//                 fontSize: '18px',
//                 gap: '20px'
//             }}>
//                 <div>Park not found</div>
//                 <button onClick={() => navigate('/community')}>
//                     Back to Community
//                 </button>
//             </div>
//         );
//     }

//     const tabs = [
//         { id: 'discussions', label: 'Discussions', icon: discussionnIcon },
//         { id: 'media', label: 'Media', icon: mediaIcon },
//         { id: 'videos', label: 'Videos', icon: videosIcon },
//         { id: 'about', label: 'About', icon: aboutIcon },
//     ];

//     return (
//         <div className={styles.pageContainer}>
//             {/* <Header /> */}
            
//             <div 
//                 className={styles.heroSection}
//                 style={(park?.banner_media_type !== 'video') ? {
//                     backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%), url(${park?.banner_media_url || park?.backgroundImage || AnimalMammalImage})`
//                 } : {}}
//             >
//                 {park?.banner_media_type === 'video' && park?.banner_media_url && (
//                     <video
//                         autoPlay
//                         loop
//                         muted
//                         playsInline
//                         style={{
//                             position: 'absolute',
//                             top: 0,
//                             left: 0,
//                             width: '100%',
//                             height: '100%',
//                             objectFit: 'cover',
//                             zIndex: 0
//                         }}
//                     >
//                         <source src={park.banner_media_url} type="video/mp4" />
//                         <source src={park.banner_media_url} type="video/webm" />
//                     </video>
//                 )}
//                 {park?.banner_media_type === 'video' && park?.banner_media_url && (
//                     <div style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%)',
//                         zIndex: 1
//                     }}></div>
//                 )}
//                 <div className={styles.heroContent} style={{ position: 'relative', zIndex: 2 }}>
//                     <div className={styles.parkInfo}>
//                         <h1 className={styles.parkTitle}>{park.name}</h1>
//                         <div className={styles.parkMeta}>
//                             <div className={styles.metaItem}>
//                                 <img className={styles.metaIcon} src={locationIcon} alt="Location" />
//                                 {park.location}
//                             </div>
//                             <div className={styles.metaItem}>
//                                 <img className={styles.metaIcon} src={postsIcon} alt="Discussions" />
//                                 {park.posts} {parseInt(park.posts) === 1 ? 'discussion' : 'discussions'}
//                             </div>
//                         </div>
//                         <p className={styles.parkDescription}>{park.description}</p>
//                     </div>
//                 </div>
//             </div>

//             <div className={styles.tabsSection}>
//                 <div className={styles.tabsWrapper}>
//                     <div className={styles.tabsContainer}>
//                         {tabs.map((tab) => (
//                             <button
//                                 key={tab.id}
//                                 className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
//                                 onClick={() => setActiveTab(tab.id)}
//                             >
//                                 <img 
//                                     className={styles.tabIcon}
//                                     src={tab.icon} 
//                                     alt={tab.label}
//                                     style={{
//                                         filter: activeTab === tab.id 
//                                             ? 'brightness(0) saturate(100%) invert(91%) sepia(21%) saturate(1067%) hue-rotate(317deg) brightness(105%) contrast(102%)'
//                                             : 'brightness(0) saturate(100%) invert(91%) sepia(21%) saturate(1067%) hue-rotate(317deg) brightness(105%) contrast(102%) opacity(0.6)'
//                                     }}
//                                 />
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>
                    
//                     {activeTab === 'discussions' && (
//                         <button className={styles.startDiscussionButton} onClick={handleStartDiscussion}>
//                             <img className={styles.buttonIcon} src={discussionIcon} alt="Discussion" />
//                             Start a Discussion
//                         </button>
//                     )}
                    
//                     {(activeTab === 'media' || activeTab === 'videos') && (
//                         <button className={styles.uploadButton} onClick={() => handleUploadClick(activeTab)}>
//                             <img className={styles.buttonIcon} src={uploadIcon} alt="Upload" />
//                             Upload
//                         </button>
//                     )}
//                 </div>
//             </div>

//             <div className={styles.contentSection}>
//                 {activeTab === 'discussions' && (
//                     <div className={styles.discussionsContainer}>
//                         {discussionsLoading ? (
//                             <div style={{ 
//                                 textAlign: 'center', 
//                                 color: 'rgba(255, 232, 161, 1)', 
//                                 fontFamily: 'DM Sans',
//                                 padding: '40px',
//                                 width: '100%'
//                             }}>
//                                 Loading discussions...
//                             </div>
//                         ) : discussions.length === 0 ? (
//                             <div style={{ 
//                                 textAlign: 'center', 
//                                 color: 'rgba(255, 232, 161, 1)', 
//                                 fontFamily: 'DM Sans',
//                                 padding: '40px',
//                                 width: '100%'
//                             }}>
//                                 No discussions yet for this park. Be the first to start one!
//                             </div>
//                         ) : (
//                             discussions.map((post) => (
//                                 <div key={post.id} className={styles.postCard} onClick={() => handleDiscussionClick(post.id, post.slug)} style={{ cursor: 'pointer' }}>
//                                     <div className={styles.postHeader}>
//                                         <div className={styles.userAvatar}>
//                                             {post.author?.avatar_url ? (
//                                                 <img src={post.author.avatar_url} alt={post.author.username} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
//                                             ) : (
//                                                 post.author?.username?.substring(0, 2).toUpperCase() || 'AN'
//                                             )}
//                                         </div>
//                                         <div className={styles.userInfo}>
//                                             <div className={styles.userName}>
//                                                 {post.author?.full_name || post.author?.username || 'Anonymous'}
//                                                 {post.author?.is_verified && (
//                                                     <span style={{ color: 'rgba(255, 232, 161, 1)', marginLeft: '5px' }}>●</span>
//                                                 )}
//                                                 {post.author?.professional_title && (
//                                                     <span className={styles.userRole}>• {post.author.professional_title}</span>
//                                                 )}
//                                             </div>
//                                             <div className={styles.postTime}>
//                                                 {new Date(post.created_at).toLocaleDateString('en-US', { 
//                                                     month: 'short', 
//                                                     day: 'numeric', 
//                                                     year: 'numeric' 
//                                                 })}
//                                             </div>
//                                         </div>
//                                     </div>
                                    
//                                     <p className={styles.postContent}>{post.excerpt || post.content?.substring(0, 200) || ''}</p>
                                    
//                                     {post.banner_image && <img className={styles.postImage} src={post.banner_image} alt="Post" />}
                                    
//                                     {post.tags && post.tags.length > 0 && (
//                                         <div className={styles.postTags}>
//                                             {post.tags.map((tag, index) => (
//                                                 <span key={index} className={styles.tag}>#{tag}</span>
//                                             ))}
//                                         </div>
//                                     )}
                                    
//                                     <div className={styles.postFooter}>
//                                         <div className={styles.postStat}>
//                                             <img className={styles.statIcon} src={eyeIcon} alt="Views" />
//                                             {post.view_count || 0}
//                                         </div>
//                                         <div className={styles.postStat}>
//                                             <img className={styles.statIcon} src={commentsIcon} alt="Comments" />
//                                             {post.comment_count || 0}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 )}

//                 {activeTab === 'media' && (
//                     <div className={styles.mediaGrid}>
//                         {park.media_urls && park.media_urls.length > 0 ? (
//                             park.media_urls.map((imageUrl, index) => (
//                                 <div key={index} className={styles.mediaItem} onClick={() => openGallery(index, 'media')}>
//                                     <img className={styles.mediaImage} src={imageUrl} alt={`Wildlife ${index + 1}`} loading="lazy" />
//                                 </div>
//                             ))
//                         ) : (
//                             mediaImages.map((imageUrl, index) => (
//                                 <div key={index} className={styles.mediaItem} onClick={() => openGallery(index, 'media')}>
//                                     <img className={styles.mediaImage} src={imageUrl} alt={`Wildlife ${index + 1}`} loading="lazy" />
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 )}

//                 {activeTab === 'videos' && (
//                     <div className={styles.mediaGrid}>
//                         {park.video_urls && park.video_urls.length > 0 ? (
//                             park.video_urls.map((videoUrl, index) => (
//                                 <div key={index} className={styles.mediaItem} onClick={() => openGallery(index, 'videos')}>
//                                     <video 
//                                         className={styles.mediaImage} 
//                                         preload="metadata"
//                                         style={{ cursor: 'pointer' }}
//                                     >
//                                         <source src={videoUrl} type="video/mp4" />
//                                         <source src={videoUrl} type="video/webm" />
//                                         <source src={videoUrl} type="video/mov" />
//                                         Your browser does not support the video tag.
//                                     </video>
//                                     <div style={{ 
//                                         position: 'absolute', 
//                                         top: '50%', 
//                                         left: '50%', 
//                                         transform: 'translate(-50%, -50%)',
//                                         fontSize: '48px',
//                                         color: 'white',
//                                         textShadow: '0 2px 8px rgba(0,0,0,0.8)',
//                                         pointerEvents: 'none'
//                                     }}>▶</div>
//                                 </div>
//                             ))
//                         ) : (
//                             videoThumbnails.map((thumbnailUrl, index) => (
//                                 <div key={index} className={styles.mediaItem} onClick={() => openGallery(index, 'videos')}>
//                                     <img className={styles.mediaImage} src={thumbnailUrl} alt={`Video ${index + 1}`} loading="lazy" />
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 )}

//                 {activeTab === 'about' && (
//                     <div className={styles.aboutContent}>
//                         <p>{park.description}</p>
//                         <h2>Biodiversity</h2>
//                         <p style={{ whiteSpace: 'pre-line' }}>{park.biodiversity}</p>
//                         <h2>Conservation Efforts</h2>
//                         <p style={{ whiteSpace: 'pre-line' }}>{park.conservation}</p>
//                     </div>
//                 )}
//             </div>

//             {/* Gallery Modal */}
//             {galleryOpen && (
//                 <div className={styles.galleryModal} onClick={closeGallery}>
//                     <button className={styles.closeButton} onClick={closeGallery}>×</button>
                    
//                     <button 
//                         className={`${styles.navigationArrow} ${styles.leftArrow}`}
//                         onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }}
//                         disabled={currentImageIndex === 0}
//                     >
//                         ‹
//                     </button>
                    
//                     <div className={styles.galleryContent} onClick={(e) => e.stopPropagation()}>
//                         {currentGalleryType === 'media' ? (
//                             <img
//                                 className={styles.galleryImage}
//                                 src={park.media_urls && park.media_urls.length > 0 ? park.media_urls[currentImageIndex] : mediaImages[currentImageIndex]}
//                                 alt={`Wildlife ${currentImageIndex + 1}`}
//                             />
//                         ) : (
//                             <video
//                                 key={currentImageIndex}
//                                 className={styles.galleryImage}
//                                 controls
//                                 autoPlay
//                                 style={{ maxHeight: '80vh', maxWidth: '90vw' }}
//                             >
//                                 <source 
//                                     src={park.video_urls && park.video_urls.length > 0 ? park.video_urls[currentImageIndex] : videoThumbnails[currentImageIndex]} 
//                                     type="video/mp4" 
//                                 />
//                                 <source 
//                                     src={park.video_urls && park.video_urls.length > 0 ? park.video_urls[currentImageIndex] : videoThumbnails[currentImageIndex]} 
//                                     type="video/webm" 
//                                 />
//                                 Your browser does not support the video tag.
//                             </video>
//                         )}
//                     </div>
                    
//                     <button 
//                         className={`${styles.navigationArrow} ${styles.rightArrow}`}
//                         onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
//                         disabled={currentImageIndex === (currentGalleryType === 'media' 
//                             ? ((park.media_urls && park.media_urls.length > 0 ? park.media_urls.length : mediaImages.length) - 1)
//                             : ((park.video_urls && park.video_urls.length > 0 ? park.video_urls.length : videoThumbnails.length) - 1)
//                         )}
//                     >
//                         ›
//                     </button>
                    
//                     <div className={styles.galleryControls}>
//                         <button 
//                             className={styles.galleryButton}
//                             onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }}
//                             disabled={currentImageIndex === 0}
//                         >
//                             ←
//                         </button>
                        
//                         <div className={styles.imageCounter}>
//                             {currentImageIndex + 1} / {currentGalleryType === 'media' 
//                                 ? (park.media_urls && park.media_urls.length > 0 ? park.media_urls.length : mediaImages.length)
//                                 : (park.video_urls && park.video_urls.length > 0 ? park.video_urls.length : videoThumbnails.length)
//                             }
//                         </div>
                        
//                         <button 
//                             className={styles.galleryButton}
//                             onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
//                             disabled={currentImageIndex === (currentGalleryType === 'media' 
//                                 ? ((park.media_urls && park.media_urls.length > 0 ? park.media_urls.length : mediaImages.length) - 1)
//                                 : ((park.video_urls && park.video_urls.length > 0 ? park.video_urls.length : videoThumbnails.length) - 1)
//                             )}
//                         >
//                             →
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Create Post Modal */}
//             <CreatePostModal 
//                 isOpen={isModalOpen} 
//                 onClose={() => setIsModalOpen(false)}
//                 fixedParkName={park.name}
//             />

//             {/* Media Upload Modal */}
//             <MediaUploadModal
//                 isOpen={uploadModalOpen}
//                 onClose={() => setUploadModalOpen(false)}
//                 uploadType={uploadType}
//                 parkId={parkId}
//                 parkName={park.name}
//             />
//         </div>
//     );
// }

// export default NationalParkPage;



import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './NationalParkPage.module.css';
import CreatePostModal from '../../components/community/CreatePostModal';
import MediaUploadModal from '../../components/community/MediaUploadModal';
// import Header from '../../components/common/Header';
import { API_BASE_URL } from '../../services/api';

// Import icons
import discussionnIcon from '../../assets/icons/discussionnIcon.svg';
import discussionIcon from '../../assets/icons/discussionIcon.svg';
import mediaIcon from '../../assets/icons/mediaIcon.svg';
import videosIcon from '../../assets/icons/videosIcon.svg';
import aboutIcon from '../../assets/icons/aboutInfo.svg';
import backIcon from '../../assets/icons/backIcon.svg';
import locationIcon from '../../assets/icons/locationIcon.svg';
import postsIcon from '../../assets/icons/postsIcon.svg';
import eyeIcon from '../../assets/icons/eyeIcon.svg';
import commentsIcon from '../../assets/icons/commentsIcon.svg';
import uploadIcon from '../../assets/icons/uploadIcon.svg';

// Import placeholder images (you can replace these with actual park images)
import AnimalBirdsImage from '../../assets/images/community/animal_birds.png';
import AnimalMammalImage from '../../assets/images/community/animal_mammal.png';

// Auto-Slider Component for Hero Section
const ExpeditionSlider = ({ expeditionSlugs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    React.useEffect(() => {
        if (!expeditionSlugs || expeditionSlugs.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % expeditionSlugs.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [expeditionSlugs]);

    if (!expeditionSlugs || expeditionSlugs.length === 0) return null;

    return (
        <div className={styles.expeditionSlider}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                {expeditionSlugs.map((slug, index) => (
                    <div key={slug} style={{
                        position: index === currentIndex ? 'relative' : 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        opacity: index === currentIndex ? 1 : 0,
                        transform: `translateX(${index === currentIndex ? '0' : '20px'})`,
                        transition: 'all 0.5s ease-in-out',
                        visibility: index === currentIndex ? 'visible' : 'hidden'
                    }}>
                        <ExpeditionPackageCard compact={true} expeditionSlug={slug} />
                    </div>
                ))}
            </div>
            
            {expeditionSlugs.length > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '12px'
                }}>
                    {expeditionSlugs.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                width: index === currentIndex ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: index === currentIndex 
                                    ? 'rgba(255, 232, 161, 1)' 
                                    : 'rgba(255, 232, 161, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Expedition Package Component
const ExpeditionPackageCard = ({ compact = false, expeditionSlug = 'tigers-of-tadoba' }) => {
    const handleExpeditionClick = () => {
        window.open(`https://www.junglore.com/explore/${expeditionSlug}`, '_blank');
    };

    if (compact) {
        return (
            <div className={styles.expeditionCardCompact}
            onClick={handleExpeditionClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 232, 161, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}>
                <div style={{
                    fontSize: '10px',
                    color: 'rgba(255, 232, 161, 0.8)',
                    fontWeight: '500',
                    marginBottom: '8px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}>Featured Expedition</div>
                <h3 style={{
                    color: 'rgba(255, 232, 161, 1)',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                    fontFamily: 'DM Sans'
                }}>{expeditionSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h3>
                <p style={{
                    color: 'rgba(255, 232, 161, 0.9)',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    margin: '0 0 12px 0',
                    fontFamily: 'DM Sans'
                }}>Experience the thrill of tracking tigers in their natural habitat</p>
                <button style={{
                    background: 'rgba(255, 232, 161, 1)',
                    color: 'rgba(37, 40, 43, 1)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%',
                    fontFamily: 'DM Sans',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 232, 161, 0.9)';
                    e.stopPropagation();
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 232, 161, 1)';
                    e.stopPropagation();
                }}>View Expedition</button>
            </div>
        );
    }

    return (
        <div className={styles.expeditionCardFull}
        onClick={handleExpeditionClick}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 232, 161, 0.2)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
            <div className={styles.sponsoredBadge}>SPONSORED</div>
            <div className={styles.expeditionCardContent}>
                <div className={styles.expeditionCardImage}></div>
                <div className={styles.expeditionCardDetails}>
                    <h3 style={{
                        color: 'rgba(255, 232, 161, 1)',
                        fontSize: '24px',
                        fontWeight: '600',
                        margin: '0 0 8px 0',
                        fontFamily: 'DM Sans'
                    }}>🐅 {expeditionSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h3>
                    <p style={{
                        color: 'rgba(255, 232, 161, 0.9)',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        margin: '0 0 16px 0',
                        fontFamily: 'DM Sans'
                    }}>Join an exclusive jungle expedition package. Expert guides, premium safaris, and unforgettable wildlife encounters await!</p>
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginBottom: '16px',
                        flexWrap: 'wrap'
                    }}>
                        
                        <div style={{
                            color: 'rgba(255, 232, 161, 0.9)',
                            fontSize: '13px',
                            fontFamily: 'DM Sans'
                        }}>🚙 Safari Included</div>
                        <div style={{
                            color: 'rgba(255, 232, 161, 0.9)',
                            fontSize: '13px',
                            fontFamily: 'DM Sans'
                        }}>🏨 Accommodation Included</div>
                    </div>
                    <button style={{
                        background: 'rgba(255, 232, 161, 1)',
                        color: 'rgba(37, 40, 43, 1)',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'DM Sans',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 232, 161, 0.9)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.stopPropagation();
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 232, 161, 1)';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.stopPropagation();
                    }}>Explore Details</button>
                </div>
            </div>
        </div>
    );
};

// Mock data for different national parks
const parkData = {
    'ranthambore': {
        name: 'Ranthambore National Park',
        location: 'Rajasthan, India',
        followers: '21.3K',
        posts: '1567',
        backgroundImage: AnimalMammalImage,
        description: `One of the largest national parks in northern India, famous for its Bengal tiger population and historic Ranthambore Fort.`,
        biodiversity: `The park is home to a diverse range of wildlife including:
        
• Bengal Tigers - The main attraction with around 70-75 tigers
• Leopards - Frequently spotted in the rocky terrain
• Sloth Bears - Found in the forest areas
• Sambar Deer - The largest deer species in India
• Chital (Spotted Deer) - Most commonly seen herbivore
• Nilgai - The largest Asian antelope
• Wild Boar - Common throughout the park
• Indian Fox and Desert Fox
• Marsh Crocodiles in the lakes
• Over 300 species of birds including eagles, vultures, and waterfowl`,
        conservation: `Ranthambore has been at the forefront of tiger conservation in India. The park is part of Project Tiger, a wildlife conservation movement in India. Conservation efforts include:

• Anti-poaching measures with dedicated tiger protection force
• Habitat restoration and maintenance
• Community involvement programs
• Scientific research and monitoring of tiger population
• Eco-tourism initiatives to generate awareness and funds`
    },
    'birds': {
        name: 'Avian Sanctuary',
        location: 'Multiple Locations, India',
        followers: '330',
        posts: '145',
        backgroundImage: AnimalBirdsImage,
        description: 'A network of bird sanctuaries across India dedicated to the protection and conservation of avian species.',
        biodiversity: 'Home to hundreds of bird species including migratory birds.',
        conservation: 'Focused on habitat preservation and anti-poaching measures.'
    },
    'mammals': {
        name: 'Mammal Reserve',
        location: 'Central India',
        followers: '20K',
        posts: '892',
        backgroundImage: AnimalMammalImage,
        description: 'A premier wildlife reserve focusing on large mammal conservation.',
        biodiversity: 'Tigers, leopards, elephants, and various deer species.',
        conservation: 'Active conservation programs and research initiatives.'
    }
};

// Mock discussions data
const discussionsData = [
    {
        id: 1,
        userName: 'Rajesh Kumar',
        userInitials: 'RK',
        userRole: 'Wildlife Photographer',
        postTime: '2 hours ago',
        content: 'Incredible tiger sighting this morning! T-84 (Arrowhead) was spotted near Malik Talao with her two cubs. The morning light was perfect for photography.',
        image: AnimalMammalImage,
        tags: ['#Tiger', '#Wildlife', '#Photography'],
        views: 342,
        comments: 28
    },
    {
        id: 2,
        userName: 'Dr. Meera Patel',
        userInitials: 'DMP',
        userRole: 'Conservation Biologist',
        verified: true,
        postTime: '5 hours ago',
        content: 'Park management has successfully reduced human-wildlife conflict by 35% this year through community engagement programs. Here\'s how the corridor project is working...',
        tags: ['#Conservation', '#Research', '#Community'],
        views: 567,
        comments: 42
    }
];

// Unsplash wildlife images for media section (higher resolution for gallery view)
const mediaImages = [
    'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1920&h=1080&fit=crop', // Tiger
    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&h=1080&fit=crop', // Leopard
    'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=1920&h=1080&fit=crop', // Elephant
    'https://plus.unsplash.com/premium_photo-1669725687150-15c603ac6a73?w=1920&h=1080&fit=crop', // Deer
    'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1920&h=1080&fit=crop', // Birds
    'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=1920&h=1080&fit=crop', // Wildlife
    'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=1920&h=1080&fit=crop', // Nature
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop', // Forest
];
    const tabs = [
        { id: 'discussions', label: 'Discussions', icon: discussionnIcon },
        { id: 'media', label: 'Media', icon: mediaIcon },
        { id: 'videos', label: 'Videos', icon: videosIcon },
        { id: 'about', label: 'About', icon: aboutIcon },
    ];
// Unsplash wildlife videos/nature for videos section (higher resolution for gallery view)
const videoThumbnails = [
    'https://images.unsplash.com/photo-1543946207-39bd91e70ca7?w=1920&h=1080&fit=crop', // Wildlife video
    'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=1920&h=1080&fit=crop', // Nature video
    'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1920&h=1080&fit=crop', // River video
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop', // Jungle video
    'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=1920&h=1080&fit=crop', // Animal video
    'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=1920&h=1080&fit=crop', // Wildlife doc
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop', // Mountain video
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop', // Forest video
];

function NationalParkPage() {
    const { parkId } = useParams(); // This is actually the slug from the URL
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('discussions');
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentGalleryType, setCurrentGalleryType] = useState('media'); // 'media' or 'videos'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [park, setPark] = useState(null);
    const [loading, setLoading] = useState(true);
    const [discussions, setDiscussions] = useState([]);
    const [discussionsLoading, setDiscussionsLoading] = useState(true);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('media'); // 'media' or 'videos'

    // All handler functions defined before conditional returns
    const handleBack = () => {
        navigate('/community');
    };

    const handleDiscussionClick = (discussionId, discussionSlug) => {
        navigate(`/community/discussions/${discussionSlug || discussionId}`);
    };

    const handleStartDiscussion = () => {
        setIsModalOpen(true);
    };

    const handleUploadClick = (type) => {
        setUploadType(type);
        setUploadModalOpen(true);
    };

    const openGallery = (index, type) => {
        setCurrentImageIndex(index);
        setCurrentGalleryType(type);
        setGalleryOpen(true);
    };

    const closeGallery = () => {
        setGalleryOpen(false);
    };

    const goToNextImage = () => {
        const maxIndex = currentGalleryType === 'media' 
            ? ((park.media_urls && park.media_urls.length > 0 ? park.media_urls.length : mediaImages.length) - 1)
            : ((park.video_urls && park.video_urls.length > 0 ? park.video_urls.length : videoThumbnails.length) - 1);
        if (currentImageIndex < maxIndex) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const goToPreviousImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleKeyDown = (e) => {
        if (!galleryOpen) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') goToNextImage();
        if (e.key === 'ArrowLeft') goToPreviousImage();
    };

    // Fetch park data from API using slug
    React.useEffect(() => {
        const fetchPark = async () => {
            try {
                // Get all parks and find by slug (since API doesn't have a slug endpoint)
                const response = await fetch(`${API_BASE_URL}/national-parks?is_active=true`);
                if (response.ok) {
                    const parks = await response.json();
                    const foundPark = parks.find(p => p.slug === parkId);
                    
                    if (foundPark) {
                        // Transform API data to match the expected format
                        setPark({
                            name: foundPark.name,
                            location: foundPark.state || 'India',
                            posts: '0', // Will be updated after fetching discussions
                            backgroundImage: AnimalMammalImage, // Use default for now
                            description: foundPark.description || 'Explore this beautiful national park',
                            biodiversity: foundPark.biodiversity || 'Information about wildlife and biodiversity coming soon.',
                            conservation: foundPark.conservation || 'Conservation efforts information coming soon.',
                            media_urls: foundPark.media_urls || [],
                            video_urls: foundPark.video_urls || [],
                            banner_media_url: foundPark.banner_media_url,
                            banner_media_type: foundPark.banner_media_type,
                            expedition_slugs: foundPark.expedition_slugs || []
                        });
                    } else {
                        // Fallback to hardcoded data if park not found
                        setPark(parkData[parkId] || parkData['ranthambore']);
                    }
                } else {
                    // Fallback to hardcoded data on error
                    setPark(parkData[parkId] || parkData['ranthambore']);
                }
            } catch (error) {
                console.error('Error fetching park:', error);
                // Fallback to hardcoded data
                setPark(parkData[parkId] || parkData['ranthambore']);
            } finally {
                setLoading(false);
            }
        };

        fetchPark();
    }, [parkId]);

    // Fetch discussions for this park
    React.useEffect(() => {
        const fetchDiscussions = async () => {
            if (!park || !park.name) return;
            
            try {
                setDiscussionsLoading(true);
                // Fetch discussions filtered by type=national_park and park name
                const response = await fetch(
                    `${API_BASE_URL}/discussions?type=national_park&park_name=${encodeURIComponent(park.name)}&status=approved&sort_by=recent&page_size=50`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    const fetchedDiscussions = data.items || [];
                    setDiscussions(fetchedDiscussions);
                    
                    // Update park posts count with actual discussion count
                    setPark(prevPark => ({
                        ...prevPark,
                        posts: fetchedDiscussions.length.toString()
                    }));
                } else {
                    console.error('Failed to fetch discussions');
                    setDiscussions([]);
                }
            } catch (error) {
                console.error('Error fetching discussions:', error);
                setDiscussions([]);
            } finally {
                setDiscussionsLoading(false);
            }
        };

        fetchDiscussions();
    }, [park?.name]); // Only depend on park.name to avoid infinite loop

    // Keyboard navigation for gallery
    React.useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [galleryOpen, currentImageIndex]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                color: 'rgba(255, 232, 161, 1)',
                fontFamily: 'DM Sans',
                fontSize: '18px'
            }}>
                Loading park details...
            </div>
        );
    }

    if (!park) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                color: 'rgba(255, 232, 161, 1)',
                fontFamily: 'DM Sans',
                fontSize: '18px',
                gap: '20px'
            }}>
                <div>Park not found</div>
                <button onClick={() => navigate('/community')}>
                    Back to Community
                </button>
            </div>
        );
    }

    const tabs = [
        { id: 'discussions', label: 'Discussions', icon: discussionnIcon },
        { id: 'media', label: 'Media', icon: mediaIcon },
        { id: 'videos', label: 'Videos', icon: videosIcon },
        { id: 'about', label: 'About', icon: aboutIcon },
    ];

    return (
        <div className={styles.pageContainer}>
            {/* <Header /> */}
            
            <div 
                className={styles.heroSection}
                style={(park?.banner_media_type !== 'video') ? {
                    backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%), url(${park?.banner_media_url || park?.backgroundImage || AnimalMammalImage})`
                } : {}}
            >
                {park?.banner_media_type === 'video' && park?.banner_media_url && (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 0
                        }}
                    >
                        <source src={park.banner_media_url} type="video/mp4" />
                        <source src={park.banner_media_url} type="video/webm" />
                    </video>
                )}
                {park?.banner_media_type === 'video' && park?.banner_media_url && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%)',
                        zIndex: 1
                    }}></div>
                )}
                <div className={styles.heroContent} style={{ position: 'relative', zIndex: 2 }}>
                    <div className={styles.heroFlexContainer}>
                        <div className={styles.parkInfo}>
                            <h1 className={styles.parkTitle}>{park.name}</h1>
                            <div className={styles.parkMeta}>
                                <div className={styles.metaItem}>
                                    <img className={styles.metaIcon} src={locationIcon} alt="Location" />
                                    {park.location}
                                </div>
                                <div className={styles.metaItem}>
                                    <img className={styles.metaIcon} src={postsIcon} alt="Discussions" />
                                    {park.posts} {parseInt(park.posts) === 1 ? 'discussion' : 'discussions'}
                                </div>
                            </div>
                            <p className={styles.parkDescription}>{park.description}</p>
                        </div>
                        {park.expedition_slugs && park.expedition_slugs.length > 0 && (
                            <div className={styles.expeditionSliderContainer}>
                                <ExpeditionSlider expeditionSlugs={park.expedition_slugs} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.tabsSection}>
                <div className={styles.tabsWrapper}>
                    <div className={styles.tabsContainer}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <img 
                                    className={styles.tabIcon}
                                    src={tab.icon} 
                                    alt={tab.label}
                                    style={{
                                        filter: activeTab === tab.id 
                                            ? 'brightness(0) saturate(100%) invert(91%) sepia(21%) saturate(1067%) hue-rotate(317deg) brightness(105%) contrast(102%)'
                                            : 'brightness(0) saturate(100%) invert(91%) sepia(21%) saturate(1067%) hue-rotate(317deg) brightness(105%) contrast(102%) opacity(0.6)'
                                    }}
                                />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    
                    {activeTab === 'discussions' && (
                        <button className={styles.startDiscussionButton} onClick={handleStartDiscussion}>
                            <img className={styles.buttonIcon} src={discussionIcon} alt="Discussion" />
                            Start a Discussion
                        </button>
                    )}
                    
                    {(activeTab === 'media' || activeTab === 'videos') && (
                        <button className={styles.uploadButton} onClick={() => handleUploadClick(activeTab)}>
                            <img className={styles.buttonIcon} src={uploadIcon} alt="Upload" />
                            Upload
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.contentSection}>
                {activeTab === 'discussions' && (
                    <div className={styles.discussionsContainer}>
                        {discussionsLoading ? (
                            <div style={{ 
                                textAlign: 'center', 
                                color: 'rgba(255, 232, 161, 1)', 
                                fontFamily: 'DM Sans',
                                padding: '40px',
                                width: '100%'
                            }}>
                                Loading discussions...
                            </div>
                        ) : discussions.length === 0 ? (
                            <div style={{ 
                                textAlign: 'center', 
                                color: 'rgba(255, 232, 161, 1)', 
                                fontFamily: 'DM Sans',
                                padding: '40px',
                                width: '100%'
                            }}>
                                No discussions yet for this park. Be the first to start one!
                            </div>
                        ) : (
                            (() => {
                                // Generate random positions for expedition ads
                                const adPositions = park.expedition_slugs?.map((_, slugIndex) => {
                                    return Math.floor(Math.random() * (discussions.length + park.expedition_slugs.length));
                                }).sort((a, b) => a - b) || [];
                                
                                const items = [];
                                let adIndexUsed = 0;
                                
                                discussions.forEach((post, index) => {
                                    // Add any ads that should appear before this discussion
                                    while (adIndexUsed < adPositions.length && adPositions[adIndexUsed] === items.length) {
                                        items.push({
                                            type: 'ad',
                                            slug: park.expedition_slugs[adIndexUsed],
                                            key: `ad-${adIndexUsed}`
                                        });
                                        adIndexUsed++;
                                    }
                                    
                                    // Add the discussion
                                    items.push({
                                        type: 'discussion',
                                        post: post,
                                        key: post.id
                                    });
                                });
                                
                                // Add remaining ads at the end
                                while (adIndexUsed < adPositions.length) {
                                    items.push({
                                        type: 'ad',
                                        slug: park.expedition_slugs[adIndexUsed],
                                        key: `ad-${adIndexUsed}`
                                    });
                                    adIndexUsed++;
                                }
                                
                                return items.map((item) => (
                                    item.type === 'ad' ? (
                                        <ExpeditionPackageCard 
                                            key={item.key}
                                            expeditionSlug={item.slug}
                                        />
                                    ) : (
                                        <div key={item.key} className={styles.postCard} onClick={() => handleDiscussionClick(item.post.id, item.post.slug)} style={{ cursor: 'pointer' }}>
                                        <div className={styles.postHeader}>
                                        <div className={styles.userAvatar}>
                                            {item.post.author?.avatar_url ? (
                                                <img src={item.post.author.avatar_url} alt={item.post.author.username} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                            ) : (
                                                item.post.author?.username?.substring(0, 2).toUpperCase() || 'AN'
                                            )}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <div className={styles.userName}>
                                                {item.post.author?.full_name || item.post.author?.username || 'Anonymous'}
                                                {item.post.author?.is_verified && (
                                                    <span style={{ color: 'rgba(255, 232, 161, 1)', marginLeft: '5px' }}>●</span>
                                                )}
                                                {item.post.author?.professional_title && (
                                                    <span className={styles.userRole}>• {item.post.author.professional_title}</span>
                                                )}
                                            </div>
                                            <div className={styles.postTime}>
                                                {new Date(item.post.created_at).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className={styles.postContent}>{item.post.excerpt || item.post.content?.substring(0, 200) || ''}</p>
                                    
                                    {item.post.banner_image && <img className={styles.postImage} src={item.post.banner_image} alt="Post" />}
                                    
                                    {item.post.tags && item.post.tags.length > 0 && (
                                        <div className={styles.postTags}>
                                            {item.post.tags.map((tag, index) => (
                                                <span key={index} className={styles.tag}>#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className={styles.postFooter}>
                                        <div className={styles.postStat}>
                                            <img className={styles.statIcon} src={eyeIcon} alt="Views" />
                                            {item.post.view_count || 0}
                                        </div>
                                        <div className={styles.postStat}>
                                            <img className={styles.statIcon} src={commentsIcon} alt="Comments" />
                                            {item.post.comment_count || 0}
                                        </div>
                                    </div>
                                </div>
                                    )
                                ));
                            })()
                        )}
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className={styles.mediaGrid}>
                        {park.media_urls && park.media_urls.length > 0 ? (
                            park.media_urls.map((imageUrl, index) => (
                                <div key={index} className={styles.mediaItem} onClick={() => openGallery(index, 'media')}>
                                    <img className={styles.mediaImage} src={imageUrl} alt={`Wildlife ${index + 1}`} loading="lazy" />
                                </div>
                            ))
                        ) : (
                            mediaImages.map((imageUrl, index) => (
                                <div key={index} className={styles.mediaItem} onClick={() => openGallery(index, 'media')}>
                                    <img className={styles.mediaImage} src={imageUrl} alt={`Wildlife ${index + 1}`} loading="lazy" />
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div className={styles.mediaGrid}>
                        {park.video_urls && park.video_urls.length > 0 ? (
                            park.video_urls.map((videoUrl, index) => (
                                <div key={index} className={styles.mediaItem} onClick={() => openGallery(index, 'videos')}>
                                    <video 
                                        className={styles.mediaImage} 
                                        preload="metadata"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <source src={videoUrl} type="video/mp4" />
                                        <source src={videoUrl} type="video/webm" />
                                        <source src={videoUrl} type="video/mov" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '50%', 
                                        left: '50%', 
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '48px',
                                        color: 'white',
                                        textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                                        pointerEvents: 'none'
                                    }}>▶</div>
                                </div>
                            ))
                        ) : (
                            videoThumbnails.map((thumbnailUrl, index) => (
                                <div key={index} className={styles.mediaItem} onClick={() => openGallery(index, 'videos')}>
                                    <img className={styles.mediaImage} src={thumbnailUrl} alt={`Video ${index + 1}`} loading="lazy" />
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className={styles.aboutContent}>
                        <p>{park.description}</p>
                        <h2>Biodiversity</h2>
                        <p style={{ whiteSpace: 'pre-line' }}>{park.biodiversity}</p>
                        <h2>Conservation Efforts</h2>
                        <p style={{ whiteSpace: 'pre-line' }}>{park.conservation}</p>
                    </div>
                )}
            </div>

            {/* Gallery Modal */}
            {galleryOpen && (
                <div className={styles.galleryModal} onClick={closeGallery}>
                    <button className={styles.closeButton} onClick={closeGallery}>×</button>
                    
                    <button 
                        className={`${styles.navigationArrow} ${styles.leftArrow}`}
                        onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }}
                        disabled={currentImageIndex === 0}
                    >
                        ‹
                    </button>
                    
                    <div className={styles.galleryContent} onClick={(e) => e.stopPropagation()}>
                        {currentGalleryType === 'media' ? (
                            <img
                                className={styles.galleryImage}
                                src={park.media_urls && park.media_urls.length > 0 ? park.media_urls[currentImageIndex] : mediaImages[currentImageIndex]}
                                alt={`Wildlife ${currentImageIndex + 1}`}
                            />
                        ) : (
                            <video
                                key={currentImageIndex}
                                className={styles.galleryImage}
                                controls
                                autoPlay
                                style={{ maxHeight: '80vh', maxWidth: '90vw' }}
                            >
                                <source 
                                    src={park.video_urls && park.video_urls.length > 0 ? park.video_urls[currentImageIndex] : videoThumbnails[currentImageIndex]} 
                                    type="video/mp4" 
                                />
                                <source 
                                    src={park.video_urls && park.video_urls.length > 0 ? park.video_urls[currentImageIndex] : videoThumbnails[currentImageIndex]} 
                                    type="video/webm" 
                                />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                    
                    <button 
                        className={`${styles.navigationArrow} ${styles.rightArrow}`}
                        onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
                        disabled={currentImageIndex === (currentGalleryType === 'media' 
                            ? ((park.media_urls && park.media_urls.length > 0 ? park.media_urls.length : mediaImages.length) - 1)
                            : ((park.video_urls && park.video_urls.length > 0 ? park.video_urls.length : videoThumbnails.length) - 1)
                        )}
                    >
                        ›
                    </button>
                    
                    <div className={styles.galleryControls}>
                        <button 
                            className={styles.galleryButton}
                            onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }}
                            disabled={currentImageIndex === 0}
                        >
                            ←
                        </button>
                        
                        <div className={styles.imageCounter}>
                            {currentImageIndex + 1} / {currentGalleryType === 'media' 
                                ? (park.media_urls && park.media_urls.length > 0 ? park.media_urls.length : mediaImages.length)
                                : (park.video_urls && park.video_urls.length > 0 ? park.video_urls.length : videoThumbnails.length)
                            }
                        </div>
                        
                        <button 
                            className={styles.galleryButton}
                            onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
                            disabled={currentImageIndex === (currentGalleryType === 'media' 
                                ? ((park.media_urls && park.media_urls.length > 0 ? park.media_urls.length : mediaImages.length) - 1)
                                : ((park.video_urls && park.video_urls.length > 0 ? park.video_urls.length : videoThumbnails.length) - 1)
                            )}
                        >
                            →
                        </button>
                    </div>
                </div>
            )}

            {/* Create Post Modal */}
            <CreatePostModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                fixedParkName={park.name}
            />

            {/* Media Upload Modal */}
            <MediaUploadModal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                uploadType={uploadType}
                parkId={parkId}
                parkName={park.name}
            />
        </div>
    );
}

export default NationalParkPage;

