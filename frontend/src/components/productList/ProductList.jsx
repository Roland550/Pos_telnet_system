import { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import "./productList.css";

import { Link } from "react-router-dom";
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteToProductId, setDeleteToProductId] = useState(null);


 
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

  const handleDeletePost = async () => {
    
    try {
      const res = await fetch(
        `/api/product/deleteProduct/${deleteToProductId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setProducts((prev) =>
          prev.filter((post) => post._id !== deleteToProductId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
      
    fetchProducts();
  },[]);

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



  useEffect(() => {
    console.log(products);
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
                  .map((product, count) => (
                      <tr key={product.id}>
                        <td>{count + 1}</td>
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
                      <td>{product.description}</td>
                      
                    
                        
                      
                      <td>
                        <button className="del_btn" >
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
  </div>
);
   
}
