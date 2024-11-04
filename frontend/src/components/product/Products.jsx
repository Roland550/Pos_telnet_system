import Navbar from "../../navbar/Navbar";
import { useEffect, useRef, useState } from "react";
import del from "../../assets/delete.png";

import "./product.css";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "../componentToprint/ComponentToprint";

/**
 * This component displays a list of products, allows adding/removing products to/from a cart,
 * calculates the total amount, and provides a functionality to print the cart content.
 */
export default function Products() {
  const [products, setProducts] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState("");
  const contentRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const handlePrint0 = useReactToPrint({ contentRef });
  //fecth the data from my fake api
  const fetchProducts = async () => {
    const response = await fetch("https://pos-backend-bs8i.onrender.com/getAllProducts");
    const data = await response.json();
    setProducts(data);  
  };

  //add products
  const adProduct = (product) => {
    // Check if the product already exists in the cart
    let findProduct = cart.find((item) => item._id === product._id);
    if (findProduct) {
      // Update quantity and total amount for the product already in the cart
      let newCart = cart.map((cartItem) =>
        cartItem._id === product._id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              totalAmount: cartItem.price * (cartItem.quantity + 1),
            }
          : cartItem
      );
      setCart(newCart);
    } else {
      // Add new product to the cart if not present
      let addingProduct = {
        ...product,
        quantity: 1,
        totalAmount: product.price,
      };
      setCart([...cart, addingProduct]);
    }
  };

  //remove product
  const removeProduct = async (product) => {
    const newCart = cart.filter((cartItem) => cartItem.id !== product.id);
    setCart(newCart);
  };

  const deductProductsFromDatabase = async () => {
    const updates = cart.map(item => ({
      id: item._id,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch("https://pos-backend-bs8i.onrender.com/deductProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (response.ok) {
        // Optionally, you could fetch the products again to refresh the data
        setMessage(data.message || "Products deducted successfully!");
        fetchProducts(); 
        setCart([]); // Clear the cart after successful deduction
      } else {
        setMessage(data.message || "Failed to deduct products");
        
      }
    } catch (error) {
      setMessage("An error occurred while deducting products.");
      console.error("Error:", error);
    }
  };

 

  const handlePrint = () => {
    handlePrint0();
    deductProductsFromDatabase();
  };


  useEffect(() => {
    fetchProducts();
  }, []);

 

  useEffect(() => {
    // setTotalAmount(cart.reduce((acc, item) => acc + item.totalAmount, 0));
    let newTotalAmount = 0
    cart.forEach(icart => {
      newTotalAmount = newTotalAmount + parseInt(icart.totalAmount);
    })
    setTotalAmount(newTotalAmount);
  }, [cart]);

 
  useEffect(() => {
    console.log(products);
  }, [products]);
  return (
    <>
      <Navbar />
      <div style={{ display: "none" }}>
        <ComponentToPrint
          cart={cart}
          totalAmount={totalAmount}
          innerRef={contentRef}
        />
      </div>
      {message && <p>{message}</p>}
      <div className="search-list">
          <input
            type="text"
            id="bill"
            placeholder="Search..."
            className="input-list"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      <div className="card-container">
     
        {/* Card */}

        <div className=" appear">
          <div className="category">
            <div className="category-name">
              <span>laptops</span>
            </div>
            <div className="category-name">
              <span>hardrives</span>
            </div>
            <div className="category-name">
              <span>keyboards</span>
            </div>
            <div className="category-name">
              <span>mouses</span>
            </div>
          </div>
          <div className="product-grid">
          {
              products.filter((product) =>{
                if(searchTerm === ""){
                  return product
                }else if(product.productName && product.productName.toLowerCase().includes(searchTerm.toLowerCase())){
                  return product
                }
                return false
              }).map((product,key) => (
                 <div key={key} className="product-card">
                <div
                  className="post-item "
                  onClick={() => adProduct(product)}
                >
                  <p className="name ">{product.productName}</p>
                  <img src={`https://pos-backend-bs8i.onrender.com/uploads/${product.image}`} alt={product.productName} />
                  
                  

                  <p className="price ">{product.price}fcfa</p>
                </div>
              </div>
              ))
            }
          </div>
        </div>

        {/* Calculator */}
        <div className="cart">
          <h1 className="px-2 text-dark text-center">Cart </h1>

          <table className="cart-table table table-responsive table-white table-hover">
            <thead>
              <tr>
                <th scope="col">N.</th>
                <th scope="col">Items</th>
                <th scope="col">Price</th>
                <th scope="col">Qties</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart
                ? cart.map((cardProduct, key) => {
                    
                  return    <tr key={key}>
                        <td> {cardProduct.id}</td>
                        <td> {cardProduct.productName}</td>
                        <td> {cardProduct.price}xaf</td>
                        <td> {cardProduct.quantity}</td>
                        {/* <td> {cardProduct.totalAmount}</td> */}
                        <td>
                          <button
                            className="btn btn-sm"
                            onClick={() => removeProduct(cardProduct)}
                          >
                            <img src={del} alt="" className="del-img" />
                          </button>
                        </td>
                      </tr>
                    
                  })
                : "No item in cart"}
            </tbody>
          </table>
          <h2 className="px-2 text-dark">Total Amount: {totalAmount}.00 xaf</h2>

          <div className="mx-3 py-3">
            <div className="mt-3">
              {totalAmount !== 0 ? (
                <div className="btn btn-primary" onClick={handlePrint}>
                  Pay Now
                </div>
              ) : (
                "please add item to cart"
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
