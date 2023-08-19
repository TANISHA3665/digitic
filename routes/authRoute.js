const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController')
const router = express.Router();


router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/all-users', userController.getAllUsers);
router.get('/refresh', userController.handleRefreshToken);
router.get('/logout', userController.logoutUser);
router.get('/:id', authMiddleware, isAdmin, userController.getAUser);
router.delete('/:id', userController.deleteAUser);
router.put('/:id', authMiddleware, userController.updateAUser);
router.put('/block-user/:id', authMiddleware, isAdmin, userController.blockAUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, userController.unblockAUser);


module.exports = router;