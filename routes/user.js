const express = require('express');
const { register, login, getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, getAllUsers);
router.get('/users/:id', auth, getUser);
router.put('/users/:id', auth, updateUser);
router.delete('/users/:id', auth, deleteUser);

module.exports = router;
