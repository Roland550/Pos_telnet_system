import { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import "./productList.css";

import { Link } from "react-router-dom";
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import del from "../../assets/delt.jpeg";
import { useSelector, useDispatch } from "react-redux";
import { deleteProductStart, deleteProductSuccess, deleteProductFailed } from "../../redux/user/userSlice.js";
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteToProductId, setDeleteToProductId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };
 
  const fetchProducts = async () => {
    axios
    .get("https://pos-backend-bs8i.onrender.com/api/product/getProducts")
    .then((response) => {
      // Check if the response contains the `posts` array and set it to `products`
      setProducts(response.data.posts || []);
    })
    .catch((error) => setError(error.message))
    .finally(() => setLoading(false));
  }

  const handleDeleteProduct = async () => {
    
    try {
      dispatch(deleteProductStart());
      const res = await fetch(
        `https://pos-backend-bs8i.onrender.com/deleteProduct/${deleteToProductId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setProducts((prev) => prev.filter((product) => product._id !== deleteToProductId));
        toast.success("Product deleted successfully", toastOptions)
        dispatch(deleteProductSuccess(data));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
      dispatch(deleteProductFailed())
    }
  };

  useEffect(() => {
      
    if(currentUser.isAdmin){
      fetchProducts();
    }
  },[currentUser]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
        
  //         const res = await fetch("http://localhost:8000/api/product/getProducts");
  //         const data = await res.json();
  //         setProducts(data);
  //         if (!res.ok) {
  //           setError(true);
  //           setLoading(false);
  //           return;
  //         }
  //         if (res.ok) {
  //           setProducts(data.posts|| []);
  //           setLoading(false);
  //           setError(false);
  //         }
  
  //     } catch (error) {
  //       setError(error.message   || "Something went wrong");
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

    console.log(products);


  useEffect(() => {
  }, [products]);
  return (
    <div>
      <Navbar />
      <h1>ProductList</h1>
      {loading && <p>Loading products...</p>}  {/* Loading message */}
    {error && <p>Error: {error}</p>}  
      <div className="list-items">
        <div className="search-list">
          <input
            type="text"
            name="search"
            id=""
            placeholder="Search..."
            className="input-list"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="total-item">
          <div className="totalNum" onClick={() => toast.info("This feature is coming soon...")}>
            <p >Filter</p>
          </div>
          <div className="totalNum" onClick={() => toast.info("This feature is coming soon...")}>
            <p>PDF</p>
          </div>
          <div className="totalNum" onClick={() => toast.info("This feature is coming soon...")}>
            <p>EXCEL</p>
          </div>
          <div className="totalNum" onClick={fetchProducts}>
            <p>Refresh</p>
          </div>
        </div>
      </div>
      {!loading && !error && (
      <div className="list-items">
        <div className=" mt-1 table-responsive bg-light ">
          <table className="table table-responsive table-light table-hover ">
            <thead>
              <tr>
                <th>N.</th>
                <th>Date</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th className="px-5">Images</th>
                <th>Description</th>
                <th>Delete</th>
                <th>Edit</th>
               
                
              </tr>
            </thead>
            <tbody>
            {Array.isArray(products) && products.length > 0 ? (
                  products
                  .filter((product) => {
                    if (searchTerm === "") {
                      return product;
                    } else if (
                      product.productName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return product;
                    }
                  })
                  .map((product, key) => (
                      <tr key={product.id}>
                        <td>{key + 1}</td>
                        <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                      <td>{product.productName}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <img
                           src={`https://pos-backend-bs8i.onrender.com/uploads/${product.image}`} alt={product.productName} 
                          
                         className="user-img"
                        />
                      </td>
                      
                      <td 
                        className="text-truncate"
                        style={
                          {
                          whiteSpace: "nowrap",
                          maxWidth: "180px",
                          maxHeight: "35px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          }
                          
                        }
                       >{product.description}</td>
                      
                     
                      
                    
                        
                      
                      <td>
                        <button className="del_btn" onClick={
                          ()=>{
                            setDeleteToProductId(product._id),
                          setShowModal(true)
                          }
                        } >
                          <MdDelete size={27} />
                        </button>
                      </td>
                      <td>
                        <Link className="edit_btn" to={`/update/${product._id}`}>
                        <MdEdit size={27} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No products found</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    )}
     {showModal && (
        <div className="modal-container" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={del} alt="" />
            <h4>Delete User</h4>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-buttons">
              <button onClick={()=>{
                // dispatch(deleteUser(deleteToUserId));
                console.log('delete button clicked');
                handleDeleteProduct();
                setShowModal(false);
              }}>Yes, I am sure</button>
              <button onClick={() => setShowModal(false)}>No, keep it</button>
            </div>
          </div>
        </div>

      )}
  </div>
);
   
}
