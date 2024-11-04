const express = require("express");

const verifyUser = require("../utils/verifyUser.js");
const multer  = require('multer')
const path = require('path')


const { createProduct, getProducts, deductProduct } = require("../controller/product.controller.js");
const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })



router.post("/createProduct", verifyUser, upload.single('file'), createProduct);
router.get("/getProducts", getProducts);
router.get("/deductProduct", verifyUser, deductProduct);

module.exports = router;