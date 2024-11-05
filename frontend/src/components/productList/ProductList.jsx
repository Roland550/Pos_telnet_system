import { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import "./productList.css";

import { Link } from "react-router-dom";
import axios from "axios";
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


 
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
          />
        </div>
        <div className="total-item">
          <div className="totalNum">
            <p >Filter</p>
          </div>
          <div className="totalNum">
            <p>PDF</p>
          </div>
          <div className="totalNum">
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
                <th>id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty left</th>
                <th>Image</th>
                <th>Description</th>
                <th>Action</th>
               
                
              </tr>
            </thead>
            <tbody>
            {Array.isArray(products) && products.length > 0 ? (
                  products.map((product, count) => (
                      <tr key={product.id}>
                        <td>{count + 1}</td>
                      
                      <td>{product.productName}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <img
                           src={`https://pos-backend-bs8i.onrender.com/uploads/${product.image}`} alt={product.productName} 
                          
                          style={{ width: "80px", height: "80px" }}
                        />
                      </td>
                      <td>{product.description}</td>
                      
                      <td>
                        
                      </td>
                      <td>
                        <Link to={`/edit/${product.id}`}>
                        X
                        </Link>
                      </td>
                      <td>
                        <Link to={`/update/${product._id}`}>
                        edit
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
