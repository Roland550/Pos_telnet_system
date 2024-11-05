
import Navbar from "../../navbar/Navbar"
import "./updateProduct.css"
export default function UpdateProduct() {
  return (
    <>
      <Navbar />
      <h1>Apdate Product</h1>
      <div className="add_contain">
        <div className="form-addpage">
          <form>
          <h5>Total Price:  FCFA</h5>
            <input
              type="text"
              placeholder="Product Name"
             
              required
              className="add_input"
            />

            <input
              type="text"
              placeholder="Price"
              
              required
              className="add_input"
            />

            <input
              type="number"
              placeholder="Quantity"
             
              
              required
              className="add_input"
            />

            <input
              type="text"
              placeholder="Description"
              
              required
              className="add_input"
            />

            

            <input
              type="file"
             
              name=""
              id=""
              className="add_input"
            />
            <button type="submit" className="add_input">Upload</button>
          </form>
        </div>
      </div>
    </>
  )
}
