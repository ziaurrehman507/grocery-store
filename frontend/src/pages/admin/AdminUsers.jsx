import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const AdminUsers = () => {
  const { user: currentUser } = useAuth(); // Rename to currentUser to avoid conflict
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(userId);
    try {
      await API.delete(`/admin/users/${userId}`);
      
      // Remove user from local state
      setUsers(users.filter(user => user._id !== userId));
      
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Error deleting user');
    } finally {
      setDeleting(null);
    }
  };

  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚫</div>
          <h3 className="text-xl font-semibold mb-4">Access Denied</h3>
          <p className="text-gray-600">Admin access required.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <div className="text-sm text-gray-600">
          Total Users: {users.length}
        </div>
      </div>

      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Joined</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">ID: {user._id.slice(-6)}</p>
                    </div>
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      {/* View User Details Button (Optional) */}
                      <button
                        onClick={() => alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nPhone: ${user.phone || 'N/A'}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-blue-600 rounded hover:bg-blue-50 transition"
                        title="View User Details"
                      >
                        View
                      </button>
                      
                      {/* Delete Button - Hide for current user and other admins */}
                      {user._id !== currentUser._id && user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          disabled={deleting === user._id}
                          className={`text-red-600 hover:text-red-800 text-sm px-2 py-1 border border-red-600 rounded hover:bg-red-50 transition ${
                            deleting === user._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete User"
                        >
                          {deleting === user._id ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                      
                      {/* Show message for current user or other admins */}
                      {(user._id === currentUser._id || user.role === 'admin') && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          {user._id === currentUser._id ? 'Current User' : 'Admin User'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Important Notes Section */}
      <div className="mt-6 card p-6 bg-yellow-50 border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• You cannot delete your own account</li>
          <li>• You cannot delete other admin accounts</li>
          <li>• When a user is deleted, their cart and order history will also be removed</li>
          <li>• This action cannot be undone</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminUsers;