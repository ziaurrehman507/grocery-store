import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/orders')
      ]);

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (user && user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚫</div>
          <h3 className="text-xl font-semibold mb-4">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <span className="text-gray-600">Welcome, {user?.name}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-green-50 border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Total Sales</p>
              <p className="text-2xl font-bold text-green-700">₹{(stats.totalSales || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pendingOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-red-50 border-red-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-red-700">{stats.outOfStockProducts || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <span className="text-2xl">🛍️</span>
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-purple-700">{stats.totalProducts || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-indigo-50 border-indigo-200">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg mr-4">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-indigo-700">{stats.totalUsers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.slice(0, 5).map(order => (
              <div key={order._id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">{order.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{order.totalPrice?.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
            
            {recentOrders.length === 0 && (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/admin/products" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <span className="text-xl">🛍️</span>
                </div>
                <div>
                  <h3 className="font-semibold">Manage Products</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                </div>
              </Link>

              <Link to="/admin/orders" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <span className="text-xl">📋</span>
                </div>
                <div>
                  <h3 className="font-semibold">Manage Orders</h3>
                  <p className="text-sm text-gray-600">View and update orders</p>
                </div>
              </Link>

              <Link to="/admin/users" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <span className="text-xl">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold">Manage Users</h3>
                  <p className="text-sm text-gray-600">View user accounts</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;