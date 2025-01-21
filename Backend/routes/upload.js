const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: 'dvtrsojsa', 
    api_key: '874763935182255',
    api_secret: 'Y1hLeVV_RihGpiNv08Na2Zxum_I'
});

// List all videos
router.get('/videos/list', async (req, res) => {
    try {
        const result = await cloudinary.search
            .expression('resource_type:video AND folder:netflix-clone/videos')
            .sort_by('created_at', 'desc')
            .max_results(30)
            .execute();

        console.log('Videos found:', result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch videos',
            error: error.message
        });
    }
});

// Upload video route
router.post('/video', upload.single('video'), async (req, res) => {
    try {
        // Convert buffer to base64
        const fileStr = req.file.buffer.toString('base64');
        const uploadStr = `data:${req.file.mimetype};base64,${fileStr}`;
        
        // Upload to cloudinary
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

// Upload thumbnail/image route
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        // Convert buffer to base64
        const fileStr = req.file.buffer.toString('base64');
        const uploadStr = `data:${req.file.mimetype};base64,${fileStr}`;
        
        // Upload to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(uploadStr, {
            folder: 'netflix-clone/images'
        });
        
        res.json({ 
            success: true,
            url: uploadResponse.secure_url,
            message: 'Image uploaded successfully!'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to upload image'
        });
    }
});

module.exports = router; 