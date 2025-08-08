const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateToken, requireAdmin, requireActiveUser } = require('../middleware/auth');

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.get('/profile', authenticateToken, requireActiveUser, UserController.getCurrentUser);
router.put('/profile', authenticateToken, requireActiveUser, UserController.updateUser);
router.put('/profile/password', authenticateToken, requireActiveUser, UserController.updatePassword);

// Admin routes
router.get('/', authenticateToken, requireAdmin, UserController.getAllUsers);
router.get('/:id', authenticateToken, requireAdmin, UserController.getUserById);
router.put('/:id', authenticateToken, requireAdmin, UserController.updateUser);
router.put('/:id/password', authenticateToken, requireAdmin, UserController.updatePassword);
router.delete('/:id', authenticateToken, requireAdmin, UserController.deleteUser);
router.put('/:id/toggle-status', authenticateToken, requireAdmin, UserController.toggleUserStatus);

module.exports = router;
