import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useNavigate } from 'react-router-dom';
import contentService from '../../services/contentService.js';
import PreventOverexploitationSvg from '../../assets/icons/Prevent Overexploitation.svg';
import PromoteSustainableCoexistenceSvg from '../../assets/icons/Promote Sustainable Coexistence.svg';
import ProtectNaturalHabitatsSvg from '../../assets/icons/Protect Natural Habitats.svg';
import MaintainBiodiversitySvg from '../../assets/icons/Maintain Biodiversity.svg';

const PageContainer = styled('div')({
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1E2D27',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

const ContentWrapper = styled('div')({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '120px 24px 0 24px',
    '@media (max-width: 1024px)': { padding: '100px 20px 0 20px' },
    '@media (max-width: 768px)': { padding: '80px 16px 0 16px' },
    '@media (max-width: 480px)': { padding: '70px 12px 0 12px' },
});

const Title = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '64px',
    letterSpacing: '-2px',
    marginBottom: '8px',
    textAlign: 'left',
    '@media (max-width: 768px)': { fontSize: '40px' },
    '@media (max-width: 480px)': { fontSize: '28px' },
});

const Subtitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '18px',
    marginBottom: '48px',
    textAlign: 'left',
    maxWidth: '800px',
    lineHeight: '1.5',
    '@media (max-width: 768px)': { fontSize: '16px', marginBottom: '32px' },
    '@media (max-width: 480px)': { fontSize: '14px', marginBottom: '24px' },
});

const SectionTitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '32px',
    margin: '80px 0 32px 0',
    textAlign: 'left',
    '@media (max-width: 768px)': { fontSize: '24px', margin: '60px 0 24px 0' },
    '@media (max-width: 480px)': { fontSize: '18px', margin: '40px 0 20px 0' },
});

// Conservation Efforts Cards Section
const CardsGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
    marginBottom: '32px',
    '@media (max-width: 900px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '24px',
    },
    '@media (max-width: 600px)': {
        gridTemplateColumns: '1fr',
        gap: '20px',
        marginBottom: '20px',
    },
});

const Card = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.25)',
    border: '1px solid #FFE8A1',
    borderRadius: '16px',
    overflow: 'hidden',
    minHeight: '400px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
    },
});

const CardImage = styled('div')({
    width: '100%',
    height: '200px',
    background: 'rgba(255,232,161,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFE8A1',
    fontSize: '14px',
    position: 'relative',
});

const CardContent = styled('div')({
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
});

const CardSource = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
});

const CardTitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '1.4',
    marginBottom: '12px',
    flex: 1,
});

const CardDescription = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '16px',
});

const CardMetadata = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '12px',
});

const MetadataItem = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
});

const BookmarkIcon = styled('div')({
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '20px',
    height: '20px',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFE8A1',
    fontSize: '12px',
    cursor: 'pointer',
});

// Take Action Section
const ActionCard = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.25)',
    border: '1px solid #FFE8A1',
    borderRadius: '16px',
    overflow: 'hidden',
    minHeight: '400px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
    },
});

const ActionCardTitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '1.3',
    marginBottom: '16px',
    padding: '20px 20px 0 20px',
});

const ActionCardList = styled('ul')({
    listStyle: 'none',
    padding: '0 20px 20px 20px',
    margin: 0,
    flex: 1,
});

const ActionCardListItem = styled('li')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '12px',
    paddingLeft: '16px',
    position: 'relative',
    '&::before': {
        content: '"•"',
        color: '#FFE8A1',
        position: 'absolute',
        left: '0',
        fontWeight: 'bold',
    },
});

// Wildlife Conservation Principles Section
const PrinciplesSection = styled('div')({
    backgroundColor: '#FFE8A1',
    width: '100vw',
    marginLeft: 'calc(-50vw + 50%)',
    padding: '40px 0',
    marginBottom: '32px',
    backgroundImage: `
        repeating-linear-gradient(
            90deg,
            transparent,
            transparent 20px,
            rgba(255, 232, 161, 0.3) 20px,
            rgba(255, 232, 161, 0.3) 40px
        )
    `,
    '@media (max-width: 768px)': {
        padding: '32px 0',
        marginBottom: '24px',
    },
    '@media (max-width: 480px)': {
        padding: '24px 0',
        marginBottom: '20px',
    },
});

const PrinciplesContentWrapper = styled('div')({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    '@media (max-width: 768px)': {
        padding: '0 20px',
    },
    '@media (max-width: 480px)': {
        padding: '0 16px',
    },
});

const PrinciplesSectionTitle = styled('div')({
    color: '#1E2D27',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '32px',
    marginBottom: '32px',
    textAlign: 'center',
    '@media (max-width: 768px)': { fontSize: '24px', marginBottom: '24px' },
    '@media (max-width: 480px)': { fontSize: '18px', marginBottom: '20px' },
});

const PrinciplesGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
    '@media (max-width: 900px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
    },
    '@media (max-width: 600px)': {
        gridTemplateColumns: '1fr',
        gap: '20px',
    },
});

const PrincipleBox = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFE8A1',
    border: '2px solid #1E2D27',
    borderRadius: '16px',
    padding: '24px 16px',
    textAlign: 'center',
    minHeight: '200px',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
    },
});

const PrincipleIcon = styled('img')({
    width: '40px',
    height: '40px',
    marginBottom: '16px',
    filter: 'brightness(0) saturate(100%) invert(8%) sepia(8%) saturate(1034%) hue-rotate(118deg) brightness(95%) contrast(89%)',
});

const PrincipleTitle = styled('div')({
    color: '#1E2D27',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '1.3',
    marginBottom: '12px',
});

const PrincipleDescription = styled('div')({
    color: '#1E2D27',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.5',
});

// Build Community Section
const CommunityCard = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.25)',
    border: '1px solid #FFE8A1',
    borderRadius: '16px',
    overflow: 'hidden',
    minHeight: '400px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
    },
});

const CommunityCardTitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '1.3',
    marginBottom: '16px',
    padding: '20px 20px 0 20px',
});

const CommunityCardList = styled('ul')({
    listStyle: 'none',
    padding: '0 20px 20px 20px',
    margin: 0,
    flex: 1,
});

const CommunityCardListItem = styled('li')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '12px',
    paddingLeft: '16px',
    position: 'relative',
    '&::before': {
        content: '"•"',
        color: '#FFE8A1',
        position: 'absolute',
        left: '0',
        fontWeight: 'bold',
    },
});

const ShowMoreSection = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    marginTop: '60px',
    marginBottom: '40px',
    gap: '20px',
    '@media (max-width: 768px)': {
        marginTop: '40px',
        marginBottom: '30px',
        gap: '15px',
    },
    '@media (max-width: 480px)': {
        marginTop: '30px',
        marginBottom: '20px',
        gap: '10px',
    },
});

const Line = styled('div')({
    border: '1px solid rgba(255, 232, 161, 1)',
    height: '0px',
    flex: '1',
    '@media (max-width: 480px)': {
        display: 'none',
    },
});

const ShowMoreButton = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
    },
});

const ShowMoreText = styled('div')({
    textAlign: 'center',
    color: 'rgba(255, 232, 161, 1)',
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: '12px',
    letterSpacing: '0.56px',
    lineHeight: '20px',
    textTransform: 'none',
});

const ShowMoreArrow = styled('div')({
    color: 'rgba(255, 232, 161, 1)',
    fontSize: '16px',
    fontWeight: 'bold',
    transform: 'rotate(90deg)',
});

const BottomSpacer = styled('div')({
    height: '80px',
    '@media (max-width: 768px)': { height: '60px' },
});

// API service for fetching conservation efforts
const fetchConservationEfforts = async (page = 1, limit = 9) => {
    try {
        const response = await contentService.fetchConservationEfforts({ page, limit });
        // Transform the response to match the expected format
        return {
            conservation: response.data || response.result || response.items || [],
            pagination: {
                page: response.page || response.currentPage || response.current_page || 1,
                limit: response.limit || response.per_page || 9,
                total: response.total || response.total_count || 0,
                pages: response.pages || response.totalPages || response.total_pages || 1
            }
        };
    } catch (error) {
        console.error('Error fetching conservation efforts:', error);
        return { conservation: [], pagination: { page: 1, limit: 9, total: 0, pages: 0 } };
    }
};

const takeActionData = [
    {
        id: 1,
        image: 'Coiled yellow and black snake',
        title: 'Support Wildlife Organizations',
        items: [
            'Donate to conservation NGOs (like WWF-india, WCS, Wildlife SOS)',
            'Adopt an animal virtually to fund rescue and habitat protection',
            'Buy merchandise that supports sanctuaries or rescue efforts'
        ],
    },
    {
        id: 2,
        image: 'Crocodile on sandy bank',
        title: 'Raise Awareness',
        items: [
            'Share verified wildlife facts and conservation updates on social media',
            'Debunk wildlife myths and promote coexistence messaging',
            'Encourage respectful tourism and photography ethics'
        ],
    },
    {
        id: 3,
        image: 'Close-up of alligator head',
        title: 'Volunteer Locally',
        items: [
            'Join clean-up drives near forests, rivers, or coastal areas',
            'Volunteer at animal rescue centers, conservation organizations, or local NGOs',
            'Plant native trees and help restore degraded habitats'
        ],
    },
];

const principlesData = [
    {
        id: 1,
        icon: ProtectNaturalHabitatsSvg,
        title: 'Protect Natural Habitats',
        description: 'Conserving the ecosystems where wildlife live ensures they have space, food, and shelter to thrive.',
    },
    {
        id: 2,
        icon: MaintainBiodiversitySvg,
        title: 'Maintain Biodiversity',
        description: 'Preserving a variety of species and genetic diversity helps ecosystems stay resilient and balanced.',
    },
    {
        id: 3,
        icon: PreventOverexploitationSvg,
        title: 'Prevent Overexploitation',
        description: 'Regulating hunting, fishing, and resource use prevents population decline and extinction.',
    },
    {
        id: 4,
        icon: PromoteSustainableCoexistenceSvg,
        title: 'Promote Sustainable Coexistence',
        description: 'Encouraging harmony between humans and wildlife reduces conflict and supports long-term conservation.',
    },
];

const buildCommunityData = [
    {
        id: 1,
        image: 'Coiled yellow and black snake',
        title: 'Start a Local Nature Club',
        items: [
            'Bring together students, families, and neighbors to organize regular wildlife walks, nature clean-ups, or birdwatching events',
            'Focus on local flora and fauna to create a personal connection'
        ],
    },
    {
        id: 2,
        image: 'Crocodile on sandy bank',
        title: 'Host Wildlife Film Screenings or Photo Exhibits',
        items: [
            'Collaborate with photographers, researchers, or filmmakers to showcase wildlife stories',
            'Add discussion circles to reflect on conservation themes and local relevance'
        ],
    },
    {
        id: 3,
        image: 'Close-up of alligator head',
        title: 'Launch a Citizen Science Project',
        items: [
            'Encourage people to record bird sightings, track migratory patterns, or report injured animals using apps',
            'Analyze the data together and share findings with local forest departments'
        ],
    },
];

function ConservationEffortsPage() {
    const [conservationEfforts, setConservationEfforts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        loadConservationEfforts();
    }, []);

    const loadConservationEfforts = async (page = 1) => {
        setLoading(true);
        try {
            const data = await fetchConservationEfforts(page, 9);
            setConservationEfforts(data.conservation || []);
            setPagination(data.pagination || { page: 1, limit: 9, total: 0, pages: 0 });
        } catch (error) {
            console.error('Error loading conservation efforts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowMore = async () => {
        if (pagination.page < pagination.pages) {
            const nextPage = pagination.page + 1;
            const data = await fetchConservationEfforts(nextPage, 9);
            setConservationEfforts(prevEfforts => [...prevEfforts, ...(data.conservation || [])]);
            setPagination(data.pagination || pagination);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Recent';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            return `${diffMinutes}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    return (
        <PageContainer>
            <Header />
            <ContentWrapper>
                <Title>CONSERVATION EFFORTS</Title>
                <Subtitle>Protecting the wild, one species at a time—through research, rescue, education, and a global call to coexist.</Subtitle>

                {/* Conservation Efforts Taken in India Section */}
                <SectionTitle>CONSERVATION EFFORTS TAKEN IN INDIA</SectionTitle>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#FFE8A1' }}>
                        Loading conservation efforts...
                    </div>
                ) : conservationEfforts.length > 0 ? (
                    <CardsGrid>
                        {conservationEfforts.map((effort) => (
                            <Card key={effort.id} onClick={() => navigate(`/resources/conservation/${effort.id}`)} style={{ cursor: 'pointer' }}>
                                <CardImage>
                                    {effort.image ? (
                                        <img src={effort.image} alt={effort.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        'Conservation Image'
                                    )}
                                    <BookmarkIcon>🔖</BookmarkIcon>
                                </CardImage>
                                <CardContent>
                                    <CardSource>JUNGLORE</CardSource>
                                    <CardTitle>{effort.title}</CardTitle>
                                    <CardDescription>{effort.description || 'Learn about important conservation efforts protecting wildlife and ecosystems.'}</CardDescription>
                                    <CardMetadata>
                                        <MetadataItem>{formatDate(effort.createdAt)}</MetadataItem>
                                        <MetadataItem>📖 Conservation Effort</MetadataItem>
                                        <MetadataItem>🌿 {effort.status ? 'Published' : 'Draft'}</MetadataItem>
                                    </CardMetadata>
                                </CardContent>
                            </Card>
                        ))}
                    </CardsGrid>
                ) : (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#FFE8A1' }}>
                        <div style={{ fontSize: '18px', marginBottom: '16px' }}>No conservation efforts available yet</div>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Check back later for inspiring conservation stories!
                        </div>
                    </div>
                )}
                {pagination.page < pagination.pages && conservationEfforts.length > 0 && (
                    <ShowMoreSection>
                        <Line />
                        <ShowMoreButton onClick={handleShowMore}>
                            <ShowMoreText>SHOW MORE</ShowMoreText>
                            <ShowMoreArrow>›</ShowMoreArrow>
                        </ShowMoreButton>
                        <Line />
                    </ShowMoreSection>
                )}

                {/* Take Action Section */}
                <SectionTitle>TAKE ACTION</SectionTitle>
                <CardsGrid>
                    {takeActionData.map((action) => (
                        <ActionCard key={action.id}>
                            <CardImage>
                                {action.image}
                            </CardImage>
                            <ActionCardTitle>{action.title}</ActionCardTitle>
                            <ActionCardList>
                                {action.items.map((item, index) => (
                                    <ActionCardListItem key={index}>{item}</ActionCardListItem>
                                ))}
                            </ActionCardList>
                        </ActionCard>
                    ))}
                </CardsGrid>
                <ShowMoreSection>
                    <Line />
                    <ShowMoreButton onClick={handleShowMore}>
                        <ShowMoreText>SHOW MORE</ShowMoreText>
                        <ShowMoreArrow>›</ShowMoreArrow>
                    </ShowMoreButton>
                    <Line />
                </ShowMoreSection>

                {/* Wildlife Conservation Principles Section */}
                <PrinciplesSection>
                    <PrinciplesContentWrapper>
                        <PrinciplesSectionTitle>WILDLIFE CONSERVATION PRINCIPLES</PrinciplesSectionTitle>
                        <PrinciplesGrid>
                            {principlesData.map((principle) => (
                                <PrincipleBox key={principle.id}>
                                    <PrincipleIcon src={principle.icon} alt={principle.title} />
                                    <PrincipleTitle>{principle.title}</PrincipleTitle>
                                    <PrincipleDescription>{principle.description}</PrincipleDescription>
                                </PrincipleBox>
                            ))}
                        </PrinciplesGrid>
                    </PrinciplesContentWrapper>
                </PrinciplesSection>

                {/* Build Community Section */}
                <SectionTitle>BUILD COMMUNITY</SectionTitle>
                <CardsGrid>
                    {buildCommunityData.map((community) => (
                        <CommunityCard key={community.id}>
                            <CardImage>
                                {community.image}
                            </CardImage>
                            <CommunityCardTitle>{community.title}</CommunityCardTitle>
                            <CommunityCardList>
                                {community.items.map((item, index) => (
                                    <CommunityCardListItem key={index}>{item}</CommunityCardListItem>
                                ))}
                            </CommunityCardList>
                        </CommunityCard>
                    ))}
                </CardsGrid>
                <ShowMoreSection>
                    <Line />
                    <ShowMoreButton onClick={handleShowMore}>
                        <ShowMoreText>SHOW MORE</ShowMoreText>
                        <ShowMoreArrow>›</ShowMoreArrow>
                    </ShowMoreButton>
                    <Line />
                </ShowMoreSection>

                <BottomSpacer />
            </ContentWrapper>
            <Footer />
        </PageContainer>
    );
}

export default ConservationEffortsPage;
