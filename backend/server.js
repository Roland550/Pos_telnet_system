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
app.use(cors());
// app.use(bodyParser.json());
app.use(cookieParser());


app.use('/uploads', express.static('uploads'));


mongoose
  .connect(process.env.MONGODB_URL, {
    
  })
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });



app.get("/getAllUsers", (req, res) => {
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
    
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

app.post("/addproduct", upload.single('file'), async(req, res, next) => {


  const { productName, description, price, category, quantity } = req.body;
  const totalAmount = price * quantity

  ProductModel.create({
    productName: req.body.productName,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    quantity,
    totalAmount,
    image: req.file.filename  
  })
  .then((users) => 

    res.json(users),
    console.log('product added successfully')
    
  )
  .catch((err) => 
    console.log(err)
  );
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
      
      // Save the updated product back to the database
      await product.save();
    }

    res.status(200).json({ message: "Products deducted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deducting products.", error: error.message });
  }
});



//User configuration
app.delete('/deleteUser/:userId', verifyUser, async (req, res) => {
  const { userId } = req.params.id;  

  try {
    const result = await UserModel.findByIdAndDelete(userId);
    
    if (!result) {
      return res.status(404).json({ status: "Error", message: "User not found" });
    }
    
    return res.json({ status: "Ok", message: "User deleted successfully" });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    return res.status(500).json({ status: "Error", message: "Failed to delete user" });
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
