import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SiginPage";
import POSDashboard from "./pages/POSDashboard";
import Navbar from "./navbar/Navbar";
import Products from "./components/product/Products";
import AddProduct from "./components/addProduct/AddProduct";
import Notification from "./components/notification/Notification";
import Users from "./components/users/Users";
import ProductList from "./components/productList/ProductList";
import SendMessage from "./components/sendMessage/SendMessage";
import Complains from "./components/complains/Complains";
import AddUsers from "./components/addUsers/AddUsers";

import PrivateRoute from "./components/PrivateRoute";
import AdmiControlPrivateRoute from "./components/AdmiControlPrivateRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/navbar" element={<Navbar />} />

        <Route element={<PrivateRoute />}>
          <Route path="/card" element={<Products />} />
          <Route path="/message" element={<SendMessage />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/complains" element={<Complains />} />
          <Route path="/adduser" element={<AddUsers />} />
          <Route path="/users" element={<Users />} />
        </Route>

        <Route element={<AdmiControlPrivateRoute />}>
          
        </Route>

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/pos" element={<POSDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
