import React, { useEffect, useState } from 'react';
import adminService from '../../services/admin.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiSearch, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = (params = {}) => {
    const query = { ...params };
    if (search) query.search = search;
    if (roleFilter) query.role = roleFilter;
    adminService.getUsers(query)
      .then(({ data }) => setUsers(data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]); // eslint-disable-line

  const handleApprove = async (id) => {
    try {
      await adminService.updateUser(id, { isApproved: true });
      toast.success('Wholesaler approved!');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await adminService.updateUser(id, { isActive: !isActive });
      toast.success(isActive ? 'User deactivated' : 'User activated');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-steel-800 mb-6">Manage Users</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-3 text-steel-400" />
          <input type="text" placeholder="Search users..." className="input-field pl-10"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="wholesaler">Wholesaler</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-steel-100 text-steel-600">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Joined</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-steel-100 hover:bg-steel-50">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-steel-500">{u.email}</td>
                <td className="p-3">
                  <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'wholesaler' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`badge ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {u.role === 'wholesaler' && !u.isApproved && (
                    <span className="badge bg-yellow-100 text-yellow-700 ml-1">Pending</span>
                  )}
                </td>
                <td className="p-3 text-steel-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    {u.role === 'wholesaler' && !u.isApproved && (
                      <button onClick={() => handleApprove(u._id)} className="text-green-500 hover:text-green-700" title="Approve">
                        <FiCheck />
                      </button>
                    )}
                    <button onClick={() => handleToggleActive(u._id, u.isActive)}
                      className={u.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}
                      title={u.isActive ? 'Deactivate' : 'Activate'}>
                      {u.isActive ? <FiX /> : <FiCheck />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
