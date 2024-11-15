import { useState, useEffect } from "react";
import Navbar from "../../navbar/Navbar";
import "./addProduct.css";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddProduct() {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const toastOptions = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }
  useEffect(() => {
    const priceValue = parseFloat(price) || 0;
    const quantityValue = parseInt(quantity) || 0;
    const total = priceValue * quantityValue;
    setTotalAmount(total);
  }, [price, quantity]);

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("totalAmount", totalAmount);
    if(!file || !productName || !price || !description || !quantity || !totalAmount){
      toast.error("All fields are required please",toastOptions);
      return;
    }
    axios
      .post("https://pos-backend-bs8i.onrender.com/addproduct", formData)
      .then((res) => {
        console.log(res);
        // reset the form or show a success message
        toast.success("Product added successfully",toastOptions);
        setFile(null);
        setProductName("");
        setPrice("");
        setQuantity("");
        setTotalAmount(0);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <>
      <Navbar />
      <h1>Add Product</h1>
      <div className="add_contain">
        <div className="form-addpage">
          <form onSubmit={handleUpload}>
          <h5>Total Price: {totalAmount.toFixed(2)} FCFA</h5>
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              
              className="add_input"
            />

            <input
              type="text"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              
              className="add_input"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setTotalAmount(parseFloat(e.target.value) * parseFloat(price));
              }}
             
              className="add_input"
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              
              className="add_input"
            />

            

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              name=""
              id=""
              className="add_input"
            />
            <button type="submit" className="add_input" disabled={loading}>
                {loading ?(
                  <>
                  <span className="spinner-border spinner-border-sm"></span>
                  </>
                ): "Add user"}
              </button>
          </form>
        </div>
      </div>
    </>
  );
}
