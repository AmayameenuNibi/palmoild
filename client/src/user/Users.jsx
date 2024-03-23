import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from "../constans";

const Users = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const activeResponse = await axios.get(`${ BACKEND_URL }api/users/active`);
        setActiveUsers(activeResponse.data);

        const inactiveResponse = await axios.get(`${ BACKEND_URL }api/users/inactive`);
        setInactiveUsers(inactiveResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${ BACKEND_URL }api/users/${userId}`);
      toast.success('User removed');
      const activeResponse = await axios.get(`${ BACKEND_URL }api/users/active`);
      setActiveUsers(activeResponse.data);

      const inactiveResponse = await axios.get(`${ BACKEND_URL }api/users/inactive`);
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
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />     
      <div className="relative block w-3/4 justify-center px-10 mb-5 mt-5 items-center">        
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
        <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center">
          <div className="table-responsive">
          <table className="mt-4 w-3/4 border-collapse border border-gray-400">
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
        <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center">
          <table className="mt-4 w-3/4 border-collapse border border-gray-400">
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
              {inactiveUsers.map((user) => {
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
      )}
    </div>
  );
};

export default Users;
