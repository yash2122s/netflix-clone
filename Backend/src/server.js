const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: 'dvtrsojsa', 
    api_key: '874763935182255',
    api_secret: 'Y1hLeVV_RihGpiNv08Na2Zxum_I'
});

// Test route
app.get('/', (req, res) => {
    res.json({ status: 'alive', message: 'Server is running!' });
});

// Upload video route
app.post('/api/upload/video', upload.single('video'), async (req, res) => {
    try {
        const fileStr = req.file.buffer.toString('base64');
        const uploadStr = `data:${req.file.mimetype};base64,${fileStr}`;
        
        const uploadResponse = await cloudinary.uploader.upload(uploadStr, {
            resource_type: 'video',
            folder: 'netflix-clone/videos'
        });
        
        res.json({ 
            success: true,
            url: uploadResponse.secure_url,
            message: 'Video uploaded successfully!'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to upload video'
        });
    }
});

// List videos route
app.get('/api/upload/videos/list', async (req, res) => {
    try {
        const result = await cloudinary.search
            .expression('resource_type:video AND folder:netflix-clone/videos')
            .sort_by('created_at', 'desc')
            .max_results(30)
            .execute();

        res.json(result);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch videos'
        });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
}); 