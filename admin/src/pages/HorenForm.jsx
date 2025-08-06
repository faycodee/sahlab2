import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, PlusCircle, XCircle } from "lucide-react";

// const API_URL = "http://localhost:5000/api/horen";
const API_URL = "https://sahlab2.onrender.com/api/horen";

const initialFormState = {
  teil1: [],
  teil2: [],
  teil3: [],
};

const HorenForm = () => {
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

  const handleChange = (e, teil, idx, field) => {
    let value = e.target.value;
    // Convert to number if field is id, antwort, or code
    if (["id", "antwort", "code"].includes(field)) {
      value = value === "" ? "" : Number(value);
    }
    setFormData((prev) => {
      const updated = { ...prev };
      updated[teil][idx][field] = value;
      return { ...updated };
    });
  };

  const handleAddTeil = (teil) => {
    setFormData((prev) => ({
      ...prev,
      [teil]: [
        ...prev[teil],
        {
          id:
            prev[teil].length > 0
              ? Math.max(...prev[teil].map((i) => Number(i.id) || 0)) + 1
              : 1,
          text: "",
          antwort: "",
          begründung: "",
          options: [],
        },
      ],
    }));
  };

  const handleRemoveTeil = (teil, idx) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[teil].splice(idx, 1);
      return { ...updated };
    });
  };

  const handleOptionChange = (e, teil, idx, optIdx, field) => {
    let value = e.target.value;
    if (["code"].includes(field)) {
      value = value === "" ? "" : Number(value);
    }
    setFormData((prev) => {
      const updated = { ...prev };
      updated[teil][idx].options[optIdx][field] = value;
      return { ...updated };
    });
  };

  const handleAddOption = (teil, idx) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[teil][idx].options.push({ id: "", code: "" });
      return { ...updated };
    });
  };

  const handleRemoveOption = (teil, idx, optIdx) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[teil][idx].options.splice(optIdx, 1);
      return { ...updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, formData);
        alert("HÖREN updated!");
      } else {
        await axios.post(API_URL, formData);
        alert("HÖREN created!");
      }
      navigate("/horen");
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
            {isEditMode ? "Edit HÖREN" : "Add HÖREN"}
          </h2>
          <button
            type="button"
            onClick={() => navigate("/horen")}
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

        {/* TEIL 1 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Teil 1</h3>
          {formData.teil1.map((item, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded mb-2">
              <div className="flex gap-2">
                <input
                  className="p-2 rounded bg-gray-700 text-white"
                  placeholder="Text"
                  value={item.text}
                  onChange={(e) => handleChange(e, "teil1", idx, "text")}
                />
                <input
                  className="p-2 rounded bg-gray-700 text-white"
                  placeholder="Antwort"
                  value={item.antwort}
                  onChange={(e) => handleChange(e, "teil1", idx, "antwort")}
                />
                <input
                  className="p-2 rounded bg-gray-700 text-white"
                  placeholder="Begründung"
                  value={item.begründung}
                  onChange={(e) => handleChange(e, "teil1", idx, "begründung")}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTeil("teil1", idx)}
                  className="text-red-400"
                >
                  <XCircle size={22} />
                </button>
              </div>
              {/* Options */}
              <div className="ml-4 mt-2">
                <span className="font-semibold">Options:</span>
                {item.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex gap-2 items-center mt-1">
                    <input
                      className="p-1 rounded bg-gray-700 text-white"
                      placeholder="Option ID"
                      value={opt.id}
                      onChange={(e) =>
                        handleOptionChange(e, "teil1", idx, optIdx, "id")
                      }
                    />
                    <input
                      className="p-1 rounded bg-gray-700 text-white"
                      placeholder="Code"
                      value={opt.code}
                      onChange={(e) =>
                        handleOptionChange(e, "teil1", idx, optIdx, "code")
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption("teil1", idx, optIdx)}
                      className="text-red-400"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption("teil1", idx)}
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={18} className="mr-1" /> Add Option
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddTeil("teil1")}
            className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
          >
            <PlusCircle size={20} className="mr-2" /> Add Teil 1
          </button>
        </div>

        {/* TEIL 2 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Teil 2</h3>
          {formData.teil2.map((item, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded mb-2">
              <div className="flex gap-2">
                <input
                  className="p-2 rounded bg-gray-700 text-white"
                  placeholder="Text"
                  value={item.text}
                  onChange={(e) => handleChange(e, "teil2", idx, "text")}
                />
                <input
                  className="p-2 rounded bg-gray-700 text-white"
                  placeholder="Antwort"
                  value={item.antwort}
                  onChange={(e) => handleChange(e, "teil2", idx, "antwort")}
                />
                <input
                  className="p-2 rounded bg-gray-700 text-white"
                  placeholder="Begründung"
                  value={item.begründung}
                  onChange={(e) => handleChange(e, "teil2", idx, "begründung")}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTeil("teil2", idx)}
                  className="text-red-400"
                >
                  <XCircle size={22} />
                </button>
              </div>
              {/* Options */}
              <div className="ml-4 mt-2">
                <span className="font-semibold">Options:</span>
                {item.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex gap-2 items-center mt-1">
                    <input
                      className="p-1 rounded bg-gray-700 text-white"
                      placeholder="Option ID"
                      value={opt.id}
                      onChange={(e) =>
                        handleOptionChange(e, "teil2", idx, optIdx, "id")
                      }
                    />
                    <input
                      className="p-1 rounded bg-gray-700 text-white"
                      placeholder="Code"
                      value={opt.code}
                      onChange={(e) =>
                        handleOptionChange(e, "teil2", idx, optIdx, "code")
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption("teil2", idx, optIdx)}
                      className="text-red-400"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption("teil2", idx)}
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={18} className="mr-1" /> Add Option
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddTeil("teil2")}
            className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
          >
            <PlusCircle size={20} className="mr-2" /> Add Teil 2
          </button>
        </div>

        {/* TEIL 3 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Teil 3</h3>
          {formData.teil3.map((item, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded mb-2">
              <div className="flex gap-2">
                <input
                  className="p-2 rounded bg-gray-700 text-white"
                  placeholder="Text"
                  value={item.text}
                  onChange={(e) => handleChange(e, "teil3", idx, "text")}
                />
                <input
                  className="p-2 rounded bg-gray-700 text-white"
                  placeholder="Antwort"
                  value={item.antwort}
                  onChange={(e) => handleChange(e, "teil3", idx, "antwort")}
                />
                <input
                  className="p-2 rounded bg-gray-700 text-white"
                  placeholder="Begründung"
                  value={item.begründung}
                  onChange={(e) => handleChange(e, "teil3", idx, "begründung")}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTeil("teil3", idx)}
                  className="text-red-400"
                >
                  <XCircle size={22} />
                </button>
              </div>
              {/* Options */}
              <div className="ml-4 mt-2">
                <span className="font-semibold">Options:</span>
                {item.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex gap-2 items-center mt-1">
                    <input
                      className="p-1 rounded bg-gray-700 text-white"
                      placeholder="Option ID"
                      value={opt.id}
                      onChange={(e) =>
                        handleOptionChange(e, "teil3", idx, optIdx, "id")
                      }
                    />
                    <input
                      className="p-1 rounded bg-gray-700 text-white"
                      placeholder="Code"
                      value={opt.code}
                      onChange={(e) =>
                        handleOptionChange(e, "teil3", idx, optIdx, "code")
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption("teil3", idx, optIdx)}
                      className="text-red-400"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption("teil3", idx)}
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={18} className="mr-1" /> Add Option
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddTeil("teil3")}
            className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
          >
            <PlusCircle size={20} className="mr-2" /> Add Teil 3
          </button>
        </div>
      </form>
    </div>
  );
};

export default HorenForm;
