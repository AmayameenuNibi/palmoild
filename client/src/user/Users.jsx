import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const activeResponse = await axios.get('/api/users/active');
        setActiveUsers(activeResponse.data);

        const inactiveResponse = await axios.get('/api/users/inactive');
        setInactiveUsers(inactiveResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      const activeResponse = await axios.get('/api/users/active');
      setActiveUsers(activeResponse.data);

      const inactiveResponse = await axios.get('/api/users/inactive');
      setInactiveUsers(inactiveResponse.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="relative block md:w-full justify-center px-10 mb-5 items-center bg-white">        
        <ul className="flex">
          <li className={activeTab === 'active' ? 'active-tab' : ''}>
            <button className={`user-tab-btn ${activeTab === 'active' ? 'active' : ''}`} onClick={() => handleTabChange('active')}>Active Users</button>
          </li>
          <li className={activeTab === 'inactive' ? 'active-tab' : ''}>
            <button className={`user-tab-btn ${activeTab === 'inactive' ? 'active' : ''}`} onClick={() => handleTabChange('inactive')}>Inactive Users</button>
          </li>
        </ul>
      </div>
      {activeTab === 'active' && (
        <div className="relative block md:w-full justify-center px-10 mb-5 items-center bg-white">
          <div className="table-responsive">
          <table className="mt-4 w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">UserName</th>
                <th className="border border-gray-400 p-2">Company</th>
                <th className="border border-gray-400 p-2">Contact</th>
                <th className="border border-gray-400 p-2">Created At</th>
                <th className="border border-gray-400 p-2">Expired At</th>
                <th className="border border-gray-400 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
                {activeUsers.map((user) => {
                    const createdAtDate = new Date(user.createdAt);
                    const updatedAtDate = new Date(user.updatedAt);
                    const createdAtDateString = createdAtDate.toLocaleDateString();
                    const updatedAtDateString = updatedAtDate.toLocaleDateString();

                    return (
                        <tr key={user._id}>
                        <td className="border border-gray-400 p-2">{user.name}</td>
                        <td className="border border-gray-400 p-2">{user.company}</td>
                        <td className="border border-gray-400 p-2">{user.mobile}</td>
                        <td className="border border-gray-400 p-2">{createdAtDateString}</td>
                        <td className="border border-gray-400 p-2">{updatedAtDateString}</td>
                        <td className="border border-gray-400 p-2">
                            <button
                            onClick={() => handleDelete(user._id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            >
                            Delete
                            </button>
                        </td>
                        </tr>
                    );
                })}
            </tbody>
          </table>
          </div>
        </div>
      )}
      {activeTab === 'inactive' && (
        <div className="relative block md:w-full justify-center px-10 mb-5 items-center bg-white">
          <table className="mt-4 w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">UserName</th>
                <th className="border border-gray-400 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inactiveUsers.map((user) => (
                <tr key={user._id}>
                  <td className="border border-gray-400 p-2">{user.name}</td>
                  <td className="border border-gray-400 p-2">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
