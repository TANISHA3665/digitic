const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const route = express.Router();


route.post('/', authMiddleware, isAdmin, productController.createProduct);
route.get('/', productController.getAllProducts);
route.get('/:id', productController.getAProduct);
route.put('/:id', authMiddleware, isAdmin, productController.updateAProduct);
route.delete('/:id', authMiddleware, isAdmin, productController.deleteAProduct);

module.exports = route;