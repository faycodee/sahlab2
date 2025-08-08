import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, PlusCircle, XCircle } from "lucide-react";

// A more robust initial state to prevent errors from missing API data
const initialFormState = {
  id: 0,
  thema: "",
  themaTr: "",
  teile: {
    teil1: [],
    teil2: [],
    teil3: [],
  },
  sprachb: {
    teil1: [],
    teil2: [],
  },
};

// --- Reusable and Enhanced Form Components ---

// Custom Input component with error handling and focus management
const Input = ({ label, name, error, onFocus, onBlur, ...props }) => (
  <div className="mb-4 w-full">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-300 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
      className={`w-full bg-gray-700 border rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 transition-colors ${
        error ? "border-red-500" : "border-gray-600"
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

// Custom TextArea with the same enhancements
const TextArea = ({ label, name, error, onFocus, onBlur, ...props }) => (
  <div className="mb-4 w-full">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-300 mb-1"
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
      className={`w-full bg-gray-700 border rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 transition-colors ${
        error ? "border-red-500" : "border-gray-600"
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

const LesenForm = () => {
  const API_URL = window.location.hostname === "localhost" ? "http://localhost:5000/api/lesen":import.meta.env.VITE_API_URL +"/api/lesen";

  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(id);

  // Deep merge fetched data with initial state to ensure all keys exist
  const mergeData = (fetchedData) => {
    const merged = { ...initialFormState };
    for (const key in fetchedData) {
      if (
        typeof fetchedData[key] === "object" &&
        fetchedData[key] !== null &&
        !Array.isArray(fetchedData[key])
      ) {
        // Handle nested objects like teile and sprachb
        if (key === 'teile' || key === 'sprachb') {
          merged[key] = { ...initialFormState[key] };
          for (const subKey in fetchedData[key]) {
            if (Array.isArray(fetchedData[key][subKey])) {
              merged[key][subKey] = fetchedData[key][subKey];
            } else {
              merged[key][subKey] = [];
            }
          }
        } else {
        merged[key] = { ...initialFormState[key], ...fetchedData[key] };
        }
      } else {
        merged[key] = fetchedData[key];
      }
    }
    return merged;
  };

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      axios
        .get(`${API_URL}/${id}`)
        .then((response) => {
          setFormData(mergeData(response.data));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch data for editing", error);
          alert("Could not load existing data. Please try again.");
          setLoading(false);
        });
    } else {
      // Restore draft if exists
      const draft = localStorage.getItem("lesenFormDraft");
      if (draft) {
        setFormData(JSON.parse(draft));
      }
    }
  }, [id, isEditMode]);

  // --- Event Handlers with stopPropagation to prevent "logout" issue ---
  const handleFocus = useCallback((e) => e.stopPropagation(), []);
  const handleBlur = useCallback((e) => e.stopPropagation(), []);

  // --- Immutable State Update Handlers ---

  // Generic handler for simple inputs, using a deep copy for safety.
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev)); // Deep copy
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  }, []);

  // Generic handler for array inputs, ensuring immutability.
  const handleArrayChange = useCallback((path, index, field, value) => {
    setFormData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      path.forEach((key) => {
        current = current[key];
      });
      if (field) {
        current[index] = { ...current[index], [field]: value };
      } else {
        current[index] = value;
      }
      return newState;
    });
  }, []);

  // Handler for deeply nested arrays (e.g., question options)
  const handleNestedArrayChange = useCallback(
    (path, index, nestedArrayName, nestedIndex, field, value) => {
      setFormData((prev) => {
        const newState = JSON.parse(JSON.stringify(prev));
        let parentArray = newState;
        path.forEach((key) => {
          parentArray = parentArray[key];
        });
        const parentObject = parentArray[index];
        parentObject[nestedArrayName][nestedIndex] = {
          ...parentObject[nestedArrayName][nestedIndex],
          [field]: value,
        };
        return newState;
      });
    },
    []
  );

  // Generic handler to add an item to an array
  const addArrayItem = useCallback((path, newItem) => {
    setFormData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]].push(newItem);
      return newState;
    });
  }, []);

  // Generic handler to remove an item from an array
  const removeArrayItem = useCallback((path, index) => {
    setFormData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]].splice(index, 1);
      return newState;
    });
  }, []);

  // --- ID Generation Helpers ---
  const getNextNumericId = (arr, start = 1) =>
    arr.length > 0 ? Math.max(...arr.map((i) => i.id)) + 1 : start;
  const getNextZeroNumericId = (arr) =>
    arr.length > 0 ? Math.max(...arr.map((i) => i.id)) + 1 : 0;
  const getNextAlphaId = (arr) => {
    if (!arr.length) return "a";
    const last = arr[arr.length - 1].id;
    return String.fromCharCode(last.charCodeAt(0) + 1);
  };

  // --- Form Validation and Submission ---
  const validate = () => {
    const newErrors = {};
    if (!formData.thema) newErrors.thema = "Thema is required.";
    if (!formData.themaTr) newErrors.themaTr = "Thema TR is required.";
    
    // Validate that arrays exist and are properly structured
    if (!Array.isArray(formData.teile.teil1)) {
      newErrors["teile.teil1"] = "Teil 1 must be an array.";
    }
    if (!Array.isArray(formData.teile.teil2)) {
      newErrors["teile.teil2"] = "Teil 2 must be an array.";
    }
    if (!Array.isArray(formData.teile.teil3)) {
      newErrors["teile.teil3"] = "Teil 3 must be an array.";
    }
    if (!Array.isArray(formData.sprachb.teil1)) {
      newErrors["sprachb.teil1"] = "Sprachb Teil 1 must be an array.";
    }
    if (!Array.isArray(formData.sprachb.teil2)) {
      newErrors["sprachb.teil2"] = "Sprachb Teil 2 must be an array.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Please fix the errors before saving.");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, formData);
        alert("LESEN item updated successfully!");
      } else {
        await axios.post(API_URL, formData);
        alert("LESEN item created successfully!");
      }
      localStorage.removeItem("lesenFormDraft");
      navigate("/lesen");
    } catch (err) {
      console.error("Failed to save LESEN item", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred.";
      alert(`Failed to save LESEN item: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode)
    return <p className="text-center text-white">Loading form...</p>;

  const renderTabButton = (tabName, label) => (
    <button
      type="button"
      onClick={() => setActiveTab(tabName)}
      className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
        activeTab === tabName
          ? "border-indigo-500 text-indigo-400"
          : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-2xl w-full text-white">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold">
            {isEditMode ? "Edit LESEN Item" : "Create New LESEN Item"}
          </h2>
          <div className="flex">
            <button
              type="button"
              onClick={() => navigate("/lesen")}
              className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-transform duration-200 ease-in-out hover:scale-105 mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(
                  "lesenFormDraft",
                  JSON.stringify(formData)
                );
                alert("Draft saved locally!");
              }}
              className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-transform duration-200 ease-in-out hover:scale-105 mr-4"
            >
              <Save size={20} className="mr-2" />
              Save in Local
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} className="mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="mb-6 border-b border-gray-700">
          <nav className="-mb-px flex flex-wrap space-x-4">
            {renderTabButton("main", "Main Info")}
            {renderTabButton("teil1", "Teil 1")}
            {renderTabButton("teil2", "Teil 2")}
            {renderTabButton("teil3", "Teil 3")}
            {renderTabButton("sprachb", "Sprachbausteine")}
          </nav>
        </div>

        {/* --- Tab Content --- */}
        <div className="animate-fade-in">
          {activeTab === "main" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="ID"
                name="id"
                type="number"
                value={formData.id}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={errors.id}
              />
              <Input
                label="Thema"
                name="thema"
                value={formData.thema}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={errors.thema}
              />
              <Input
                label="Thema TR"
                name="themaTr"
                value={formData.themaTr}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={errors.themaTr}
              />
            </div>
          )}

          {activeTab === "teil1" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                Teil 1 Details
              </h3>
              
              {/* Teil 1 Items */}
              {formData.teile.teil1.map((teil1Item, teil1Index) => (
                <div key={teil1Index} className="p-4 my-4 bg-gray-800 rounded-md border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Teil 1 Item #{teil1Index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem(["teile", "teil1"], teil1Index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <XCircle size={22} />
                    </button>
                  </div>
                  
              <Input
                label="Titel"
                    value={teil1Item.titel || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        ["teile", "teil1"],
                        teil1Index,
                        "titel",
                        e.target.value
                      )
                    }
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <Input
                label="Photo URL"
                    value={teil1Item.photo || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        ["teile", "teil1"],
                        teil1Index,
                        "photo",
                        e.target.value
                      )
                    }
                onFocus={handleFocus}
                onBlur={handleBlur}
              />

              {/* Überschriften */}
              <div className="mt-6">
                    <h5 className="font-semibold mb-2">Überschriften</h5>
                    {(teil1Item.Überschriften || []).map((item, index) => (
                  <div
                    key={index}
                        className="flex items-center gap-4 p-3 my-2 bg-gray-700 rounded-md"
                  >
                    <Input
                      label="ID"
                          value={item.id || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil1"],
                              teil1Index,
                              "Überschriften",
                          index,
                          "id",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Text"
                          value={item.text || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil1"],
                              teil1Index,
                              "Überschriften",
                          index,
                          "text",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem(
                              ["teile", "teil1", teil1Index, "Überschriften"],
                          index
                        )
                      }
                      className="mt-6 text-red-500 hover:text-red-400"
                    >
                          <XCircle size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                        addArrayItem(
                          ["teile", "teil1", teil1Index, "Überschriften"],
                          {
                            id: getNextAlphaId(teil1Item.Überschriften || []),
                      text: "",
                          }
                        )
                  }
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={20} className="mr-2" /> Add Überschrift
                </button>
              </div>

              {/* Texte */}
              <div className="mt-6">
                    <h5 className="font-semibold mb-2">Texte</h5>
                    {(teil1Item.Texte || []).map((item, index) => (
                  <div
                    key={index}
                        className="p-4 my-2 bg-gray-700 rounded-md border border-gray-600"
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                              removeArrayItem(
                                ["teile", "teil1", teil1Index, "Texte"],
                                index
                              )
                        }
                        className="text-red-500 hover:text-red-400"
                      >
                            <XCircle size={20} />
                      </button>
                    </div>
                    <Input
                      label="ID"
                      type="number"
                          value={item.id || 0}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil1"],
                              teil1Index,
                              "Texte",
                          index,
                          "id",
                          parseInt(e.target.value) || 0
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <TextArea
                      label="Text"
                          value={item.text || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil1"],
                              teil1Index,
                              "Texte",
                          index,
                          "text",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      rows="4"
                    />
                    <Input
                      label="Antwort"
                          value={item.antwort || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil1"],
                              teil1Index,
                              "Texte",
                          index,
                          "antwort",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Fazit"
                          value={item.fazit || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil1"],
                              teil1Index,
                              "Texte",
                          index,
                          "fazit",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                        addArrayItem(
                          ["teile", "teil1", teil1Index, "Texte"],
                          {
                            id: getNextNumericId(teil1Item.Texte || []),
                      text: "",
                      antwort: "",
                      fazit: "",
                          }
                        )
                  }
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={20} className="mr-2" /> Add Text
                </button>
              </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() =>
                  addArrayItem(["teile", "teil1"], {
                    titel: "",
                    photo: "",
                    Überschriften: [],
                    Texte: [],
                  })
                }
                className="flex items-center text-indigo-400 hover:text-indigo-300 mt-4"
              >
                <PlusCircle size={20} className="mr-2" /> Add Teil 1 Item
              </button>
            </div>
          )}

          {activeTab === "teil2" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                Teil 2 Details
              </h3>
              
              {/* Teil 2 Items */}
              {formData.teile.teil2.map((teil2Item, teil2Index) => (
                <div key={teil2Index} className="p-4 my-4 bg-gray-800 rounded-md border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Teil 2 Item #{teil2Index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem(["teile", "teil2"], teil2Index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <XCircle size={22} />
                    </button>
                  </div>
                  
              <Input
                label="Titel"
                    value={teil2Item.titel || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        ["teile", "teil2"],
                        teil2Index,
                        "titel",
                        e.target.value
                      )
                    }
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <Input
                label="Photo URL"
                    value={teil2Item.photo || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        ["teile", "teil2"],
                        teil2Index,
                        "photo",
                        e.target.value
                      )
                    }
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <TextArea
                label="Text"
                    value={teil2Item.text || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        ["teile", "teil2"],
                        teil2Index,
                        "text",
                        e.target.value
                      )
                    }
                onFocus={handleFocus}
                onBlur={handleBlur}
                rows="3"
              />

              {/* Fragen */}
              <div className="mt-6">
                    <h5 className="font-semibold mb-2">Fragen</h5>
                    {(teil2Item.fragen || []).map((frage, idx) => (
                  <div
                    key={idx}
                        className="p-4 my-2 bg-gray-700 rounded-md border border-gray-600"
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                              removeArrayItem(
                                ["teile", "teil2", teil2Index, "fragen"],
                                idx
                              )
                        }
                        className="text-red-500 hover:text-red-400"
                      >
                            <XCircle size={20} />
                      </button>
                    </div>
                    <Input
                      label="ID"
                      type="number"
                          value={frage.id || 0}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil2"],
                              teil2Index,
                              "fragen",
                          idx,
                          "id",
                          parseInt(e.target.value) || 0
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Text"
                          value={frage.text || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil2"],
                              teil2Index,
                              "fragen",
                          idx,
                          "text",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />

                    {/* Options */}
                    <div className="ml-4 mt-4">
                          <h6 className="font-semibold">Options</h6>
                          {(frage.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex gap-2 items-center">
                          <Input
                            label="Option ID"
                                value={opt.id || ""}
                            onChange={(e) =>
                              handleNestedArrayChange(
                                    ["teile", "teil2"],
                                    teil2Index,
                                    "fragen",
                                idx,
                                "options",
                                optIdx,
                                "id",
                                e.target.value
                              )
                            }
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                          />
                          <Input
                            label="Option Text"
                                value={opt.text || ""}
                            onChange={(e) =>
                              handleNestedArrayChange(
                                    ["teile", "teil2"],
                                    teil2Index,
                                    "fragen",
                                idx,
                                "options",
                                optIdx,
                                "text",
                                e.target.value
                              )
                            }
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem(
                                    ["teile", "teil2", teil2Index, "fragen", idx, "options"],
                                optIdx
                              )
                            }
                            className="mt-6 text-red-500 hover:text-red-400"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem(
                                ["teile", "teil2", teil2Index, "fragen", idx, "options"],
                                { id: getNextAlphaId(frage.options || []), text: "" }
                          )
                        }
                        className="text-indigo-400 mt-2 text-sm"
                      >
                        Add Option
                      </button>
                    </div>

                    <Input
                      label="Antwort"
                          value={frage.antwort || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil2"],
                              teil2Index,
                              "fragen",
                          idx,
                          "antwort",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Begründung"
                          value={frage.begründung || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil2"],
                              teil2Index,
                              "fragen",
                          idx,
                          "begründung",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                        addArrayItem(
                          ["teile", "teil2", teil2Index, "fragen"],
                          {
                            id: getNextNumericId(teil2Item.fragen || []),
                      text: "",
                      options: [],
                      antwort: "",
                      begründung: "",
                          }
                        )
                  }
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={20} className="mr-2" /> Add Frage
                </button>
              </div>

              {/* Fazit Array Input */}
              <div className="mt-6">
                    <h5 className="font-semibold mb-2">Fazit</h5>
                    {(teil2Item.fazit || []).map((item, idx) => (
                  <div
                    key={idx}
                        className="flex items-center gap-2 p-3 my-2 bg-gray-700 rounded-md"
                  >
                    <Input
                      label={`Fazit #${idx + 1}`}
                          value={item || ""}
                      onChange={(e) =>
                        handleArrayChange(
                              ["teile", "teil2", teil2Index, "fazit"],
                          idx,
                          null,
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() =>
                            removeArrayItem(["teile", "teil2", teil2Index, "fazit"], idx)
                      }
                      className="mt-6 text-red-500 hover:text-red-400"
                    >
                          <XCircle size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                      onClick={() => addArrayItem(["teile", "teil2", teil2Index, "fazit"], "")}
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={20} className="mr-2" /> Add Fazit
                </button>
              </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() =>
                  addArrayItem(["teile", "teil2"], {
                    titel: "",
                    photo: "",
                    text: "",
                    fragen: [],
                    fazit: [],
                  })
                }
                className="flex items-center text-indigo-400 hover:text-indigo-300 mt-4"
              >
                <PlusCircle size={20} className="mr-2" /> Add Teil 2 Item
              </button>
            </div>
          )}

          {activeTab === "teil3" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                Teil 3 Details
              </h3>
              
              {/* Teil 3 Items */}
              {formData.teile.teil3.map((teil3Item, teil3Index) => (
                <div key={teil3Index} className="p-4 my-4 bg-gray-800 rounded-md border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Teil 3 Item #{teil3Index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem(["teile", "teil3"], teil3Index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <XCircle size={22} />
                    </button>
                  </div>
                  
              <Input
                label="Titel"
                    value={teil3Item.titel || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        ["teile", "teil3"],
                        teil3Index,
                        "titel",
                        e.target.value
                      )
                    }
                onFocus={handleFocus}
                onBlur={handleBlur}
              />

              {/* Situationen */}
              <div className="mt-6">
                    <h5 className="font-semibold mb-2">Situationen</h5>
                    {(teil3Item.situationen || []).map((item, idx) => (
                  <div
                    key={idx}
                        className="flex items-center gap-2 p-3 my-2 bg-gray-700 rounded-md"
                  >
                    <Input
                      label="ID"
                      type="number"
                          value={item.id || 0}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil3"],
                              teil3Index,
                              "situationen",
                          idx,
                          "id",
                          parseInt(e.target.value) || 0
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Text"
                          value={item.text || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil3"],
                              teil3Index,
                              "situationen",
                          idx,
                          "text",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() =>
                            removeArrayItem(
                              ["teile", "teil3", teil3Index, "situationen"],
                              idx
                            )
                      }
                      className="mt-6 text-red-500 hover:text-red-400"
                    >
                          <XCircle size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                        addArrayItem(
                          ["teile", "teil3", teil3Index, "situationen"],
                          {
                            id: getNextZeroNumericId(teil3Item.situationen || []),
                      text: "",
                          }
                        )
                  }
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={20} className="mr-2" /> Add Situation
                </button>
              </div>

              {/* Anzeigen */}
              <div className="mt-6">
                    <h5 className="font-semibold mb-2">Anzeigen</h5>
                    {(teil3Item.anzeigen || []).map((item, idx) => (
                  <div
                    key={idx}
                        className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-3 my-2 bg-gray-700 rounded-md"
                  >
                    <Input
                      label="ID"
                          value={item.id || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil3"],
                              teil3Index,
                              "anzeigen",
                          idx,
                          "id",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Text"
                          value={item.text || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil3"],
                              teil3Index,
                              "anzeigen",
                          idx,
                          "text",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Antwort"
                      type="number"
                          value={item.antwort || 0}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil3"],
                              teil3Index,
                              "anzeigen",
                          idx,
                          "antwort",
                          parseInt(e.target.value) || 0
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Fazit"
                          value={item.fazit || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["teile", "teil3"],
                              teil3Index,
                              "anzeigen",
                          idx,
                          "fazit",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() =>
                            removeArrayItem(
                              ["teile", "teil3", teil3Index, "anzeigen"],
                              idx
                            )
                      }
                      className="mt-6 text-red-500 hover:text-red-400"
                    >
                          <XCircle size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                        addArrayItem(
                          ["teile", "teil3", teil3Index, "anzeigen"],
                          {
                            id: getNextAlphaId(teil3Item.anzeigen || []),
                      text: "",
                      antwort: 0,
                      fazit: "",
                          }
                        )
                  }
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={20} className="mr-2" /> Add Anzeige
                </button>
              </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() =>
                  addArrayItem(["teile", "teil3"], {
                    titel: "",
                    situationen: [],
                    anzeigen: [],
                  })
                }
                className="flex items-center text-indigo-400 hover:text-indigo-300 mt-4"
              >
                <PlusCircle size={20} className="mr-2" /> Add Teil 3 Item
              </button>
            </div>
          )}

          {activeTab === "sprachb" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                Sprachbausteine
              </h3>
              
              {/* Sprachb Teil 1 Items */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4">Teil 1</h4>
                {formData.sprachb.teil1.map((sprachb1Item, sprachb1Index) => (
                  <div key={sprachb1Index} className="p-4 my-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-semibold">Teil 1 Item #{sprachb1Index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["sprachb", "teil1"], sprachb1Index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                    
                <TextArea
                  label="Text"
                      value={sprachb1Item.text || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          ["sprachb", "teil1"],
                          sprachb1Index,
                          "text",
                          e.target.value
                        )
                      }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  rows="2"
                />
                    
                    {(sprachb1Item.fragen || []).map((frage, idx) => (
                  <div
                    key={idx}
                        className="p-4 my-2 bg-gray-700 rounded-md border border-gray-600"
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                              removeArrayItem(
                                ["sprachb", "teil1", sprachb1Index, "fragen"],
                                idx
                              )
                        }
                        className="text-red-500 hover:text-red-400"
                      >
                            <XCircle size={20} />
                      </button>
                    </div>
                    <Input
                      label="ID"
                      type="number"
                          value={frage.id || 0}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["sprachb", "teil1"],
                              sprachb1Index,
                              "fragen",
                          idx,
                          "id",
                          parseInt(e.target.value) || 0
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <div className="ml-4 mt-4">
                          <h6 className="font-semibold">Options</h6>
                          {(frage.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex gap-2 items-center">
                          <Input
                            label="Option ID"
                                value={opt.id || ""}
                            onChange={(e) =>
                              handleNestedArrayChange(
                                    ["sprachb", "teil1"],
                                    sprachb1Index,
                                    "fragen",
                                idx,
                                "options",
                                optIdx,
                                "id",
                                e.target.value
                              )
                            }
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                          />
                          <Input
                            label="Option Text"
                                value={opt.text || ""}
                            onChange={(e) =>
                              handleNestedArrayChange(
                                    ["sprachb", "teil1"],
                                    sprachb1Index,
                                    "fragen",
                                idx,
                                "options",
                                optIdx,
                                "text",
                                e.target.value
                              )
                            }
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem(
                                    ["sprachb", "teil1", sprachb1Index, "fragen", idx, "options"],
                                optIdx
                              )
                            }
                            className="mt-6 text-red-500 hover:text-red-400"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem(
                                ["sprachb", "teil1", sprachb1Index, "fragen", idx, "options"],
                                { id: getNextAlphaId(frage.options || []), text: "" }
                          )
                        }
                        className="text-indigo-400 mt-2 text-sm"
                      >
                        Add Option
                      </button>
                    </div>
                    <Input
                      label="Antwort"
                          value={frage.antwort || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["sprachb", "teil1"],
                              sprachb1Index,
                              "fragen",
                          idx,
                          "antwort",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Begründung"
                          value={frage.begründung || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["sprachb", "teil1"],
                              sprachb1Index,
                              "fragen",
                          idx,
                          "begründung",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                        addArrayItem(
                          ["sprachb", "teil1", sprachb1Index, "fragen"],
                          {
                            id: getNextNumericId(sprachb1Item.fragen || []),
                      options: [],
                      antwort: "",
                      begründung: "",
                          }
                        )
                  }
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={20} className="mr-2" /> Add Frage
                </button>
              </div>
                ))}
                
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem(["sprachb", "teil1"], {
                      text: "",
                      fragen: [],
                    })
                  }
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-4"
                >
                  <PlusCircle size={20} className="mr-2" /> Add Teil 1 Item
                </button>
              </div>

              {/* Sprachb Teil 2 Items */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4">Teil 2</h4>
                {formData.sprachb.teil2.map((sprachb2Item, sprachb2Index) => (
                  <div key={sprachb2Index} className="p-4 my-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-semibold">Teil 2 Item #{sprachb2Index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["sprachb", "teil2"], sprachb2Index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                    
                <TextArea
                  label="Text"
                      value={sprachb2Item.text || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          ["sprachb", "teil2"],
                          sprachb2Index,
                          "text",
                          e.target.value
                        )
                      }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  rows="2"
                />
                    
                    {(sprachb2Item.options || []).map((opt, idx) => (
                  <div
                    key={idx}
                        className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-3 my-2 bg-gray-700 rounded-md"
                  >
                    <Input
                      label="ID"
                          value={opt.id || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["sprachb", "teil2"],
                              sprachb2Index,
                              "options",
                          idx,
                          "id",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Text"
                          value={opt.text || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["sprachb", "teil2"],
                              sprachb2Index,
                              "options",
                          idx,
                          "text",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Antwort"
                      type="number"
                          value={opt.antwort || 0}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["sprachb", "teil2"],
                              sprachb2Index,
                              "options",
                          idx,
                          "antwort",
                          parseInt(e.target.value) || 0
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <Input
                      label="Begründung"
                          value={opt.begründung || ""}
                      onChange={(e) =>
                            handleNestedArrayChange(
                              ["sprachb", "teil2"],
                              sprachb2Index,
                              "options",
                          idx,
                          "begründung",
                          e.target.value
                        )
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() =>
                            removeArrayItem(
                              ["sprachb", "teil2", sprachb2Index, "options"],
                              idx
                            )
                      }
                      className="mt-6 text-red-500 hover:text-red-400"
                    >
                          <XCircle size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                        addArrayItem(
                          ["sprachb", "teil2", sprachb2Index, "options"],
                          {
                            id: getNextAlphaId(sprachb2Item.options || []),
                      text: "",
                      antwort: 0,
                      begründung: "",
                          }
                        )
                  }
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <PlusCircle size={20} className="mr-2" /> Add Option
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem(["sprachb", "teil2"], {
                      text: "",
                      options: [],
                    })
                  }
                  className="flex items-center text-indigo-400 hover:text-indigo-300 mt-4"
                >
                  <PlusCircle size={20} className="mr-2" /> Add Teil 2 Item
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LesenForm;