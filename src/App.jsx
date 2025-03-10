import React, { useContext } from "react";
import ShowProduct from "./Componenets/product/ShowProduct";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DetailedProduct from "./Componenets/product/DetailedProduct";
import Navbar from "./Componenets/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./Componenets/User/Register";
import Login from "./Componenets/User/Login";
import Profile from "./Componenets/User/Profile";
import ShoppingCart from "./Componenets/Cart";
import Address from "./Componenets/Address";
import Checkout from "./Componenets/Checkout";
import OrderConformation from "./Componenets/OrderConformation";
import ProductForm from "./Componenets/product/ProductForm";
import AppContext from "./context/AppContext";
import EditProduct from "./Componenets/product/EditProject";
import AdminPanel from "./Componenets/ADMIN/Admin";
import AllUsers from "./Componenets/ADMIN/Alluser";
import Orders from "./Componenets/ADMIN/Orders";
import OrderDetailed from "./Componenets/ADMIN/OrderDetailed";
import EditUser from "./Componenets/User/EditUser";
const App = () => {
  const { isAdmin } = useContext(AppContext);

  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<ShowProduct />} />
        <Route path="/product/:id" element={<DetailedProduct />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/address" element={<Address />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderconfirmation" element={<OrderConformation />} />
        <Route path="/edituser" element={<EditUser />} />

        {/* ? Admin  */}
        {isAdmin && (
          <>
            <Route path="/addproduct" element={<ProductForm />} />
            <Route path="/update/:id" element={<EditProduct />} />
            <Route path="/adminpanel" element={<AdminPanel />}>
              <Route path="/adminpanel/users" element={<AllUsers />} />
              <Route path="/adminpanel/orders" element={<Orders />} />
              <Route
                path="/adminpanel/orders/:id"
                element={<OrderDetailed />}
              />
            </Route>
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
