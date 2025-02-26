const express = require("express");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer  = require('multer')
const path = require('path')

const userRouter = require("./router/user.router.js");
const productRouter = require("./router/product.router.js");
const UserModel = require("./model/user.model.js");
const ProductModel = require("./model/product.model.js");
const errorHandler = require("./utils/error.js");
const verifyUser = require("./utils/verifyUser.js");
const app = express();


require('dotenv').config();
const PORT = process.env.PORT || 7000


app.use(express.json());
app.use(cors({
  origin: "https://pos-telnet-system-1.onrender.com", 
  credentials: true,
}));

app.use(cookieParser());


app.use('/uploads', express.static('uploads'));


mongoose
  .connect(process.env.MONGODB_URL, {
    
  })
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });



app.get("/getAllUsers",(req, res, next) => {
  UserModel.find()
    .then((users) => 
      res.json(users)
    )
    .catch((err) => 
      console.log(err)
    );
 
});

//Product configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
})

const upload = multer({ storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB file size limit
 })

app.post("/addproduct", upload.single('file'), async(req, res, next) => {


  try {
    const { productName, description, price, category, quantity } = req.body;
  const totalAmount = price * quantity;
  const file = req.file;
  

  const product = new ProductModel({
    productName,
    description,
    price,
    category,
    quantity,
    totalAmount,
    image: file.image ? file.image[0].filename: null,
  });

  const result = await product.save();
  res.status(201).json(result);
    
  } catch (error) {
    next(error);
    
  }

  // ProductModel.create({
  //   productName: req.body.productName,
  //   description: req.body.description,
  //   price: req.body.price,
  //   category: req.body.category,
  //   quantity,
  //   totalAmount,
  //   image: req.file.filename  
  // })
  // .then((users) => 

  //   res.json(users),
  //   console.log('product added successfully')
    
  // )
  // .catch((err) => 
  //   console.log(err)
  // );
})

  app.get("/getAllProducts", (req, res) => {
    ProductModel.find()
      .then((users) => 
        res.json(users)
      )
      .catch((err) => 
        console.log(err)
      );
  });



app.post("/deductProduct", async (req, res) => {
  const updates = req.body; // Expecting [{ id, quantity }, ...]

  try {
    // Ensure the request body is an array of updates
    if (!Array.isArray(updates) || !updates.every(update => update.id && update.quantity)) {
      return res.status(400).json({ message: "Invalid data format." });
    }

    // Iterate over each update
    for (const { id, quantity } of updates) {
      // Find the product by ID
      const product = await ProductModel.findById(id);
      
      // Check if product exists
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${id} not found.` });
      }

      // Check if the product has enough quantity to deduct
      if (product.quantity < quantity) {
        return res.status(400).json({ message: `Not enough quantity for product ${product.productName}. Available: ${product.quantity}` });
      }

      // Deduct the quantity
      product.quantity -= quantity;
      product.soldQuantity += quantity;
      
      // Save the updated product back to the database
      await product.save();
    }

    res.status(200).json({ message: "Products deducted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deducting products.", error: error.message });
  }
});

app.get("/getSoldItemsReport", async (req, res, next) => {
  try {
    // Fetch products where soldQuantity > 0
    const soldItems = await ProductModel.find({ soldQuantity: { $gt: 0 } });

    res.status(200).json(soldItems);
  } catch (error) {
    next(error);
  }
});


//User configuration
app.delete('/deleteUser/:userId', async (req, res, next) => {
  const id = req.params.userId
  try {
    const result = await UserModel.findByIdAndDelete(id);
    
    if (!result) {
      return next(errorHandler(404, "User not found"));
    }
    
    return next(errorHandler(200, "User deleted successfully"));
  } catch (error) {
    console.error(error);  // Log the error for debugging
    return next(errorHandler(500, "Error deleting user"));
  }
});
app.delete('/deleteProduct/:userId', async (req, res, next) => {
  const id = req.params.userId
  try {
    const result = await ProductModel.findByIdAndDelete(id);
    
    if (!result) {
      return next(errorHandler(404, "User not found"));
    }
    
    return next(errorHandler(200, "Product deleted successfully"));
  } catch (error) {
    console.error(error);  // Log the error for debugging
    return next(errorHandler(500, "Error deleting user"));
  }
});


 
 
 


app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

//erroMiddlewre
app.use((err, req, res, next) =>{
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
   success: false,
   statusCode,
   message,
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
