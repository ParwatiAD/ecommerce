const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = "YourSuperSecretKey";

// Route to generate JWT
router.post('/api/login', (req, res) => {
    const { username } = req.body;

    if (username) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "Login successful", token });
    } else {
        res.status(400).json({ message: "Username is required" });
    }
});

// Route to verify JWT
router.get('/protected', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
        res.json({ message: "Protected data", user: decoded });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;