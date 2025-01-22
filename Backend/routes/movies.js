const express = require('express');
const router = express.Router();
const { db, storage } = require('../firebase.config');
const { collection, addDoc, getDocs, deleteDoc, doc } = require('firebase/firestore');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Get all movies
router.get('/', async (req, res) => {
    try {
        const moviesSnapshot = await getDocs(collection(db, 'movies'));
        const movies = [];
        moviesSnapshot.forEach(doc => {
            movies.push({ id: doc.id, ...doc.data() });
        });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new movie
router.post('/', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, description, category, year } = req.body;
        
        // Upload image
        const imageRef = ref(storage, `images/${Date.now()}-${req.files.image[0].originalname}`);
        await uploadBytes(imageRef, req.files.image[0].buffer);
        const imageUrl = await getDownloadURL(imageRef);
        
        // Upload video
        const videoRef = ref(storage, `videos/${Date.now()}-${req.files.video[0].originalname}`);
        await uploadBytes(videoRef, req.files.video[0].buffer);
        const videoUrl = await getDownloadURL(videoRef);
        
        // Add to Firestore
        const movieRef = await addDoc(collection(db, 'movies'), {
            title,
            description,
            category,
            year: parseInt(year),
            image: imageUrl,
            video: videoUrl,
            createdAt: new Date().toISOString()
        });
        
        res.status(201).json({
            id: movieRef.id,
            title,
            description,
            category,
            year,
            image: imageUrl,
            video: videoUrl
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete movie
router.delete('/:id', async (req, res) => {
    try {
        await deleteDoc(doc(db, 'movies', req.params.id));
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 