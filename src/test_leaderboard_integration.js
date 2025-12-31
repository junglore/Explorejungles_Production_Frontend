/**
 * Test script to verify leaderboard frontend integration
 * This script tests if the frontend can successfully call the leaderboard API
 */

import rewardsService from '../services/rewardsService.js';

async function testLeaderboardIntegration() {
    console.log('🧪 Testing Leaderboard Frontend Integration...\n');

    const testTypes = ['weekly', 'monthly', 'alltime'];

    for (const type of testTypes) {
        try {
            console.log(`📊 Testing ${type} leaderboard...`);

            const data = await rewardsService.getLeaderboard(type, { limit: 10 });

            if (data && data.participants) {
                console.log(`✅ ${type} leaderboard: ${data.participants.length} participants loaded`);
                console.log(`   Type: ${data.type}`);
                console.log(`   Period Start: ${data.period_start || 'N/A'}`);
                console.log(`   Total Participants: ${data.total_participants || data.participants.length}`);

                // Check if participants have required fields
                if (data.participants.length > 0) {
                    const firstParticipant = data.participants[0];
                    const requiredFields = ['user_id', 'username', 'rank', 'score', 'is_current_user'];

                    const missingFields = requiredFields.filter(field => !(field in firstParticipant));
                    if (missingFields.length === 0) {
                        console.log(`✅ Participant data structure is correct`);
                    } else {
                        console.log(`❌ Missing fields in participant: ${missingFields.join(', ')}`);
                    }
                }
            } else {
                console.log(`❌ ${type} leaderboard: No data returned`);
            }

            console.log('');

        } catch (error) {
            console.log(`❌ ${type} leaderboard failed: ${error.message}`);
            console.log('');
        }
    }

    console.log('🏁 Leaderboard integration test completed!');
}

// Run the test
testLeaderboardIntegration().catch(console.error);