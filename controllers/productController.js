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
    } catch (error)
    {
        res.status(400).send({error: error.message, stack: error.stack});
    };
};

const getAllProducts = async (req, res) =>
{ 
    try
    {
        // const queryObj = req.query;  // directly assigning the reference --> any change will be reflected in the original query object

        const queryObj = { ...req.query };  // shallow copy ---> as we don't want to modify the  original query object 
        console.log(queryObj);
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(field => delete queryObj[field]);

        // Filtering

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b{gte|gt|lte|lt}\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryString));

        // Sorting

        if (req.query.sort)
        {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else
        {
            query = query.sort("-createdAt");
        }

        // Limiting the fields

        if (req.query.fields)
        {
            console.log("Inside field: " + req.query.fields)
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else
        {
            query = query.select("-__v");
        }

        // pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page)
        {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page does not exist");
        }

        const product = await query;
        if (!product) throw new Error("No products found");
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send({error: error.message, stack: error.stack});
    }
}

const updateAProduct = async (req, res) =>
{
    try
    {
        const { id } = req.params;
        validateMongoDbId(id);
        if (req?.body?.title)
        {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) throw new Error("No such product found");
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(400).send({error: error.message, stack: error.stack});
    }
}

const deleteAProduct = async (req, res) =>
{
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) throw new Error("No such product found");
        res.status(200).send({ message: "Product deleted successfully", deletedProduct: deletedProduct });
    } catch (error) {
        res.status(400).send({error: error.message, stack: error.stack});
    }
}

module.exports = {
    createProduct,
    getAProduct,
    getAllProducts,
    updateAProduct,
    deleteAProduct
}