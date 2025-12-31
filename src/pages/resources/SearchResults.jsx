import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import apiService from '../../services/api';

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
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '120px 24px 0 24px',
});

const Title = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '32px',
    marginBottom: '16px',
});

const Section = styled('div')({
    marginTop: '32px',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 232, 161, 0.1)',
});

const SectionTitle = styled('div')({
    color: '#FFE8A1',
    fontWeight: 700,
    fontSize: '22px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid rgba(255, 232, 161, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&::before': {
        content: '""',
        width: '4px',
        height: '20px',
        backgroundColor: '#FFE8A1',
        borderRadius: '2px',
    },
});

const Card = styled(Link)({
    display: 'block',
    background: 'rgba(0,0,0,0.25)',
    borderRadius: '12px',
    padding: '16px',
    color: '#fff',
    textDecoration: 'none',
    marginBottom: '10px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 232, 161, 0.1)',
    '&:hover': {
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255, 232, 161, 0.3)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
    },
});

function SearchResults() {
    const [params] = useSearchParams();
    const q = params.get('q') || '';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState({ content: { items: [], total: 0 }, media: { items: [], total: 0 }, myths: { items: [], total: 0 } });

    useEffect(() => {
        const load = async () => {
            if (!q || q.length < 2) return;
            setLoading(true);
            setError(null);
            try {
                const data = await apiService.get(`/search/content?q=${encodeURIComponent(q)}`);
                setResults(data);
            } catch (err) {
                setError('Search failed');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [q]);

    return (
        <PageContainer>
            <Header />
            <ContentWrapper>
                <Title>Search results for "{q}"</Title>
                {loading ? (
                    <div style={{ 
                        color: '#FFE8A1', 
                        padding: '20px 0',
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: '600'
                    }}>
                        🔍 Searching for "{q}"...
                    </div>
                ) : error ? (
                    <div style={{ 
                        color: '#FF6B6B', 
                        padding: '20px 0',
                        textAlign: 'center',
                        fontSize: '16px',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 107, 107, 0.3)'
                    }}>
                        ❌ {error}
                    </div>
                ) : (
                    <>
                        <Section>
                            <SectionTitle>Content ({results?.content?.total || 0})</SectionTitle>
                            {(results?.content?.items || []).length > 0 ? (
                                (results?.content?.items || []).map((c) => (
                                    <Card key={c.id} to={c.type === 'blog' || c.type === 'article' ? `/resources/blog/${c.id}` : '/resources'}>
                                        <div style={{ color: '#FFE8A1', fontWeight: 700 }}>{c.title}</div>
                                        {c.excerpt && <div style={{ opacity: 0.85, marginTop: 4 }}>{c.excerpt}</div>}
                                    </Card>
                                ))
                            ) : (
                                <div style={{ 
                                    color: 'rgba(255, 232, 161, 0.6)', 
                                    padding: '20px',
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 232, 161, 0.1)'
                                }}>
                                    No content found for "{q}"
                                </div>
                            )}
                        </Section>
                        <Section>
                            <SectionTitle>Media ({results?.media?.total || 0})</SectionTitle>
                            {(results?.media?.items || []).length > 0 ? (
                                (results?.media?.items || []).map((m) => (
                                    <Card key={m.id} to={'/media'}>
                                        <div style={{ color: '#FFE8A1', fontWeight: 700 }}>{m.title || m.media_type}</div>
                                        <div style={{ opacity: 0.85, marginTop: 4 }}>{m.media_type}</div>
                                    </Card>
                                ))
                            ) : (
                                <div style={{ 
                                    color: 'rgba(255, 232, 161, 0.6)', 
                                    padding: '20px',
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 232, 161, 0.1)'
                                }}>
                                    No media found for "{q}"
                                </div>
                            )}
                        </Section>
                        <Section>
                            <SectionTitle>Myths & Facts ({results?.myths?.total || 0})</SectionTitle>
                            {(results?.myths?.items || []).length > 0 ? (
                                (results?.myths?.items || []).map((mf) => (
                                    <Card key={mf.id} to={'/resources'}>
                                        <div style={{ color: '#FFE8A1', fontWeight: 700 }}>{mf.title}</div>
                                    </Card>
                                ))
                            ) : (
                                <div style={{ 
                                    color: 'rgba(255, 232, 161, 0.6)', 
                                    padding: '20px',
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 232, 161, 0.1)'
                                }}>
                                    No myths & facts found for "{q}"
                                </div>
                            )}
                        </Section>
                    </>
                )}
            </ContentWrapper>
            <Footer />
        </PageContainer>
    );
}

export default SearchResults;


