/**
 * Collection Management Admin Panel
 * Allows admins to create, edit, delete, and manage Myths vs Facts collections
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Tabs,
    Tab,
    LinearProgress,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Analytics as AnalyticsIcon,
    Collections as CollectionsIcon,
    Visibility as ViewIcon,
    FileCopy as CloneIcon
} from '@mui/icons-material';
import collectionService from '../../services/collectionService.js';

const CollectionManagement = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('create'); // create, edit, view
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [analytics, setAnalytics] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Wildlife',
        repeatability: 'daily',
        isActive: true,
        customRewards: {
            bronze: { points: 25, credits: 2 },
            silver: { points: 35, credits: 3 },
            gold: { points: 50, credits: 4 },
            platinum: { points: 70, credits: 5 }
        }
    });

    useEffect(() => {
        loadCollections();
        loadAnalytics();
    }, []);

    const loadCollections = async () => {
        try {
            setLoading(true);
            const response = await collectionService.getAllCollections();
            setCollections(response.collections || []);
        } catch (error) {
            console.error('Failed to load collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async () => {
        try {
            // Mock analytics data - replace with actual API call
            setAnalytics({
                totalCollections: 12,
                activeCollections: 10,
                totalPlayers: 1250,
                avgCompletionRate: 78.5,
                topCollections: [
                    { name: 'Wildlife Conservation', plays: 450, completion: 85 },
                    { name: 'Marine Life Myths', plays: 380, completion: 72 },
                    { name: 'Forest Facts', plays: 320, completion: 91 }
                ]
            });
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    };

    const handleCreateCollection = () => {
        setDialogMode('create');
        setFormData({
            name: '',
            description: '',
            category: 'Wildlife',
            repeatability: 'daily',
            isActive: true,
            customRewards: {
                bronze: { points: 25, credits: 2 },
                silver: { points: 35, credits: 3 },
                gold: { points: 50, credits: 4 },
                platinum: { points: 70, credits: 5 }
            }
        });
        setOpenDialog(true);
    };

    const handleEditCollection = (collection) => {
        setDialogMode('edit');
        setSelectedCollection(collection);
        setFormData({
            name: collection.name,
            description: collection.description,
            category: collection.category || 'Wildlife',
            repeatability: collection.repeatability || 'daily',
            isActive: collection.is_active,
            customRewards: collection.custom_rewards || {
                bronze: { points: 25, credits: 2 },
                silver: { points: 35, credits: 3 },
                gold: { points: 50, credits: 4 },
                platinum: { points: 70, credits: 5 }
            }
        });
        setOpenDialog(true);
    };

    const handleViewCollection = (collection) => {
        setDialogMode('view');
        setSelectedCollection(collection);
        setOpenDialog(true);
    };

    const handleCloneCollection = async (collection) => {
        try {
            const cloneName = `${collection.name} (Copy)`;
            // Mock clone operation - replace with actual API call
            console.log('Cloning collection:', collection.id, 'as:', cloneName);
            await loadCollections(); // Reload after clone
        } catch (error) {
            console.error('Failed to clone collection:', error);
        }
    };

    const handleDeleteCollection = async (collectionId) => {
        if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
            try {
                // Mock delete operation - replace with actual API call
                console.log('Deleting collection:', collectionId);
                await loadCollections(); // Reload after delete
            } catch (error) {
                console.error('Failed to delete collection:', error);
            }
        }
    };

    const handleSaveCollection = async () => {
        try {
            if (dialogMode === 'create') {
                // Mock create operation - replace with actual API call
                console.log('Creating collection:', formData);
            } else if (dialogMode === 'edit') {
                // Mock update operation - replace with actual API call
                console.log('Updating collection:', selectedCollection.id, formData);
            }
            setOpenDialog(false);
            await loadCollections(); // Reload after save
        } catch (error) {
            console.error('Failed to save collection:', error);
        }
    };

    const getStatusChip = (isActive, completionRate) => {
        if (!isActive) return <Chip label="Inactive" color="default" size="small" />;
        if (completionRate > 80) return <Chip label="Popular" color="success" size="small" />;
        if (completionRate > 60) return <Chip label="Active" color="primary" size="small" />;
        return <Chip label="Low Engagement" color="warning" size="small" />;
    };

    const TabPanel = ({ children, value, index }) => (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CollectionsIcon color="primary" />
                Collection Management
            </Typography>

            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Collections" />
                <Tab label="Analytics" />
                <Tab label="Bulk Operations" />
            </Tabs>

            {/* Collections Tab */}
            <TabPanel value={selectedTab} index={0}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Active Collections</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateCollection}
                    >
                        Create Collection
                    </Button>
                </Box>

                {loading ? (
                    <LinearProgress />
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Cards</TableCell>
                                    <TableCell>Plays</TableCell>
                                    <TableCell>Completion Rate</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {collections.map((collection) => (
                                    <TableRow key={collection.id}>
                                        <TableCell>
                                            <Typography variant="subtitle2">{collection.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {collection.description?.substring(0, 50)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{collection.category || 'Wildlife'}</TableCell>
                                        <TableCell>{collection.total_questions || 0}</TableCell>
                                        <TableCell>{collection.total_plays || 0}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={collection.completion_rate || 0} 
                                                    sx={{ width: 60, height: 6 }}
                                                />
                                                <Typography variant="caption">
                                                    {collection.completion_rate || 0}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusChip(collection.is_active, collection.completion_rate)}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="View Details">
                                                <IconButton size="small" onClick={() => handleViewCollection(collection)}>
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit Collection">
                                                <IconButton size="small" onClick={() => handleEditCollection(collection)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Clone Collection">
                                                <IconButton size="small" onClick={() => handleCloneCollection(collection)}>
                                                    <CloneIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Collection">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleDeleteCollection(collection.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </TabPanel>

            {/* Analytics Tab */}
            <TabPanel value={selectedTab} index={1}>
                {analytics && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" color="primary">
                                        {analytics.totalCollections}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Collections
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" color="success.main">
                                        {analytics.activeCollections}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Active Collections
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" color="info.main">
                                        {analytics.totalPlayers.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Players
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" color="warning.main">
                                        {analytics.avgCompletionRate}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Avg Completion Rate
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Top Performing Collections
                                    </Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Collection</TableCell>
                                                    <TableCell>Total Plays</TableCell>
                                                    <TableCell>Completion Rate</TableCell>
                                                    <TableCell>Performance</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {analytics.topCollections.map((collection, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{collection.name}</TableCell>
                                                        <TableCell>{collection.plays}</TableCell>
                                                        <TableCell>{collection.completion}%</TableCell>
                                                        <TableCell>
                                                            <LinearProgress 
                                                                variant="determinate" 
                                                                value={collection.completion} 
                                                                sx={{ width: 100, height: 8 }}
                                                                color={collection.completion > 80 ? "success" : "primary"}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </TabPanel>

            {/* Bulk Operations Tab */}
            <TabPanel value={selectedTab} index={2}>
                <Alert severity="info" sx={{ mb: 3 }}>
                    Bulk operations allow you to manage multiple collections efficiently.
                </Alert>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Bulk Import Collections
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Import multiple collections from CSV or JSON files.
                                </Typography>
                                <Button variant="outlined" component="label">
                                    Choose File
                                    <input type="file" hidden accept=".csv,.json" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Bulk Export Collections
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Export all collections data for backup or analysis.
                                </Typography>
                                <Button variant="outlined">
                                    Export to CSV
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Collection Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogMode === 'create' ? 'Create New Collection' : 
                     dialogMode === 'edit' ? 'Edit Collection' : 'Collection Details'}
                </DialogTitle>
                <DialogContent>
                    {dialogMode === 'view' && selectedCollection ? (
                        <Box>
                            <Typography variant="h6">{selectedCollection.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {selectedCollection.description}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Category:</Typography>
                                    <Typography variant="body2">{selectedCollection.category || 'Wildlife'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Repeatability:</Typography>
                                    <Typography variant="body2">{selectedCollection.repeatability || 'Daily'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Total Cards:</Typography>
                                    <Typography variant="body2">{selectedCollection.total_questions || 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Status:</Typography>
                                    <Typography variant="body2">
                                        {selectedCollection.is_active ? 'Active' : 'Inactive'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Collection Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    disabled={dialogMode === 'view'}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    disabled={dialogMode === 'view'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        disabled={dialogMode === 'view'}
                                    >
                                        <MenuItem value="Wildlife">Wildlife</MenuItem>
                                        <MenuItem value="Marine">Marine Life</MenuItem>
                                        <MenuItem value="Forest">Forest Conservation</MenuItem>
                                        <MenuItem value="Climate">Climate Change</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Repeatability</InputLabel>
                                    <Select
                                        value={formData.repeatability}
                                        onChange={(e) => setFormData({...formData, repeatability: e.target.value})}
                                        disabled={dialogMode === 'view'}
                                    >
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                        <MenuItem value="unlimited">Unlimited</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        {dialogMode === 'view' ? 'Close' : 'Cancel'}
                    </Button>
                    {dialogMode !== 'view' && (
                        <Button onClick={handleSaveCollection} variant="contained">
                            {dialogMode === 'create' ? 'Create' : 'Save Changes'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CollectionManagement;