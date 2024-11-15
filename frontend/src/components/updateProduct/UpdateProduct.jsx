import { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import "./updateProduct.css";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateProduct() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    quantity: "",
    description: "",
    image: "",
  });
  const [publishError, setPublishError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        
        const res = await fetch(
          `http://localhost:8000/api/product/getProducts?postId=${postId}`
        );
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        const product = data.posts.find((post) => post._id === postId);
        if (product) {
          setFormData(product);
        } else {
          setPublishError("Product not found");
        }
      } catch (error) {
        setPublishError("Failed to fetch product details.");
        console.log(error.message);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage && !formData.image) {
      setPublishError("Please select an image");
      return;
    }
    // Use FormData to handle file uploads
    const updateData = new FormData();
    updateData.append("productName", formData.productName);
    updateData.append("price", formData.price);
    updateData.append("quantity", formData.quantity);
    updateData.append("description", formData.description);
    if (selectedImage) updateData.append("image", selectedImage);

    try {
      console.log(formData);
      const res = await fetch(
        `http://localhost:8000/api/product/updateProd/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          body: updateData,
        }
      );

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if(res.ok){
        
      alert("Product updated successfully!");
      setPublishError(null);
      navigate("/productList");
      }
    } catch (error) {
      setPublishError("Something went wrong during update.");
      console.log(error);
    }
  };



  return (
    <>
      <Navbar />
      <h1>Update Product</h1>
      <div className="add_contain">
        <div className="form-addpage">
          <form onSubmit={handleSubmit}>
            <h5>Total Price: FCFA</h5>
            <input
              type="text"
              placeholder="Product Name"
              value={formData.productName || ""}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              required
              className="add_input"
            />

            <input
              type="number"
              placeholder="Price"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              className="add_input"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity || ""}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
              className="add_input"
            />

            <input
              type="text"
              placeholder="Description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="add_input"
            />

            <input
              type="file"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              accept="image/*"
              className="add_input"
            />
            {formData.image && (
              <img
                src={`https://pos-backend-bs8i.onrender.com/uploads/${formData.image}`}
                alt="Product Image"
                style={{ width: "100px", height: "100px" }}
              />
            )}

            <button type="submit" className="add_input">
              Update
            </button>
          </form>
        </div>
        {publishError && <p>{publishError}</p>}
      </div>
    </>
  );
}
