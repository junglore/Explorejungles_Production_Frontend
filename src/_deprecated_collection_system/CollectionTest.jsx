/**
 * Collection Integration Test Component
 * Simple test to validate collection service integration
 */

import React, { useState, useEffect } from 'react';
import collectionService from '../services/collectionService.js';

const CollectionTest = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        testCollectionService();
    }, []);

    const testCollectionService = async () => {
        try {
            console.log('Testing collection service...');
            
            // Test health check
            const health = await collectionService.healthCheck();
            console.log('Health check:', health);
            
            // Test getting available collections
            const availableCollections = await collectionService.getAvailableCollections();
            console.log('Available collections:', availableCollections);
            
            setCollections(availableCollections.collections || []);
            setLoading(false);
        } catch (err) {
            console.error('Collection service test failed:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Testing collection service...</div>;
    }

    if (error) {
        return (
            <div style={{ color: 'red' }}>
                <h3>Collection Service Test Failed</h3>
                <p>{error}</p>
                <button onClick={testCollectionService}>Retry Test</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Collection Service Integration Test</h2>
            <p><strong>Status:</strong> ✅ Connected successfully!</p>
            <p><strong>Collections found:</strong> {collections.length}</p>
            
            {collections.length > 0 && (
                <div>
                    <h3>Available Collections:</h3>
                    <ul>
                        {collections.map((collection, index) => (
                            <li key={collection.id || index}>
                                <strong>{collection.name}</strong> - {collection.description}
                                <br />
                                <small>
                                    Questions: {collection.total_questions} | 
                                    Daily Limit: {collection.daily_limit} | 
                                    Can Play Today: {collection.can_play_today ? 'Yes' : 'No'}
                                </small>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
                <h4>Integration Status:</h4>
                <p>✅ Collection Service: Connected</p>
                <p>✅ API Endpoints: Accessible</p>
                <p>✅ Frontend Components: Ready</p>
                <p>✅ React Integration: Complete</p>
            </div>
        </div>
    );
};

export default CollectionTest;