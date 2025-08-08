import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Use your local API for Hören
const API_URL = window.location.hostname === "localhost" ? "http://localhost:5000/api/horen":import.meta.env.VITE_API_URL +"/api/horen";


const Horen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch HÖREN data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const confirmDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this HÖREN item?"
    );
    if (!confirmed) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
        {error}
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Manage HÖREN
        </h2>
        <Link
          to="/horen/new"
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={20} className="mr-2" />
          Add New
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead>
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Teil 1 Count</th>
              <th className="px-6 py-3">Teil 2 Count</th>
              <th className="px-6 py-3">Teil 3 Count</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{item._id}</td>
                <td className="px-6 py-4">{item.teil1?.length || 0}</td>
                <td className="px-6 py-4">{item.teil2?.length || 0}</td>
                <td className="px-6 py-4">{item.teil3?.length || 0}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {/* You can add edit functionality here */}
                  <Link
                    to={`/horen/edit/${item._id}`}
                    className="p-2 text-blue-500 hover:text-blue-700 inline-block"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => confirmDelete(item._id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        >
          <ChevronLeft size={18} />
          Prev
        </button>
        <span className="mx-2 text-gray-700 dark:text-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Horen;
