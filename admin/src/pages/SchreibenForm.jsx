import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, PlusCircle, XCircle } from "lucide-react";

// const API_URL = "http://localhost:5000/api/schreiben";
const API_URL = "https://sahlab2.onrender.com/api/schreiben";

const initialFormState = {
  id: 1,
  themaName: "",
  punkt1: {
    id: 1,
    frage: "",
    antwort: ""
  },
  punkt2: {
    id: 2,
    frage: "",
    antwort: ""
  },
  punkt3: {
    id: 3,
    frage: "",
    antwort: ""
  }
};

const SchreibenForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      axios
        .get(`${API_URL}/${id}`)
        .then((res) => {
          setFormData(res.data);
          setLoading(false);
        })
        .catch(() => {
          alert("Failed to load data");
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePunktChange = (e, punkt, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [punkt]: {
        ...prev[punkt],
        [field]: field === 'id' ? Number(value) : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, formData);
        alert("SCHREIBEN updated!");
      } else {
        await axios.post(API_URL, formData);
        alert("SCHREIBEN created!");
      }
      navigate("/schreiben");
    } catch (err) {
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full text-white">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isEditMode ? "Edit SCHREIBEN" : "Add SCHREIBEN"}
          </h2>
          <button
            type="button"
            onClick={() => navigate("/schreiben")}
            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Save size={20} className="mr-2" />
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ID</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={formData.id}
                onChange={(e) => handleChange(e, "id")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thema Name</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={formData.themaName}
                onChange={(e) => handleChange(e, "themaName")}
                placeholder="Enter thema name"
                required
              />
            </div>
          </div>
        </div>

        {/* Punkt 1 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Punkt 1</h3>
          <div className="bg-gray-800 p-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={formData.punkt1.id}
                  onChange={(e) => handlePunktChange(e, "punkt1", "id")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Frage</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={formData.punkt1.frage}
                  onChange={(e) => handlePunktChange(e, "punkt1", "frage")}
                  placeholder="Enter question"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Antwort</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={formData.punkt1.antwort}
                  onChange={(e) => handlePunktChange(e, "punkt1", "antwort")}
                  placeholder="Enter answer"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Punkt 2 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Punkt 2</h3>
          <div className="bg-gray-800 p-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={formData.punkt2.id}
                  onChange={(e) => handlePunktChange(e, "punkt2", "id")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Frage</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={formData.punkt2.frage}
                  onChange={(e) => handlePunktChange(e, "punkt2", "frage")}
                  placeholder="Enter question"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Antwort</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={formData.punkt2.antwort}
                  onChange={(e) => handlePunktChange(e, "punkt2", "antwort")}
                  placeholder="Enter answer"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Punkt 3 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Punkt 3</h3>
          <div className="bg-gray-800 p-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={formData.punkt3.id}
                  onChange={(e) => handlePunktChange(e, "punkt3", "id")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Frage</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={formData.punkt3.frage}
                  onChange={(e) => handlePunktChange(e, "punkt3", "frage")}
                  placeholder="Enter question"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Antwort</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={formData.punkt3.antwort}
                  onChange={(e) => handlePunktChange(e, "punkt3", "antwort")}
                  placeholder="Enter answer"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SchreibenForm;
