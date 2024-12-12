import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';
import AppContext from '../../context/AppContext';
import { toast } from 'react-toastify';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleAdminStatus, user } = useContext(AppContext); // Get currentUser from context
  let currentUser = user;
  const [reload, setReload] = useState(false);

  const fetchAllUsers = async () => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/user/all`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      const newStatus = await toggleAdminStatus(userId);
      if (newStatus !== false) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isAdmin: newStatus } : user
          )
        );
      }
      setReload(!reload);
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast.error("Failed to toggle admin status.");
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
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.error("An error occurred while deleting the user.");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [reload]);

  if (loading) {
    return <div className="text-white bg-gray-900 min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-200">All Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-gray-800 rounded-lg shadow-lg p-6 py-8 border border-gray-700 relative"
            >
              {user.isAdmin && (
                <div className="absolute  top-1 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Admin
                </div>
              )}
              {currentUser && currentUser._id === user._id && (
                <span className="absolute rounded-full top-1 left-1 bg-green-500 text-white text-xl font-semibold   h-6 w-6 flex items-center justify-center ">
                  U
                </span>
              )}
              <h2 className="text-2xl font-bold mb-4 text-gray-100">{user.name}</h2>
              <p className="text-lg text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">Email:</span> {user.email}
              </p>
              <p className="text-lg text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">Role:</span> {user.role}
              </p>
              <p className="text-lg text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">Is Admin:</span> {user.isAdmin ? "Yes" : "No"}
              </p>
              <p className="text-lg text-gray-400 mb-4">
                <span className="font-semibold text-gray-300">Created At:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-4">
                {
                  currentUser && currentUser._id !== user._id && (
                    <button
                  onClick={() => handleToggleAdmin(user._id)}
                  className={`px-4 py-2 rounded transition duration-300 ${
                    user.isAdmin ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                </button>
                  )
                }
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                >
                  Delete User
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-lg text-gray-400">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}

export default AllUsers;
