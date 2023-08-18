const express = require('express');
const userController = require('../controllers/userController')
const router = express.Router();


router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/all-users', userController.getAllUsers);
router.get('/:id', userController.getAUser);
router.delete('/:id', userController.deleteAUser);
router.put('/:id', userController.updateAUser);

module.exports = router;