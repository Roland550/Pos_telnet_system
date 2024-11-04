const Product = require("../model/product.model.js");
const errorHandler = require("../utils/error");
const fs = require("fs");
const path = require("path");

//create product
const createProduct = async (req, res, next) => {
    
 
  console.log('req.file:', req.file);  // Debugging file
    console.log('req.body:', req.body);  // Debugging body data
    const { productName, description, price, category } = req.body;

   
    

    if (!productName || !description || !price) {
      return next(errorHandler(400, "Fill all requirements and upload an image."));
    }

    const newProduct = new Product({
      productName,
      description,
      price,
      category,
      image: req.file.filename
    });

    try{
      await newProduct.save();
      return res.json("Product added successfully");;
    }catch(err){
      next(err);
    }
};

//get all products
const getProducts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Product.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.productName && { productName: req.query.productName }),
      ...(req.query.image && { image: req.query.image }),
      ...(req.query.description && { description: req.query.description }),
      ...(req.query.searchTerm && {
        $or: [
          { name: { $regex: req.query.searchTerm, $options: "i" } },
          { image: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Product.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Product.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
}

const deductProduct = async (req, res, next) => {
  const updates = req.body; // [{ id, quantity }, ...]

  try {
    for (const { id, quantity } of updates) {
      // Find the product and update its quantity
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${id} not found` });
      }

      if (product.quantity < quantity) {
        return res.status(400).json({ message: `Not enough quantity for product ${id}` });
      }

      // Deduct the quantity
      product.quantity -= quantity;
      await product.save();
    }

    res.status(200).json({ message: "Products deducted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deducting products." });
  }
}




module.exports = { createProduct, getProducts, deductProduct };
