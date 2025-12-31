// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { styled } from '@mui/system';
// import discussionService from '../../services/discussionService';
// // Import icons
// import backArrow from '../../assets/icons/backIcon.svg';
// import searchIcon from '../../assets/icons/searchIcon.svg';
// import discussionIcon from '../../assets/icons/discussionIcon.svg';
// import eyeIcon from '../../assets/icons/eyeIcon.svg';
// import commentsIcon from '../../assets/icons/commentsIcon.svg';

// const ViewAllDiscussionsContainer = styled("div")({
//     backgroundColor: `rgba(30, 45, 39, 1)`,
//     display: `flex`,
//     position: `relative`,
//     flexDirection: `column`,
//     width: `100%`,
//     minHeight: `100vh`,
//     justifyContent: `flex-start`,
//     alignItems: `flex-start`,
//     padding: `0px`,
//     margin: `0px`,
//     boxSizing: `border-box`,
// });

// // Page Header Section
// const PageHeader = styled("div")({
//     backgroundColor: `rgba(30, 45, 39, 1)`,
//     padding: `20px 40px`,
//     borderBottom: `1px solid rgba(68, 122, 101, 0.2)`,
//     width: `100%`,
//     '@media (max-width: 768px)': {
//         padding: `15px 20px`,
//     },
//     '@media (max-width: 480px)': {
//         padding: `10px 15px`,
//     },
// });

// const HeaderContent = styled("div")({
//     display: `flex`,
//     justifyContent: `space-between`,
//     alignItems: `center`,
//     maxWidth: `1200px`,
//     margin: `0 auto`,
//     width: `100%`,
//     '@media (max-width: 768px)': {
//         flexDirection: `column`,
//         gap: `15px`,
//         alignItems: `flex-start`,
//     },
// });

// const BackSection = styled("div")({
//     display: `flex`,
//     alignItems: `center`,
//     gap: `10px`,
//     cursor: `pointer`,
//     color: `rgba(255, 232, 161, 1)`,
//     transition: `all 0.3s ease`,
//     '&:hover': {
//         color: `rgba(255, 232, 161, 0.8)`,
//     },
// });

// const BackArrow = styled("img")({
//     width: `18px`,
//     height: `16px`,
//     filter: `brightness(0) saturate(100%) invert(91%) sepia(31%) saturate(457%) hue-rotate(342deg) brightness(103%) contrast(103%)`,
// });

// const BackText = styled("div")({
//     fontFamily: `DM Sans`,
//     fontWeight: `500`,
//     fontSize: `16px`,
//     '@media (max-width: 480px)': {
//         fontSize: `14px`,
//     },
// });

// const ActionButtons = styled("div")({
//     display: `flex`,
//     alignItems: `center`,
//     gap: `12px`,
//     '@media (max-width: 768px)': {
//         alignSelf: `flex-end`,
//     },
//     '@media (max-width: 480px)': {
//         gap: `8px`,
//     },
// });

// const CreateDiscussionButton = styled("button")({
//     display: `flex`,
//     alignItems: `center`,
//     gap: `8px`,
//     backgroundColor: `rgba(68, 122, 101, 1)`,
//     color: `rgba(255, 232, 161, 1)`,
//     border: `none`,
//     borderRadius: `8px`,
//     padding: `10px 20px`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontSize: `14px`,
//     fontWeight: 600,
//     cursor: `pointer`,
//     transition: `all 0.3s ease`,
//     '&:hover': {
//         backgroundColor: `rgba(68, 122, 101, 0.8)`,
//         transform: `translateY(-1px)`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `13px`,
//         padding: `8px 16px`,
//     },
// });

// const ButtonIcon = styled("img")({
//     width: `16px`,
//     height: `16px`,
//     objectFit: `contain`,
// });

// // Page Title Section
// const PageTitleSection = styled("div")({
//     backgroundColor: `rgba(30, 45, 39, 1)`,
//     padding: `40px 40px 20px 40px`,
//     width: `100%`,
//     '@media (max-width: 768px)': {
//         padding: `30px 20px 15px 20px`,
//     },
//     '@media (max-width: 480px)': {
//         padding: `25px 15px 10px 15px`,
//     },
// });

// const TitleContent = styled("div")({
//     maxWidth: `1200px`,
//     margin: `0 auto`,
//     width: `100%`,
// });

// const MainTitle = styled("h1")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `700`,
//     fontSize: `48px`,
//     margin: `0 0 12px 0`,
//     lineHeight: `1.2`,
//     '@media (max-width: 768px)': {
//         fontSize: `36px`,
//         textAlign: `center`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `28px`,
//     },
// });

// const Subtitle = styled("p")({
//     color: `rgba(205, 217, 157, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `400`,
//     fontSize: `18px`,
//     margin: `0`,
//     lineHeight: `1.5`,
//     '@media (max-width: 768px)': {
//         fontSize: `16px`,
//         textAlign: `center`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `14px`,
//     },
// });

// // Search Section
// const SearchSection = styled("div")({
//     backgroundColor: `rgba(30, 45, 39, 1)`,
//     padding: `30px 40px`,
//     display: `flex`,
//     justifyContent: `center`,
//     alignItems: `center`,
//     width: `100%`,
//     '@media (max-width: 768px)': {
//         padding: `25px 20px`,
//     },
//     '@media (max-width: 480px)': {
//         padding: `20px 15px`,
//     },
// });

// const SearchContainer = styled("div")({
//     position: `relative`,
//     width: `100%`,
//     maxWidth: `1200px`,
//     display: `flex`,
//     alignItems: `center`,
// });

// const SearchInput = styled("input")({
//     width: `100%`,
//     height: `48px`,
//     backgroundColor: `rgba(68, 122, 101, 0.1)`,
//     border: `1px solid rgba(68, 122, 101, 0.3)`,
//     borderRadius: `30px`,
//     padding: `0 50px 0 20px`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontSize: `16px`,
//     color: `rgba(255, 232, 161, 1)`,
//     outline: `none`,
//     transition: `all 0.3s ease`,
//     '&::placeholder': {
//         color: `rgba(255, 232, 161, 0.5)`,
//         fontSize: `16px`,
//     },
//     '&:focus': {
//         borderColor: `rgba(68, 122, 101, 0.6)`,
//         backgroundColor: `rgba(68, 122, 101, 0.15)`,
//         boxShadow: `0 0 0 3px rgba(68, 122, 101, 0.1)`,
//     },
//     '@media (max-width: 480px)': {
//         height: `44px`,
//         fontSize: `14px`,
//         padding: `0 45px 0 15px`,
//         '&::placeholder': {
//             fontSize: `14px`,
//         },
//     },
// });

// const SearchIconContainer = styled("div")({
//     position: `absolute`,
//     right: `15px`,
//     display: `flex`,
//     alignItems: `center`,
//     justifyContent: `center`,
//     width: `20px`,
//     height: `20px`,
//     cursor: `pointer`,
//     transition: `opacity 0.3s ease`,
//     '&:hover': {
//         opacity: 0.8,
//     },
//     '@media (max-width: 480px)': {
//         right: `12px`,
//         width: `18px`,
//         height: `18px`,
//     },
// });

// const SearchIcon = styled("img")({
//     width: `100%`,
//     height: `100%`,
//     objectFit: `contain`,
// });

// // Category Filter Section
// const CategoryFilterSection = styled("div")({
//     backgroundColor: `rgba(30, 45, 39, 1)`,
//     padding: `20px 40px 30px 40px`,
//     display: `flex`,
//     justifyContent: `center`,
//     alignItems: `center`,
//     width: `100%`,
//     '@media (max-width: 768px)': {
//         padding: `15px 20px 25px 20px`,
//     },
//     '@media (max-width: 480px)': {
//         padding: `10px 15px 20px 15px`,
//     },
// });

// const CategoryFilterContainer = styled("div")({
//     display: `flex`,
//     flexWrap: `wrap`,
//     gap: `12px`,
//     width: `100%`,
//     maxWidth: `1200px`,
//     justifyContent: `flex-start`,
//     alignItems: `center`,
//     '@media (max-width: 768px)': {
//         gap: `10px`,
//     },
//     '@media (max-width: 480px)': {
//         gap: `8px`,
//         justifyContent: `center`,
//     },
// });

// const CategoryButton = styled("button")(({ isActive }) => ({
//     display: `flex`,
//     alignItems: `center`,
//     justifyContent: `center`,
//     gap: `8px`,
//     padding: `10px 16px`,
//     backgroundColor: isActive ? `rgba(255, 232, 161, 1)` : `rgba(68, 122, 101, 0.1)`,
//     color: isActive ? `rgba(30, 45, 39, 1)` : `rgba(255, 232, 161, 1)`,
//     border: `1px solid ${isActive ? 'rgba(255, 232, 161, 1)' : 'rgba(68, 122, 101, 0.3)'}`,
//     borderRadius: `24px`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontSize: `14px`,
//     fontWeight: isActive ? 600 : 500,
//     cursor: `pointer`,
//     transition: `all 0.3s ease`,
//     outline: `none`,
//     whiteSpace: `nowrap`,
//     '&:hover': {
//         backgroundColor: isActive ? `rgba(255, 232, 161, 0.9)` : `rgba(68, 122, 101, 0.2)`,
//         borderColor: isActive ? `rgba(255, 232, 161, 0.9)` : `rgba(68, 122, 101, 0.5)`,
//         transform: `translateY(-1px)`,
//     },
//     '&:active': {
//         transform: `translateY(0)`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `12px`,
//         padding: `8px 12px`,
//         gap: `6px`,
//     },
// }));

// const CategoryCount = styled("span")({
//     backgroundColor: `rgba(0, 0, 0, 0.1)`,
//     borderRadius: `12px`,
//     padding: `2px 6px`,
//     fontSize: `12px`,
//     fontWeight: 600,
//     '@media (max-width: 480px)': {
//         fontSize: `10px`,
//         padding: `1px 4px`,
//     },
// });

// // Discussion Cards Section
// const DiscussionCardsSection = styled("div")({
//     backgroundColor: `rgba(30, 45, 39, 1)`,
//     padding: `0 40px 40px 40px`,
//     display: `flex`,
//     justifyContent: `center`,
//     alignItems: `flex-start`,
//     width: `100%`,
//     '@media (max-width: 768px)': {
//         padding: `0 20px 30px 20px`,
//     },
//     '@media (max-width: 480px)': {
//         padding: `0 15px 25px 15px`,
//     },
// });

// const DiscussionCardsContainer = styled("div")({
//     width: `100%`,
//     maxWidth: `1200px`,
//     display: `flex`,
//     flexDirection: `column`,
//     gap: `20px`,
// });

// const DiscussionCardsHeader = styled("div")({
//     display: `flex`,
//     justifyContent: `space-between`,
//     alignItems: `center`,
//     marginBottom: `20px`,
//     '@media (max-width: 480px)': {
//         flexDirection: `column`,
//         alignItems: `flex-start`,
//         gap: `10px`,
//     },
// });

// const DiscussionCountText = styled("div")({
//     color: `rgba(205, 217, 157, 1)`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontSize: `16px`,
//     fontWeight: 400,
//     '@media (max-width: 480px)': {
//         fontSize: `14px`,
//     },
// });

// const DiscussionCardsList = styled("div")({
//     display: `flex`,
//     flexDirection: `column`,
//     gap: `16px`,
//     width: `100%`,
// });

// const DiscussionCard = styled("div")({
//     backgroundColor: `rgba(19, 38, 32, 1)`,
//     borderRadius: `12px`,
//     padding: `20px`,
//     cursor: `pointer`,
//     transition: `all 0.3s ease`,
//     border: `1px solid rgba(68, 122, 101, 0.2)`,
//     display: `flex`,
//     flexDirection: `column`,
//     gap: `12px`,
//     height: `280px`, // Fixed height for all cards
//     '&:hover': {
//         transform: `translateY(-2px)`,
//         boxShadow: `0 8px 25px rgba(0, 0, 0, 0.2)`,
//         borderColor: `rgba(68, 122, 101, 0.4)`,
//     },
//     '@media (max-width: 768px)': {
//         padding: `16px`,
//         height: `270px`,
//     },
// });

// const DiscussionHeader = styled("div")({
//     display: `flex`,
//     alignItems: `center`,
//     gap: `12px`,
//     marginBottom: `4px`,
// });

// const Avatar = styled("div")({
//     width: `40px`,
//     height: `40px`,
//     borderRadius: `50%`,
//     backgroundColor: `rgba(68, 122, 101, 1)`,
//     display: `flex`,
//     alignItems: `center`,
//     justifyContent: `center`,
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontWeight: 600,
//     fontSize: `16px`,
//     flexShrink: 0,
// });

// const AuthorInfo = styled("div")({
//     flex: 1,
//     display: `flex`,
//     flexDirection: `column`,
//     gap: `4px`,
// });

// const AuthorRow = styled("div")({
//     display: `flex`,
//     alignItems: `center`,
//     gap: `8px`,
//     flexWrap: `wrap`,
// });

// const AuthorName = styled("div")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontWeight: 600,
//     fontSize: `14px`,
// });

// const AuthorBadge = styled("span")({
//     backgroundColor: `rgba(68, 122, 101, 0.3)`,
//     color: `rgba(205, 217, 157, 1)`,
//     padding: `2px 8px`,
//     borderRadius: `6px`,
//     fontSize: `11px`,
//     fontWeight: 500,
// });

// const DiscussionTime = styled("div")({
//     color: `rgba(205, 217, 157, 0.6)`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontWeight: 400,
//     fontSize: `12px`,
// });

// const DiscussionTitle = styled("h3")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontWeight: 600,
//     fontSize: `18px`,
//     margin: 0,
//     lineHeight: 1.4,
//     overflow: `hidden`,
//     display: `-webkit-box`,
//     WebkitLineClamp: 2, // Limit to 2 lines
//     WebkitBoxOrient: `vertical`,
//     textOverflow: `ellipsis`,
//     '@media (max-width: 480px)': {
//         fontSize: `16px`,
//     },
// });

// const DiscussionDescription = styled("p")({
//     color: `rgba(205, 217, 157, 1)`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontWeight: 400,
//     fontSize: `14px`,
//     margin: 0,
//     lineHeight: 1.6,
//     overflow: `hidden`,
//     display: `-webkit-box`,
//     WebkitLineClamp: 2, // Limit to 2 lines
//     WebkitBoxOrient: `vertical`,
//     textOverflow: `ellipsis`,
//     flex: 1, // Take available space
//     '@media (max-width: 480px)': {
//         fontSize: `13px`,
//         WebkitLineClamp: 2,
//     },
// });

// const DiscussionFooter = styled("div")({
//     display: `flex`,
//     justifyContent: `space-between`,
//     alignItems: `center`,
//     paddingTop: `8px`,
//     borderTop: `1px solid rgba(68, 122, 101, 0.15)`,
// });

// const DiscussionStats = styled("div")({
//     display: `flex`,
//     alignItems: `center`,
//     gap: `16px`,
// });

// const StatItem = styled("div")({
//     display: `flex`,
//     alignItems: `center`,
//     gap: `6px`,
//     color: `rgba(205, 217, 157, 1)`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontSize: `13px`,
//     fontWeight: 500,
//     '@media (max-width: 480px)': {
//         fontSize: `12px`,
//         gap: `4px`,
//     },
// });

// const StatIconImg = styled("img")({
//     width: `16px`,
//     height: `16px`,
//     objectFit: `contain`,
//     opacity: 0.8,
//     '@media (max-width: 480px)': {
//         width: `14px`,
//         height: `14px`,
//     },
// });

// const DiscussionTags = styled("div")({
//     display: `flex`,
//     flexWrap: `wrap`,
//     gap: `8px`,
// });

// const DiscussionTag = styled("span")({
//     backgroundColor: `rgba(68, 122, 101, 0.2)`,
//     color: `rgba(255, 232, 161, 1)`,
//     padding: `4px 12px`,
//     borderRadius: `12px`,
//     fontSize: `12px`,
//     fontFamily: `'DM Sans', sans-serif`,
//     fontWeight: 500,
//     '@media (max-width: 480px)': {
//         fontSize: `11px`,
//         padding: `3px 10px`,
//     },
// });

// function ViewAllDiscussionsPage() {
//     const navigate = useNavigate();
    
//     // State management
//     const [activeCategory, setActiveCategory] = useState('all');
//     const [discussions, setDiscussions] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [totalDiscussions, setTotalDiscussions] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
    
//     // Helper function to format time ago
//     const formatTimeAgo = (dateString) => {
//         const date = new Date(dateString);
//         const now = new Date();
//         const seconds = Math.floor((now - date) / 1000);

//         if (seconds < 60) return 'just now';
        
//         const minutes = Math.floor(seconds / 60);
//         if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        
//         const hours = Math.floor(minutes / 60);
//         if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        
//         const days = Math.floor(hours / 24);
//         if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        
//         const months = Math.floor(days / 30);
//         if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        
//         const years = Math.floor(months / 12);
//         return `${years} ${years === 1 ? 'year' : 'years'} ago`;
//     };

//     // Helper function to get badge text
//     const getBadgeText = (author) => {
//         if (!author) return 'Member';
//         if (author.badges && author.badges.length > 0) {
//             return author.badges[0];
//         }
//         return 'Member';
//     };

//     // Fetch categories
//     useEffect(() => {
//         const loadCategories = async () => {
//             try {
//                 const data = await discussionService.getCategories();
//                 const categoriesWithCount = [
//                     { id: 'all', label: 'All Discussions', count: 0 }
//                 ];
                
//                 data.forEach(cat => {
//                     categoriesWithCount.push({
//                         id: cat.id,
//                         label: cat.name,
//                         count: 0 // Will be updated when we fetch discussions
//                     });
//                 });
                
//                 setCategories(categoriesWithCount);
                
//                 // Fetch total count for "All Discussions" immediately
//                 try {
//                     const allDiscussionsData = await discussionService.getDiscussions({
//                         status: 'approved',
//                         page: 1,
//                         page_size: 1 // We only need the total count, not the items
//                     });
//                     categoriesWithCount[0].count = allDiscussionsData.total || 0;
                    
//                     // Fetch count for each individual category
//                     const categoryCountPromises = data.map(async (cat, index) => {
//                         try {
//                             const categoryData = await discussionService.getDiscussions({
//                                 status: 'approved',
//                                 category_id: cat.id,
//                                 page: 1,
//                                 page_size: 1
//                             });
//                             categoriesWithCount[index + 1].count = categoryData.total || 0;
//                         } catch (error) {
//                             console.error(`Failed to load count for category ${cat.name}:`, error);
//                             categoriesWithCount[index + 1].count = 0;
//                         }
//                     });
                    
//                     // Wait for all category counts to be fetched
//                     await Promise.all(categoryCountPromises);
//                     setCategories([...categoriesWithCount]);
//                 } catch (error) {
//                     console.error('Failed to load total discussions count:', error);
//                 }
//             } catch (error) {
//                 console.error('Failed to load categories:', error);
//                 // Set default categories on error
//                 setCategories([
//                     { id: 'all', label: 'All Discussions', count: 0 }
//                 ]);
//             }
//         };

//         loadCategories();
//     }, []);

//     // Fetch discussions
//     useEffect(() => {
//         const loadDiscussions = async () => {
//             try {
//                 setIsLoading(true);
//                 const params = {
//                     status: 'approved',
//                     sort_by: 'recent',
//                     page: currentPage,
//                     page_size: 20
//                 };

//                 // Add category filter if not 'all'
//                 if (activeCategory !== 'all') {
//                     params.category_id = activeCategory;
//                 }

//                 // Add search query if exists
//                 if (searchQuery) {
//                     params.search = searchQuery;
//                 }

//                 const data = await discussionService.getDiscussions(params);
//                 setDiscussions(data.items || []);
//                 setTotalDiscussions(data.total || 0);
                
//                 // Update "All Discussions" count when viewing all (no category filter, no search)
//                 // This ensures the count stays updated even after the initial load
//                 if (activeCategory === 'all' && !searchQuery) {
//                     setCategories(prevCategories => {
//                         const updatedCategories = [...prevCategories];
//                         if (updatedCategories.length > 0) {
//                             updatedCategories[0].count = data.total || 0;
//                         }
//                         return updatedCategories;
//                     });
//                 }
//             } catch (error) {
//                 console.error('Failed to load discussions:', error);
//                 setDiscussions([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         loadDiscussions();
//     }, [activeCategory, searchQuery, currentPage]);

//     const handleBackToCommunity = () => {
//         navigate('/community');
//     };

//     const handleCreateDiscussion = () => {
//         navigate('/community');
//         // Trigger the create discussion modal
//         // You might need to pass state or use a different approach
//     };

//     const handleCategoryChange = (categoryId) => {
//         setActiveCategory(categoryId);
//         setCurrentPage(1); // Reset to first page when changing category
//     };

//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//         setCurrentPage(1); // Reset to first page when searching
//     };

//     const handleDiscussionClick = (discussionId) => {
//         // Navigate to discussion detail page
//         navigate(`/community/discussions/${discussionId}`);
//     };

//     // Helper function to get initials from name
//     const getInitials = (name) => {
//         if (!name) return '?';
//         return name
//             .split(' ')
//             .map(n => n[0])
//             .join('')
//             .toUpperCase()
//             .substring(0, 2);
//     };

//     return (
//         <ViewAllDiscussionsContainer>
//             {/* Page Header */}
//             <PageHeader>
//                 <HeaderContent>
//                     <BackSection onClick={handleBackToCommunity}>
//                         <BackArrow src={backArrow} alt="Back" />
//                         <BackText>Back to Community</BackText>
//                     </BackSection>
//                     <ActionButtons>
//                         <CreateDiscussionButton onClick={handleCreateDiscussion}>
//                             <ButtonIcon src={discussionIcon} alt="Create Discussion" />
//                             Create Discussion
//                         </CreateDiscussionButton>
//                     </ActionButtons>
//                 </HeaderContent>
//             </PageHeader>

//             {/* Page Title */}
//             <PageTitleSection>
//                 <TitleContent>
//                     <MainTitle>Community Discussions</MainTitle>
//                     <Subtitle>Join conversations about wildlife, conservation, and research</Subtitle>
//                 </TitleContent>
//             </PageTitleSection>

//             {/* Search Section */}
//             <SearchSection>
//                 <SearchContainer>
//                     <SearchInput 
//                         type="text" 
//                         placeholder="Search discussions..."
//                         value={searchQuery}
//                         onChange={handleSearchChange}
//                     />
//                     <SearchIconContainer>
//                         <SearchIcon src={searchIcon} alt="Search" />
//                     </SearchIconContainer>
//                 </SearchContainer>
//             </SearchSection>

//             {/* Category Filter */}
//             <CategoryFilterSection>
//                 <CategoryFilterContainer>
//                     {categories.map((category) => (
//                         <CategoryButton
//                             key={category.id}
//                             isActive={activeCategory === category.id}
//                             onClick={() => handleCategoryChange(category.id)}
//                         >
//                             {category.label}
//                             <CategoryCount>{category.count}</CategoryCount>
//                         </CategoryButton>
//                     ))}
//                 </CategoryFilterContainer>
//             </CategoryFilterSection>

//             {/* Discussion Cards */}
//             <DiscussionCardsSection>
//                 <DiscussionCardsContainer>
//                     <DiscussionCardsHeader>
//                         <DiscussionCountText>
//                             {isLoading ? 'Loading...' : `Showing ${discussions.length} of ${totalDiscussions} discussions`}
//                         </DiscussionCountText>
//                     </DiscussionCardsHeader>

//                     {isLoading ? (
//                         <div style={{ 
//                             textAlign: 'center', 
//                             padding: '60px 0', 
//                             color: 'rgba(255, 232, 161, 1)',
//                             fontFamily: 'DM Sans',
//                             fontSize: '16px'
//                         }}>
//                             Loading discussions...
//                         </div>
//                     ) : discussions.length === 0 ? (
//                         <div style={{ 
//                             textAlign: 'center', 
//                             padding: '60px 0', 
//                             color: 'rgba(255, 232, 161, 1)',
//                             fontFamily: 'DM Sans',
//                             fontSize: '16px'
//                         }}>
//                             No discussions found. Try adjusting your search or filters.
//                         </div>
//                     ) : (
//                         <DiscussionCardsList>
//                             {discussions.map((discussion) => {
//                                 const authorName = discussion.author?.full_name || discussion.author?.username || '[Deleted User]';
//                                 const badgeText = getBadgeText(discussion.author);
//                                 const timeAgo = formatTimeAgo(discussion.created_at);
                                
//                                 return (
//                                     <DiscussionCard 
//                                         key={discussion.id}
//                                         onClick={() => handleDiscussionClick(discussion.id)}
//                                     >
//                                         {/* Author Header with Avatar */}
//                                         <DiscussionHeader>
//                                             <Avatar>{getInitials(authorName)}</Avatar>
//                                             <AuthorInfo>
//                                                 <AuthorRow>
//                                                     <AuthorName>{authorName}</AuthorName>
//                                                     <AuthorBadge>{badgeText}</AuthorBadge>
//                                                     <DiscussionTime>• {timeAgo}</DiscussionTime>
//                                                 </AuthorRow>
//                                             </AuthorInfo>
//                                         </DiscussionHeader>

//                                         {/* Discussion Title */}
//                                         <DiscussionTitle>{discussion.title}</DiscussionTitle>

//                                         {/* Discussion Description */}
//                                         {discussion.excerpt && (
//                                             <DiscussionDescription>
//                                                 {discussion.excerpt}
//                                             </DiscussionDescription>
//                                         )}

//                                         {/* Tags and Stats Footer */}
//                                         <DiscussionFooter>
//                                             <DiscussionTags>
//                                                 {discussion.tags && discussion.tags.length > 0 && discussion.tags.slice(0, 3).map((tag, index) => (
//                                                     <DiscussionTag key={index}>#{tag}</DiscussionTag>
//                                                 ))}
//                                             </DiscussionTags>
//                                             <DiscussionStats>
//                                                 <StatItem>
//                                                     <StatIconImg src={eyeIcon} alt="Views" />
//                                                     {discussion.view_count || 0}
//                                                 </StatItem>
//                                                 <StatItem>
//                                                     <StatIconImg src={commentsIcon} alt="Replies" />
//                                                     {discussion.comment_count || 0}
//                                                 </StatItem>
//                                             </DiscussionStats>
//                                         </DiscussionFooter>
//                                     </DiscussionCard>
//                                 );
//                             })}
//                         </DiscussionCardsList>
//                     )}
//                 </DiscussionCardsContainer>
//             </DiscussionCardsSection>
//         </ViewAllDiscussionsContainer>
//     );
// }

// export default ViewAllDiscussionsPage;


import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled, Box } from '@mui/system';
import discussionService from '../../services/discussionService';
import authService from '../../services/auth';
import CreatePostModal from '../../components/community/CreatePostModal';
// Import icons
import backArrow from '../../assets/icons/backIcon.svg';
import searchIcon from '../../assets/icons/searchIcon.svg';
import discussionIcon from '../../assets/icons/discussionIcon.svg';
import eyeIcon from '../../assets/icons/eyeIcon.svg';
import commentsIcon from '../../assets/icons/commentsIcon.svg';
import deleteIcon from '../../assets/icons/deleteIcon.svg';

const ViewAllDiscussionsContainer = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `100%`,
    minHeight: `100vh`,
    justifyContent: `flex-start`,
    alignItems: `flex-start`,
    padding: `0px`,
    margin: `0px`,
    boxSizing: `border-box`,
});

// Page Header Section
const PageHeader = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `20px 40px`,
    borderBottom: `1px solid rgba(68, 122, 101, 0.2)`,
    width: `100%`,
    '@media (max-width: 768px)': {
        padding: `15px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `10px 15px`,
    },
});

const HeaderContent = styled("div")({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    maxWidth: `1200px`,
    margin: `0 auto`,
    width: `100%`,
    '@media (max-width: 768px)': {
        flexDirection: `column`,
        gap: `15px`,
        alignItems: `flex-start`,
    },
});

const BackSection = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `10px`,
    cursor: `pointer`,
    color: `rgba(255, 232, 161, 1)`,
    transition: `all 0.3s ease`,
    '&:hover': {
        color: `rgba(255, 232, 161, 0.8)`,
    },
});

const BackArrow = styled("img")({
    width: `18px`,
    height: `16px`,
    filter: `brightness(0) saturate(100%) invert(91%) sepia(31%) saturate(457%) hue-rotate(342deg) brightness(103%) contrast(103%)`,
});

const BackText = styled("div")({
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `16px`,
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const ActionButtons = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `12px`,
    '@media (max-width: 768px)': {
        alignSelf: `flex-end`,
    },
    '@media (max-width: 480px)': {
        gap: `8px`,
    },
});

const CreateDiscussionButton = styled("button")({
    display: `flex`,
    alignItems: `center`,
    gap: `8px`,
    backgroundColor: `rgba(68, 122, 101, 1)`,
    color: `rgba(255, 232, 161, 1)`,
    border: `none`,
    borderRadius: `8px`,
    padding: `10px 20px`,
    fontFamily: `'DM Sans', sans-serif`,
    fontSize: `14px`,
    fontWeight: 600,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.8)`,
        transform: `translateY(-1px)`,
    },
    '@media (max-width: 480px)': {
        fontSize: `13px`,
        padding: `8px 16px`,
    },
});

const ButtonIcon = styled("img")({
    width: `16px`,
    height: `16px`,
    objectFit: `contain`,
});

// Page Title Section
const PageTitleSection = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `40px 40px 20px 40px`,
    width: `100%`,
    '@media (max-width: 768px)': {
        padding: `30px 20px 15px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `25px 15px 10px 15px`,
    },
});

const TitleContent = styled("div")({
    maxWidth: `1200px`,
    margin: `0 auto`,
    width: `100%`,
});

const MainTitle = styled("h1")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `48px`,
    margin: `0 0 12px 0`,
    lineHeight: `1.2`,
    '@media (max-width: 768px)': {
        fontSize: `36px`,
        textAlign: `center`,
    },
    '@media (max-width: 480px)': {
        fontSize: `28px`,
    },
});

const Subtitle = styled("p")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `18px`,
    margin: `0`,
    lineHeight: `1.5`,
    '@media (max-width: 768px)': {
        fontSize: `16px`,
        textAlign: `center`,
    },
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

// Search Section
const SearchSection = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `30px 40px`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    width: `100%`,
    '@media (max-width: 768px)': {
        padding: `25px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `20px 15px`,
    },
});

const SearchContainer = styled("div")({
    position: `relative`,
    width: `100%`,
    maxWidth: `1200px`,
    display: `flex`,
    alignItems: `center`,
});

const SearchInput = styled("input")({
    width: `100%`,
    height: `48px`,
    backgroundColor: `rgba(68, 122, 101, 0.1)`,
    border: `1px solid rgba(68, 122, 101, 0.3)`,
    borderRadius: `30px`,
    padding: `0 50px 0 20px`,
    fontFamily: `'DM Sans', sans-serif`,
    fontSize: `16px`,
    color: `rgba(255, 232, 161, 1)`,
    outline: `none`,
    transition: `all 0.3s ease`,
    '&::placeholder': {
        color: `rgba(255, 232, 161, 0.5)`,
        fontSize: `16px`,
    },
    '&:focus': {
        borderColor: `rgba(68, 122, 101, 0.6)`,
        backgroundColor: `rgba(68, 122, 101, 0.15)`,
        boxShadow: `0 0 0 3px rgba(68, 122, 101, 0.1)`,
    },
    '@media (max-width: 480px)': {
        height: `44px`,
        fontSize: `14px`,
        padding: `0 45px 0 15px`,
        '&::placeholder': {
            fontSize: `14px`,
        },
    },
});

const SearchIconContainer = styled("div")({
    position: `absolute`,
    right: `15px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    width: `20px`,
    height: `20px`,
    cursor: `pointer`,
    transition: `opacity 0.3s ease`,
    '&:hover': {
        opacity: 0.8,
    },
    '@media (max-width: 480px)': {
        right: `12px`,
        width: `18px`,
        height: `18px`,
    },
});

const SearchIcon = styled("img")({
    width: `100%`,
    height: `100%`,
    objectFit: `contain`,
});

// Category Filter Section
const CategoryFilterSection = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `20px 40px 30px 40px`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    width: `100%`,
    '@media (max-width: 768px)': {
        padding: `15px 20px 25px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `10px 15px 20px 15px`,
    },
});

const CategoryFilterContainer = styled("div")({
    display: `flex`,
    flexWrap: `wrap`,
    gap: `12px`,
    width: `100%`,
    maxWidth: `1200px`,
    justifyContent: `flex-start`,
    alignItems: `center`,
    '@media (max-width: 768px)': {
        gap: `10px`,
    },
    '@media (max-width: 480px)': {
        gap: `8px`,
        justifyContent: `center`,
    },
});

const CategoryButton = styled("button")(({ isActive }) => ({
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    gap: `8px`,
    padding: `10px 16px`,
    backgroundColor: isActive ? `rgba(255, 232, 161, 1)` : `rgba(68, 122, 101, 0.1)`,
    color: isActive ? `rgba(30, 45, 39, 1)` : `rgba(255, 232, 161, 1)`,
    border: `1px solid ${isActive ? 'rgba(255, 232, 161, 1)' : 'rgba(68, 122, 101, 0.3)'}`,
    borderRadius: `24px`,
    fontFamily: `'DM Sans', sans-serif`,
    fontSize: `14px`,
    fontWeight: isActive ? 600 : 500,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    outline: `none`,
    whiteSpace: `nowrap`,
    '&:hover': {
        backgroundColor: isActive ? `rgba(255, 232, 161, 0.9)` : `rgba(68, 122, 101, 0.2)`,
        borderColor: isActive ? `rgba(255, 232, 161, 0.9)` : `rgba(68, 122, 101, 0.5)`,
        transform: `translateY(-1px)`,
    },
    '&:active': {
        transform: `translateY(0)`,
    },
    '@media (max-width: 480px)': {
        fontSize: `12px`,
        padding: `8px 12px`,
        gap: `6px`,
    },
}));

const CategoryCount = styled("span")({
    backgroundColor: `rgba(0, 0, 0, 0.1)`,
    borderRadius: `12px`,
    padding: `2px 6px`,
    fontSize: `12px`,
    fontWeight: 600,
    '@media (max-width: 480px)': {
        fontSize: `10px`,
        padding: `1px 4px`,
    },
});

// Discussion Cards Section
const DiscussionCardsSection = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `0 40px 40px 40px`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `flex-start`,
    width: `100%`,
    '@media (max-width: 768px)': {
        padding: `0 20px 30px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `0 15px 25px 15px`,
    },
});

const DiscussionCardsContainer = styled("div")({
    width: `100%`,
    maxWidth: `1200px`,
    display: `flex`,
    flexDirection: `column`,
    gap: `20px`,
});

const DiscussionCardsHeader = styled("div")({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    marginBottom: `20px`,
    '@media (max-width: 480px)': {
        flexDirection: `column`,
        alignItems: `flex-start`,
        gap: `10px`,
    },
});

const DiscussionCountText = styled("div")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontSize: `16px`,
    fontWeight: 400,
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const DiscussionCardsList = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    gap: `16px`,
    width: `100%`,
});

const DiscussionCard = styled("div")({
    backgroundColor: `rgba(19, 38, 32, 1)`,
    borderRadius: `12px`,
    padding: `20px`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    border: `1px solid rgba(68, 122, 101, 0.2)`,
    display: `flex`,
    flexDirection: `column`,
    gap: `12px`,
    height: `280px`, // Fixed height for all cards
    '&:hover': {
        transform: `translateY(-2px)`,
        boxShadow: `0 8px 25px rgba(0, 0, 0, 0.2)`,
        borderColor: `rgba(68, 122, 101, 0.4)`,
    },
    '@media (max-width: 768px)': {
        padding: `16px`,
        height: `270px`,
    },
});

const DiscussionHeader = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `12px`,
    marginBottom: `4px`,
});

const Avatar = styled("div")({
    width: `40px`,
    height: `40px`,
    borderRadius: `50%`,
    backgroundColor: `rgba(68, 122, 101, 1)`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 600,
    fontSize: `16px`,
    flexShrink: 0,
    overflow: `hidden`,
    '& img': {
        width: `100%`,
        height: `100%`,
        objectFit: `cover`,
        objectPosition: `center`,
    },
});

const AuthorInfo = styled("div")({
    flex: 1,
    display: `flex`,
    flexDirection: `column`,
    gap: `4px`,
});

const AuthorRow = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `8px`,
    flexWrap: `wrap`,
});

const AuthorName = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 600,
    fontSize: `14px`,
});

const AuthorBadge = styled("span")({
    backgroundColor: `rgba(68, 122, 101, 0.3)`,
    color: `rgba(205, 217, 157, 1)`,
    padding: `2px 8px`,
    borderRadius: `6px`,
    fontSize: `11px`,
    fontWeight: 500,
});

const DiscussionTime = styled("div")({
    color: `rgba(205, 217, 157, 0.6)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 400,
    fontSize: `12px`,
});

const DiscussionTitle = styled("h3")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 600,
    fontSize: `18px`,
    margin: 0,
    lineHeight: 1.4,
    overflow: `hidden`,
    display: `-webkit-box`,
    WebkitLineClamp: 2, // Limit to 2 lines
    WebkitBoxOrient: `vertical`,
    textOverflow: `ellipsis`,
    '@media (max-width: 480px)': {
        fontSize: `16px`,
    },
});

const DiscussionDescription = styled("p")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 400,
    fontSize: `14px`,
    margin: 0,
    lineHeight: 1.6,
    overflow: `hidden`,
    display: `-webkit-box`,
    WebkitLineClamp: 2, // Limit to 2 lines
    WebkitBoxOrient: `vertical`,
    textOverflow: `ellipsis`,
    flex: 1, // Take available space
    '@media (max-width: 480px)': {
        fontSize: `13px`,
        WebkitLineClamp: 2,
    },
});

const DiscussionFooter = styled("div")({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    paddingTop: `8px`,
    borderTop: `1px solid rgba(68, 122, 101, 0.15)`,
});

const DiscussionStats = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `16px`,
});

const StatItem = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `6px`,
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontSize: `13px`,
    fontWeight: 500,
    '@media (max-width: 480px)': {
        fontSize: `12px`,
        gap: `4px`,
    },
});

const StatIconImg = styled("img")({
    width: `16px`,
    height: `16px`,
    objectFit: `contain`,
    opacity: 0.8,
    '@media (max-width: 480px)': {
        width: `14px`,
        height: `14px`,
    },
});

const DiscussionTags = styled("div")({
    display: `flex`,
    flexWrap: `wrap`,
    gap: `8px`,
});

const DiscussionTag = styled("span")({
    backgroundColor: `rgba(68, 122, 101, 0.2)`,
    color: `rgba(255, 232, 161, 1)`,
    padding: `4px 12px`,
    borderRadius: `12px`,
    fontSize: `12px`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 500,
    '@media (max-width: 480px)': {
        fontSize: `11px`,
        padding: `3px 10px`,
    },
});

const DeleteButton = styled("button")({
    background: `transparent`,
    border: `none`,
    cursor: `pointer`,
    padding: `4px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    transition: `all 0.3s ease`,
    opacity: 0.8,
    '&:hover': {
        opacity: 1,
        transform: `scale(1.1)`,
    },
});

const DeleteIconImg = styled("img")({
    width: `18px`,
    height: `18px`,
});

function ViewAllDiscussionsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Get category from URL immediately
    const categoryFromUrl = searchParams.get('category');
    
    // State management
    const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'all');
    const [discussions, setDiscussions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalDiscussions, setTotalDiscussions] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    
    // Get current user and update category if URL params change
    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        
        // Update category if URL param changes
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setActiveCategory(categoryParam);
        } else {
            setActiveCategory('all');
        }
    }, [searchParams]);
    
    // Helper function to format time ago
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        
        const years = Math.floor(months / 12);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    };

    // Helper function to get badge text
    const getBadgeText = (author) => {
        if (!author) return 'Member';
        if (author.badges && author.badges.length > 0) {
            return author.badges[0];
        }
        return 'Member';
    };

    // Fetch categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await discussionService.getCategories();
                const categoriesWithCount = [
                    { id: 'all', label: 'All Discussions', count: 0 }
                ];
                
                data.forEach(cat => {
                    categoriesWithCount.push({
                        id: cat.id,
                        label: cat.name,
                        count: 0 // Will be updated when we fetch discussions
                    });
                });
                
                setCategories(categoriesWithCount);
                
                // Fetch total count for "All Discussions" immediately
                try {
                    const allDiscussionsData = await discussionService.getDiscussions({
                        status: 'approved',
                        page: 1,
                        page_size: 1 // We only need the total count, not the items
                    });
                    categoriesWithCount[0].count = allDiscussionsData.total || 0;
                    
                    // Fetch count for each individual category
                    const categoryCountPromises = data.map(async (cat, index) => {
                        try {
                            const categoryData = await discussionService.getDiscussions({
                                status: 'approved',
                                category_id: cat.id,
                                page: 1,
                                page_size: 1
                            });
                            categoriesWithCount[index + 1].count = categoryData.total || 0;
                        } catch (error) {
                            console.error(`Failed to load count for category ${cat.name}:`, error);
                            categoriesWithCount[index + 1].count = 0;
                        }
                    });
                    
                    // Wait for all category counts to be fetched
                    await Promise.all(categoryCountPromises);
                    setCategories([...categoriesWithCount]);
                } catch (error) {
                    console.error('Failed to load total discussions count:', error);
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
                // Set default categories on error
                setCategories([
                    { id: 'all', label: 'All Discussions', count: 0 }
                ]);
            }
        };

        loadCategories();
    }, []);

    // Fetch discussions
    useEffect(() => {
        const loadDiscussions = async () => {
            try {
                setIsLoading(true);
                const params = {
                    status: 'approved',
                    sort_by: 'recent',
                    page: currentPage,
                    page_size: 20
                };

                // Add category filter if not 'all'
                if (activeCategory !== 'all') {
                    params.category_id = activeCategory;
                }

                // Add search query if exists
                if (searchQuery) {
                    params.search = searchQuery;
                }

                const data = await discussionService.getDiscussions(params);
                setDiscussions(data.items || []);
                setTotalDiscussions(data.total || 0);
                
                // Update "All Discussions" count when viewing all (no category filter, no search)
                // This ensures the count stays updated even after the initial load
                if (activeCategory === 'all' && !searchQuery) {
                    setCategories(prevCategories => {
                        const updatedCategories = [...prevCategories];
                        if (updatedCategories.length > 0) {
                            updatedCategories[0].count = data.total || 0;
                        }
                        return updatedCategories;
                    });
                }
            } catch (error) {
                console.error('Failed to load discussions:', error);
                setDiscussions([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadDiscussions();
    }, [activeCategory, searchQuery, currentPage]);

    const handleBackToCommunity = () => {
        navigate('/community');
    };

    const handleCreateDiscussion = () => {
        setIsCreatePostModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreatePostModalOpen(false);
    };

    const handlePostCreated = () => {
        setIsCreatePostModalOpen(false);
        // Refresh discussions to show the newly created post
        setCurrentPage(1);
        // Trigger a refetch by changing the state
        window.location.reload(); // Simple approach to refresh
    };

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        setCurrentPage(1); // Reset to first page when changing category
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleDiscussionClick = (discussionId, discussionSlug) => {
        // Navigate to discussion detail page using slug for SEO
        navigate(`/community/discussions/${discussionSlug || discussionId}`);
    };

    const handleDeleteDiscussion = async (e, discussionId) => {
        e.stopPropagation(); // Prevent card click navigation
        
        if (!window.confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) {
            return;
        }

        try {
            await discussionService.deleteDiscussion(discussionId);
            // Remove the discussion from state
            setDiscussions(prev => prev.filter(d => d.id !== discussionId));
            setTotalDiscussions(prev => prev - 1);
            alert('Discussion deleted successfully');
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

    // Helper function to get initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <ViewAllDiscussionsContainer>
            {/* Page Header */}
            <PageHeader>
                <HeaderContent>
                    <BackSection onClick={handleBackToCommunity}>
                        <BackArrow src={backArrow} alt="Back" />
                        <BackText>Back to Community</BackText>
                    </BackSection>
                    <ActionButtons>
                        <CreateDiscussionButton onClick={handleCreateDiscussion}>
                            <ButtonIcon src={discussionIcon} alt="Create Discussion" />
                            Create Discussion
                        </CreateDiscussionButton>
                    </ActionButtons>
                </HeaderContent>
            </PageHeader>

            {/* Page Title */}
            <PageTitleSection>
                <TitleContent>
                    <MainTitle>Community Discussions</MainTitle>
                    <Subtitle>Join conversations about wildlife, conservation, and research</Subtitle>
                </TitleContent>
            </PageTitleSection>

            {/* Search Section */}
            <SearchSection>
                <SearchContainer>
                    <SearchInput 
                        type="text" 
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <SearchIconContainer>
                        <SearchIcon src={searchIcon} alt="Search" />
                    </SearchIconContainer>
                </SearchContainer>
            </SearchSection>

            {/* Category Filter */}
            <CategoryFilterSection>
                <CategoryFilterContainer>
                    {categories.map((category) => (
                        <CategoryButton
                            key={category.id}
                            isActive={activeCategory === category.id}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.label}
                            <CategoryCount>{category.count}</CategoryCount>
                        </CategoryButton>
                    ))}
                </CategoryFilterContainer>
            </CategoryFilterSection>

            {/* Discussion Cards */}
            <DiscussionCardsSection>
                <DiscussionCardsContainer>
                    <DiscussionCardsHeader>
                        <DiscussionCountText>
                            {isLoading ? 'Loading...' : `Showing ${discussions.length} of ${totalDiscussions} discussions`}
                        </DiscussionCountText>
                    </DiscussionCardsHeader>

                    {isLoading ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '60px 0', 
                            color: 'rgba(255, 232, 161, 1)',
                            fontFamily: 'DM Sans',
                            fontSize: '16px'
                        }}>
                            Loading discussions...
                        </div>
                    ) : discussions.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '60px 0', 
                            color: 'rgba(255, 232, 161, 1)',
                            fontFamily: 'DM Sans',
                            fontSize: '16px'
                        }}>
                            No discussions found. Try adjusting your search or filters.
                        </div>
                    ) : (
                        <DiscussionCardsList>
                            {discussions.map((discussion) => {
                                const authorName = discussion.author?.full_name || discussion.author?.username || '[Deleted User]';
                                const authorAvatar = discussion.author?.avatar_url;
                                const badgeText = getBadgeText(discussion.author);
                                const timeAgo = formatTimeAgo(discussion.created_at);
                                
                                return (
                                    <DiscussionCard 
                                        key={discussion.id}
                                        onClick={() => handleDiscussionClick(discussion.id, discussion.slug)}
                                    >
                                        {/* Author Header with Avatar */}
                                        <DiscussionHeader>
                                            <Avatar>
                                                {authorAvatar ? (
                                                    <img src={authorAvatar} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                                ) : (
                                                    getInitials(authorName)
                                                )}
                                            </Avatar>
                                            <AuthorInfo>
                                                <AuthorRow>
                                                    <AuthorName>{authorName}</AuthorName>
                                                    <AuthorBadge>{badgeText}</AuthorBadge>
                                                    <DiscussionTime>• {timeAgo}</DiscussionTime>
                                                </AuthorRow>
                                            </AuthorInfo>
                                        </DiscussionHeader>

                                        {/* Discussion Title */}
                                        <DiscussionTitle>{discussion.title}</DiscussionTitle>

                                        {/* Discussion Description */}
                                        {discussion.excerpt && (
                                            <DiscussionDescription>
                                                {discussion.excerpt}
                                            </DiscussionDescription>
                                        )}

                                        {/* Tags and Stats Footer */}
                                        <DiscussionFooter>
                                            <DiscussionTags>
                                                {discussion.tags && discussion.tags.length > 0 && discussion.tags.map((tag, index) => (
                                                    <DiscussionTag key={index}>#{tag}</DiscussionTag>
                                                ))}
                                            </DiscussionTags>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <DiscussionStats>
                                                    <StatItem>
                                                        <StatIconImg src={eyeIcon} alt="Views" />
                                                        {discussion.view_count || 0}
                                                    </StatItem>
                                                    <StatItem>
                                                        <StatIconImg src={commentsIcon} alt="Replies" />
                                                        {discussion.comment_count || 0}
                                                    </StatItem>
                                                </DiscussionStats>
                                                {currentUser && discussion.author?.id === currentUser.id && (
                                                    <DeleteButton onClick={(e) => handleDeleteDiscussion(e, discussion.id)}>
                                                        <DeleteIconImg src={deleteIcon} alt="delete" />
                                                    </DeleteButton>
                                                )}
                                            </Box>
                                        </DiscussionFooter>
                                    </DiscussionCard>
                                );
                            })}
                        </DiscussionCardsList>
                    )}
                </DiscussionCardsContainer>
            </DiscussionCardsSection>

            {/* Create Post Modal */}
            <CreatePostModal 
                isOpen={isCreatePostModalOpen}
                onClose={handleCloseModal}
                onPostCreated={handlePostCreated}
            />
        </ViewAllDiscussionsContainer>
    );
}

export default ViewAllDiscussionsPage;
