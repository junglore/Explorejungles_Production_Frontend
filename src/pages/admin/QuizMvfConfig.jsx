/**
 * Quiz & Myths vs Facts Configuration Information Panel
 * Read-only information panel showing all scoring, tier, and limit configurations
 * This helps admins understand the current system setup without editing capabilities
 */

import React, { useState, useEffect } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Box, 
    Chip, 
    Divider,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import QuizIcon from '@mui/icons-material/Quiz';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const QuizMvfConfig = () => {
    const [configData, setConfigData] = useState({
        quiz: {
            basePointsPerQuestion: 5,
            baseCreditsPerQuiz: 2,
            maxTriesPerQuiz: 3,
            maxQuizzesPerDay: 10,
            dailyPointsLimit: 500,
            dailyCreditsLimit: 100,
            timeLimit: 30, // seconds per question
            categories: ['Wildlife', 'Marine Life', 'Conservation', 'Climate']
        },
        mythsVsFacts: {
            basePointsPerCard: 5,
            baseCreditsPerGame: 3,
            cardsPerGame: 7,
            maxGamesPerDay: 5,
            dailyPointsLimit: 200,
            dailyCreditsLimit: 50,
            timeLimit: 120, // seconds per game
            collections: ['Wildlife Conservation', 'Marine Myths', 'Forest Facts']
        },
        performanceTiers: {
            bronze: { scoreRange: '60-74%', multiplier: 1.0, description: 'Basic Performance' },
            silver: { scoreRange: '75-84%', multiplier: 1.2, description: 'Good Performance' },
            gold: { scoreRange: '85-94%', multiplier: 1.5, description: 'Excellent Performance' },
            platinum: { scoreRange: '95-100%', multiplier: 2.0, description: 'Perfect Performance' }
        },
        userTiers: {
            bronze: { creditMultiplier: 1.0, description: 'New users, conservative credits' },
            silver: { creditMultiplier: 1.1, description: 'Regular users, slight bonus' },
            gold: { creditMultiplier: 1.2, description: 'Active users, good bonus' },
            platinum: { creditMultiplier: 1.3, description: 'VIP users, best bonus' }
        },
        bonuses: {
            timeBonus: { threshold: '40% faster', bonus: '30% extra points/credits' },
            perfectBonus: { threshold: '100% accuracy', bonus: '25% extra points/credits' },
            streakBonus: { threshold: '5 days consecutive', bonus: '15% extra points/credits' }
        }
    });

    const TierCard = ({ tier, data, type, color }) => (
        <Card sx={{ mb: 1, border: `2px solid ${color}` }}>
            <CardContent sx={{ py: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ textTransform: 'capitalize', color }}>
                        {tier}
                    </Typography>
                    <Chip 
                        label={type === 'performance' ? `${data.multiplier}x` : `${data.creditMultiplier}x`}
                        sx={{ backgroundColor: color, color: 'white' }}
                    />
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {type === 'performance' ? data.scoreRange : data.description}
                </Typography>
                <Typography variant="caption" display="block">
                    {data.description}
                </Typography>
            </CardContent>
        </Card>
    );

    const ConfigSection = ({ title, icon, children }) => (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1}>
                    {icon}
                    <Typography variant="h6">{title}</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon color="primary" />
                Quiz & Myths vs Facts Configuration
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                This panel shows current system configuration for scoring, tiers, and limits. 
                To modify these settings, go to Site Settings → Rewards System.
            </Alert>

            {/* Quiz Configuration */}
            <ConfigSection 
                title="Quiz System Configuration" 
                icon={<QuizIcon color="primary" />}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    📊 Scoring System
                                </Typography>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><strong>Base Points per Question</strong></TableCell>
                                            <TableCell>{configData.quiz.basePointsPerQuestion} points</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Base Credits per Quiz</strong></TableCell>
                                            <TableCell>{configData.quiz.baseCreditsPerQuiz} credits</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Time Limit per Question</strong></TableCell>
                                            <TableCell>{configData.quiz.timeLimit} seconds</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    🎯 Limits & Restrictions
                                </Typography>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><strong>Max Tries per Quiz</strong></TableCell>
                                            <TableCell>{configData.quiz.maxTriesPerQuiz} attempts</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Max Quizzes per Day</strong></TableCell>
                                            <TableCell>{configData.quiz.maxQuizzesPerDay} quizzes</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Daily Points Limit</strong></TableCell>
                                            <TableCell>{configData.quiz.dailyPointsLimit} points</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Daily Credits Limit</strong></TableCell>
                                            <TableCell>{configData.quiz.dailyCreditsLimit} credits</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ConfigSection>

            {/* Myths vs Facts Configuration */}
            <ConfigSection 
                title="Myths vs Facts Configuration" 
                icon={<PsychologyIcon color="secondary" />}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="secondary">
                                    🎮 Game System
                                </Typography>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><strong>Base Points per Card</strong></TableCell>
                                            <TableCell>{configData.mythsVsFacts.basePointsPerCard} points</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Base Credits per Game</strong></TableCell>
                                            <TableCell>{configData.mythsVsFacts.baseCreditsPerGame} credits</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Cards per Game</strong></TableCell>
                                            <TableCell>{configData.mythsVsFacts.cardsPerGame} cards</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Time Limit per Game</strong></TableCell>
                                            <TableCell>{configData.mythsVsFacts.timeLimit} seconds</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="secondary">
                                    📅 Daily Limits
                                </Typography>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><strong>Max Games per Day</strong></TableCell>
                                            <TableCell>{configData.mythsVsFacts.maxGamesPerDay} games</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Daily Points Limit</strong></TableCell>
                                            <TableCell>{configData.mythsVsFacts.dailyPointsLimit} points</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Daily Credits Limit</strong></TableCell>
                                            <TableCell>{configData.mythsVsFacts.dailyCreditsLimit} credits</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ConfigSection>

            {/* Performance Tiers */}
            <ConfigSection 
                title="Performance Tier System" 
                icon={<EmojiEventsIcon sx={{ color: '#ffd700' }} />}
            >
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <strong>Performance Tiers:</strong> Based on quiz/game score percentage. Applied to both quizzes and myths vs facts.
                </Alert>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TierCard tier="bronze" data={configData.performanceTiers.bronze} type="performance" color="#CD7F32" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TierCard tier="silver" data={configData.performanceTiers.silver} type="performance" color="#C0C0C0" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TierCard tier="gold" data={configData.performanceTiers.gold} type="performance" color="#FFD700" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TierCard tier="platinum" data={configData.performanceTiers.platinum} type="performance" color="#E5E4E2" />
                    </Grid>
                </Grid>
            </ConfigSection>

            {/* User Tiers */}
            <ConfigSection 
                title="User Tier System" 
                icon={<TrendingUpIcon color="success" />}
            >
                <Alert severity="info" sx={{ mb: 2 }}>
                    <strong>User Tiers:</strong> Based on user account level/status. Only affects credit earning multipliers.
                </Alert>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TierCard tier="bronze" data={configData.userTiers.bronze} type="user" color="#CD7F32" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TierCard tier="silver" data={configData.userTiers.silver} type="user" color="#C0C0C0" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TierCard tier="gold" data={configData.userTiers.gold} type="user" color="#FFD700" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TierCard tier="platinum" data={configData.userTiers.platinum} type="user" color="#E5E4E2" />
                    </Grid>
                </Grid>
            </ConfigSection>

            {/* Bonus System */}
            <ConfigSection 
                title="Bonus System" 
                icon={<AccessTimeIcon color="warning" />}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ border: '2px solid #ff9800' }}>
                            <CardContent>
                                <Typography variant="h6" color="warning.main">⚡ Speed Bonus</Typography>
                                <Typography variant="body2">
                                    <strong>Requirement:</strong> {configData.bonuses.timeBonus.threshold}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Reward:</strong> {configData.bonuses.timeBonus.bonus}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ border: '2px solid #4caf50' }}>
                            <CardContent>
                                <Typography variant="h6" color="success.main">🎯 Perfect Bonus</Typography>
                                <Typography variant="body2">
                                    <strong>Requirement:</strong> {configData.bonuses.perfectBonus.threshold}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Reward:</strong> {configData.bonuses.perfectBonus.bonus}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ border: '2px solid #9c27b0' }}>
                            <CardContent>
                                <Typography variant="h6" color="secondary.main">🔥 Streak Bonus</Typography>
                                <Typography variant="body2">
                                    <strong>Requirement:</strong> {configData.bonuses.streakBonus.threshold}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Reward:</strong> {configData.bonuses.streakBonus.bonus}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ConfigSection>

            {/* Calculation Examples */}
            <ConfigSection 
                title="Scoring Calculation Examples" 
                icon={<InfoIcon color="info" />}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    🧮 Quiz Example
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    10-question quiz, 85% score (Gold tier), completed 40% faster, Silver user tier:
                                </Typography>
                                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                                    <Typography variant="body2" component="div">
                                        • Base Points: 10 questions × 5 = <strong>50 points</strong><br/>
                                        • Performance Bonus: 50 × 1.5 (Gold) = <strong>75 points</strong><br/>
                                        • Speed Bonus: 75 × 0.3 = <strong>22.5 points</strong><br/>
                                        • Total Points: <strong>97.5 points</strong><br/><br/>
                                        • Base Credits: <strong>2 credits</strong><br/>
                                        • Performance Bonus: 2 × 1.5 = <strong>3 credits</strong><br/>
                                        • Speed Bonus: 3 × 0.3 = <strong>0.9 credits</strong><br/>
                                        • User Tier Bonus: 3.9 × 1.1 = <strong>4.29 credits</strong>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="secondary">
                                    🎯 Myths vs Facts Example
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    7-card game, 100% score (Platinum tier), perfect accuracy, Bronze user tier:
                                </Typography>
                                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                                    <Typography variant="body2" component="div">
                                        • Base Points: 7 cards × 5 = <strong>35 points</strong><br/>
                                        • Performance Bonus: 35 × 2.0 (Platinum) = <strong>70 points</strong><br/>
                                        • Perfect Bonus: 70 × 0.25 = <strong>17.5 points</strong><br/>
                                        • Total Points: <strong>87.5 points</strong><br/><br/>
                                        • Base Credits: <strong>3 credits</strong><br/>
                                        • Performance Bonus: 3 × 2.0 = <strong>6 credits</strong><br/>
                                        • Perfect Bonus: 6 × 0.25 = <strong>1.5 credits</strong><br/>
                                        • User Tier Bonus: 7.5 × 1.0 = <strong>7.5 credits</strong>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ConfigSection>
        </Box>
    );
};

export default QuizMvfConfig;