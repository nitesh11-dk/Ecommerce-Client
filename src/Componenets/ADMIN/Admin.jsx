import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function AdminPanel() {
  return (
    <div className="flex h-[93vh] overflow-hidden bg-gray-900 text-white">
      <div className="w-1/4 bg-gray-800 p-6 flex flex-col">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        <nav className="flex flex-col space-y-4">
          <Link
            to="/adminpanel/users"
            className="text-lg font-semibold hover:bg-gray-700 p-2 rounded-lg"
          >
            Users
          </Link>
          <Link
            to="/adminpanel/orders"
            className="text-lg font-semibold hover:bg-gray-700 p-2 rounded-lg"
          >
            Orders
          </Link>
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPanel;
