import  { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./soldReport.css"; 
import Navbar from "../../navbar/Navbar";

export default function SoldReportItems() {
    const [soldItems, setSoldItems] = useState([]);
    const contentRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
  const fetchSoldItems = async () => {
    try {
      const response = await fetch(
        "https://pos-backend-bs8i.onrender.com/getSoldItemsReport"
      );
      const data = await response.json();
      setSoldItems(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sold items:", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: "Daily_Sold_Items_Report",
  });

  useEffect(() => {
    fetchSoldItems();
    console.log(contentRef.current);
  }, []);

  
  const totalAmount = soldItems.reduce(
    (sum, item) => sum + item.soldQuantity * item.price,
    0
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
     <Navbar />
      <div className="sold-items-container">
        <h1>Sold Items Report</h1>
        <button onClick={handlePrint} className="print-button">
          Print Daily Report
        </button>
       <div>
       <div ref={contentRef} className="printable-content">
       <table className="sold-items-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Sold Quantity</th>
              <th>Price</th>
              <th>Date</th>
              <th>Time</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {soldItems.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.soldQuantity}</td>
                <td>{item.price} fcfa</td>
                <td> {new Date(item.createdAt).toLocaleDateString()}</td>
                <td> {new Date(item.createdAt).toLocaleTimeString()}</td>
                <td>{item.soldQuantity * item.price} fcfa</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Total Sold Amount: {totalAmount} fcfa</p>
       </div>
       </div>
      </div>
    </>
  )
}
