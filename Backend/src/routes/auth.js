const express = require('express');
const router = express.Router();
const { auth } = require('../firebase.config');
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get ID token
        const token = await user.getIdToken();
        
        res.json({
            token,
            user: {
                uid: user.uid,
                email: user.email
            }
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                uid: user.uid,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 