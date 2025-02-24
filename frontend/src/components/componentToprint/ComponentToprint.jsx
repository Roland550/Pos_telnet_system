import  { Component } from 'react';
import PropTypes from 'prop-types';
import './componentToprint.css';

import logo from '../../assets/ten1.png';
class ComponentToPrint extends Component {
    
  render() {
    const {cart, totalAmount} = this.props;
    return (
        
      <div ref={this.props.innerRef} className=''>
        <div className="brand text-center py-3">
          <img src={logo} alt="" className='image_receipt'/>
          <p className=''>Electronic, Networking, IT installation, Digital Literacy</p>
          <p className='fw-bold'>Date {new Date().toLocaleDateString()}</p>
          <p className='fw-bold'>Time {new Date().toLocaleTimeString()}</p>

          
          
          <p className='fw-bold'>Address: Malingo-Junction Buea</p>
          <p className='fw-bold'>phone: +237 671 827 893</p>
          <p className='fw-bold'>email: info@telnetcm.org</p>

          
        </div>

        <p className='fs-5 fw-bold'>=====================================================</p>
             <table className="table table-responsive ">
              <thead>
                <tr className='fw-bold'>
                  <td>#</td>
                  <td>Product</td>
                  <td>Price</td>
                  <td>Qty</td>
               
                </tr>
              </thead>
              <tbody>
                {cart
                  ? cart.map((cardProduct, key) => {
                      return (
                        <tr key={key}>
                          <td> {cardProduct.id}</td>
                          <td> {cardProduct.productName}</td>
                          <td className='fw-bold'> {cardProduct.price} cfa</td>
                          <td> {cardProduct.quantity}</td>
                         
                         
                        </tr>
                      );
                    })
                  : "No product in cart"}
              </tbody>
            </table>
            <p className='fs-5 fw-bold'>=====================================================</p>
            <h2 className="px-2 fw-bold">Total Amount: {totalAmount} cfa</h2>
            <p className='text-center  fs-5 fw-bold'>Thank you for Shopping with us,</p>
            <p className='text-center  fs-5 fw-bold'>Please come again.</p>
            
      </div>
    );
  }
}

ComponentToPrint.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      totalAmount: PropTypes.number.isRequired,
    })
  ).isRequired,
  totalAmount: PropTypes.number.isRequired,

  innerRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

export default ComponentToPrint;
