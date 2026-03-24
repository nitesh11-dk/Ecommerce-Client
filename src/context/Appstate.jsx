import { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants/config.js";

const Appstate = (props) => {
  const [products, setProducts] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [reload, setReload] = useState(false);
  const [reload1, setReload1] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [userOrder, setUserOrder] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchedProduct = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/product/all`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  useEffect(() => {
    fetchedProduct();
    getCart();
    userProfile();
    getAddress();
  }, [token, reload]);

  useEffect(() => {}, [token, reload1]);

  // reload karne par logout nahi loga
  useEffect(() => {
    let lstoken = localStorage.getItem("token");
    if (lstoken) {
      setToken(lstoken);
      setIsLoggedIn(true);
      checkAdmin();
    }
  }, []);

  //  User
  const logoutUser = () => {
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    setCart(null);
    setUserAddress(null);
    setReload1(!reload1);
    localStorage.removeItem("token");
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Check if the login was successful
      if (response.data.success) {
        const { token, isAdmin } = response.data;
        // Save the token in localStorage FIRST so getCart/getAddress can read it
        localStorage.setItem("token", token);
        setToken(token);
        setIsLoggedIn(true);
        setIsAdmin(isAdmin); // Direct set from response
        // Trigger reload to fetch cart, address, profile
        setReload((prev) => !prev);
        toast.success(response.data.message);
        return { success: true, isAdmin }; // Return both status and role
      }
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        const { message } = error.response.data;
        toast.error(message || "Server error. Please try again.");
      } else if (error.request) {
        toast.error("No response from server. Please check your network.");
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    }
  };

  const loginAdmin = async (email, password, adminKey) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/loginadmin`,
        { email, password, adminKey },
        { headers: { "Content-Type": "application/json" } }
      );

      // Check if the login was successful
      if (response.data.success) {
        const { token, isAdmin } = response.data;
        // Set the token and login status
        setToken(token);
        setIsLoggedIn(true);
        setIsAdmin(isAdmin);
        // Save the token in localStorage
        localStorage.setItem("token", token);
        toast.success(response.data.message);
        return { success: true, isAdmin }; // Consistency
      } else {
        // Handle unexpected success = false cases
        toast.error(
          response.data.message || "Admin login failed. Please try again."
        );
        return false; // Login failed
      }
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        // Server responded with a status other than 200
        const { message } = error.response.data;
        toast.error(message || "Server error. Please try again.");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please check your network.");
      } else {
        // Something else happened
        toast.error(`Admin login failed: ${error.message}`);
      }
      return false; // Return false in case of error
    }
  };

  const checkAdmin = async () => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.get(`${BASE_URL}/user/checkadmin`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },

          withCredentials: true,
        });
        setIsAdmin(response.data.success);
      }
    } catch (err) {
      console.log("Error in checking that the user is admin or not ", err);
    }
  };

  const registerUser = async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        return true;
      } else {
        throw new Error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error.message);
      return false;
    }
  };

  const userProfile = async () => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.get(`${BASE_URL}/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        setUser(response.data.user);
      }
    } catch (err) {
      console.log("Error in feteching the user profile data", err);
    }
  };

  const updateProfile = async (formdata) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.post(`${BASE_URL}/user/editUser`, formdata, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        setUser(response.data.user);
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log("Error in feteching the user profile data", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.error("An error occurred while deleting the user.");
    }
  };

  //  ADMIN

  const toggleAdminStatus = async (userId) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      if (!token) {
        toast.error("Authentication token is missing.");
        return false;
      }

      const response = await axios.put(
        `${BASE_URL}/user/toggleuseradmin/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.isAdmin;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (err) {
      console.error("Error toggling admin status:", err.message);
      toast.error("Failed to toggle admin status.");
      return false;
    }
  };

  //  cart
  const getCart = async () => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.get(`${BASE_URL}/cart/user`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        setCart(response.data?.cart);
      }
    } catch (err) {
      // 404 means no cart yet — that's normal for a new user
      if (err.response?.status === 404) {
        setCart(null);
      } else {
        console.log("Error in fetching the user cart data ", err);
      }
    }
  };

  const addToCart = async (productId, selectedSize = null) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");

        let response = await axios.post(
          `${BASE_URL}/cart/add`,
          {
            productId: productId,
            selectedSize: selectedSize
          },
          {
            headers: {
              "Content-Type": "application/json",
              Auth: token,
            },
            withCredentials: true,
          }
        );
        toast.success(response.data.message, { toastId: "add-to-cart" });
        setReload((prev) => !prev);
      }
    } catch (err) {
      console.log("Error in addding items in the cart ", err);
    }
  };

  const decreaseQuantity = async (productId, selectedSize = null) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");

        let response = await axios.get(`${BASE_URL}/cart/--qty/${productId}`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          data: { selectedSize }, // Note: GET request with body technically possible but might be ignored by some servers, let's still pass it
          withCredentials: true,
        });
        setReload(!reload);
      }
    } catch (err) {
      console.log("Error in decreasing the quantity", err);
    }
  };

  const removeItem = async (productId, selectedSize = null) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");

        let response = await axios.delete(
          `${BASE_URL}/cart/remove/${productId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Auth: token,
            },
            data: { selectedSize },
            withCredentials: true,
          }
        );
        toast.success(response.data.message);
        setReload(!reload);
      }
    } catch (err) {
      console.log("Error in removing item from the cart ", err);
    }
  };

  const clearCart = async () => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");

        let response = await axios.delete(`${BASE_URL}/cart/clear`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        setReload(!reload);
      }
    } catch (err) {
      console.log("Error in clearning the cart ", err);
    }
  };

  const addAddress = async (address) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.post(`${BASE_URL}/address/add`, address, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        setReload(!reload);
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log("Error in adding the address ", err);
    }
  };
  const getAddress = async () => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.get(`${BASE_URL}/address/get`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        setUserAddress(response.data.address);
      }
    } catch (err) {
      // 404 means no address yet — that's normal for a new user
      if (err.response?.status === 404) {
        setUserAddress(null);
      } else {
        console.log("Error in getting the address ", err);
      }
    }
  };
  const getOrders = async () => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.get(`${BASE_URL}/payment/getOrders`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        setUserOrder(response.data.orders);
        console.log(response.data.orders);
      }
    } catch (err) {
      console.log("Error in getting the address ", err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.put(`${BASE_URL}/payment/order/status/${id}`, { orderStatus: status }, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        toast.success(response.data.message);
        setReload(!reload);
        return true;
      }
    } catch (err) {
      toast.error("Failed to update status");
      console.log("Error updating order status:", err);
      return false;
    }
  };

  const cancelOrder = async (id) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.put(`${BASE_URL}/payment/order/cancel/${id}`, {}, {
          headers: { "Content-Type": "application/json", Auth: token },
          withCredentials: true,
        });
        toast.success(response.data.message || "Order Cancelled. Your money will be refunded to your account within 2-3 working days.");
        setReload(!reload);
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
      return false;
    }
  };

  const updateRefundStatus = async (id, status) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.put(`${BASE_URL}/payment/order/refund/${id}`, { refundStatus: status }, {
          headers: { "Content-Type": "application/json", Auth: token },
          withCredentials: true,
        });
        toast.success(response.data.message);
        setReload(!reload);
        return true;
      }
    } catch (err) {
      toast.error("Failed to update refund status");
      return false;
    }
  };

  const addProduct = async (productdata) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.post(
          `${BASE_URL}/product/add`,
          productdata,
          {
            headers: {
              "Content-Type": "application/json",
              Auth: token,
            },
            withCredentials: true,
          }
        );
        // setUserOrder(response.data.orders)
        toast.success(response.data.message);
        setReload(!reload);
      }
    } catch (err) {
      console.log("Error in getting the address ", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.delete(`${BASE_URL}/product/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        // setUserOrder(response.data.orders)
        console.log(response.data);
        toast.success(response.data.message);
        setReload(!reload);
      }
    } catch (err) {
      console.log("Error in getting the address ", err);
    }
  };

  const updateProduct = async (id, data) => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let response = await axios.put(`${BASE_URL}/product/${id}`, data, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        // console.log(response.data)
        toast.success(response.data.message);
        setReload(!reload);
      }
    } catch (err) {
      console.log("Error in Updating the product ", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        searchFilter,
        setSearchFilter,
        token,
        isLoggedIn,
        loginUser,
        registerUser,
        logoutUser,
        user,
        userProfile,
        cart,
        clearCart,
        addToCart,
        decreaseQuantity,
        removeItem,
        addAddress,
        userAddress,
        getOrders,
        userOrder,
        getAddress,
        deleteProduct,

        loginAdmin,
        isAdmin,
        addProduct,
        updateProduct,
        products,
        updateProfile,
        handleDeleteUser,
        toggleAdminStatus,
        updateOrderStatus,
        cancelOrder,
        updateRefundStatus,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default Appstate;
