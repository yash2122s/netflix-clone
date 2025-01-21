// Remove firebase import and only test Cloudinary
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary with your actual credentials
cloudinary.config({ 
    cloud_name: 'dvtrsojsa', 
    api_key: '874763935182255',
    api_secret: 'Y1hLeVV_RihGpiNv08Na2Zxum_I'
});

// Test function
async function testCloudinaryConnection() {
    try {
        // Simple test upload with a test URL
        const testImage = "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg";
        const result = await cloudinary.uploader.upload(testImage);
        console.log('Cloudinary Connection Test: SUCCESS ✅');
        console.log('Image uploaded successfully:', result.url);
    } catch (error) {
        console.error('Cloudinary Connection Test: FAILED ❌');
        console.error('Error:', error.message);
    }
}

// Run the test
testCloudinaryConnection(); 