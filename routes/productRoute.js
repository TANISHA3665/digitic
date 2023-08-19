const express = require('express');
const productController = require('../controllers/productController');
const route = express.Router();


route.post('/', productController.createProduct);
route.get('/', productController.getAllProducts);
route.get('/:id', productController.getAProduct);

module.exports = route;