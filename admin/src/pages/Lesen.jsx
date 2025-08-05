import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:5000/api/lesen";

const Lesen = () => {
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
      setData(response.data); // Make sure your API returns an array of LESEN items
    } catch (err) {
      setError("Failed to fetch LESEN data.");
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
      "Are you sure you want to delete this LESEN item?"
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
          Manage LESEN
        </h2>
        {/* MODIFICATION HNA: Sta3melna Link */}
        <Link
          to="/lesen/new"
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={20} className="mr-2" />
          Add New
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          {/* ... thead ... */}
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.thema}
                </td>
                <td className="px-6 py-4">{item.themaTr}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {/* MODIFICATION HNA: Sta3melna Link */}
                  <Link
                    to={`/lesen/edit/${item._id}`}
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
      {/* ... Pagination controls ... */}
    </div>
  );
};

export default Lesen;
