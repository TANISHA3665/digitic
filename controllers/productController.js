const slugify = require('slugify');
const Product = require('../models/productModel');
const { validateMongoDbId } = require('../utils/validateMongoDbId')

const createProduct = async (req, res) =>
{ 
    try
    {
        if (req?.body?.title)
        {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(400).send({error: error.message, stack: error.stack});
    };
};

const getAProduct = async (req, res) =>
{ 
    try
    {
        const { id } = req.params;
        validateMongoDbId(id);
        const product = await Product.findById(id);
        if (!product) throw new Error("No such product found");
        res.status(200).send(product);  
    } catch (error) {
        res.status(400).send({error: error.message, stack: error.stack});
    }
};

const getAllProducts = async (req, res) =>
{ 
    try {
        const product = await Product.find();
        if (!product) throw new Error("No products found");
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send({error: error.message, stack: error.stack});
    }
}

module.exports = {
    createProduct,
    getAProduct,
    getAllProducts
};