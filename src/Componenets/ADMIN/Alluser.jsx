import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
              className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
            >
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
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
              >
                Delete User
              </button>
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
