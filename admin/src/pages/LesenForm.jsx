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
    teil1: { titel: "", photo: "", Überschriften: [], Texte: [] },
    teil2: { titel: "", photo: "", text: "", fragen: [], fazit: [] },
    teil3: { titel: "", situationen: [], anzeigen: [] },
  },
  sprachb: {
    teil1: { text: "", fragen: [] },
    teil2: { text: "", options: [] },
  },
};

// --- Reusable and Enhanced Form Components ---

// Custom Input component with error handling and focus management
const Input = ({ label, name, error, onFocus, onBlur, ...props }) => (
  <div className="mb-4 w-full">
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
      className={`w-full bg-gray-700 border rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 transition-colors ${
        error ? 'border-red-500' : 'border-gray-600'
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

// Custom TextArea with the same enhancements
const TextArea = ({ label, name, error, onFocus, onBlur, ...props }) => (
    <div className="mb-4 w-full">
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            onFocus={onFocus}
            onBlur={onBlur}
            {...props}
            className={`w-full bg-gray-700 border rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 transition-colors ${
                error ? 'border-red-500' : 'border-gray-600'
            }`}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
);


const LesenForm = () => {
  const API_URL ="http://localhost:5000/api/lesen"
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
          if (typeof fetchedData[key] === 'object' && fetchedData[key] !== null && !Array.isArray(fetchedData[key])) {
              merged[key] = { ...initialFormState[key], ...fetchedData[key] };
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
      setFormData(prev => {
          const newState = JSON.parse(JSON.stringify(prev));
          let current = newState;
          path.forEach(key => {
              current = current[key];
          });
          current[index] = { ...current[index], [field]: value };
          return newState;
      });
  }, []);

  // Handler for deeply nested arrays (e.g., question options)
  const handleNestedArrayChange = useCallback((path, index, nestedArrayName, nestedIndex, field, value) => {
      setFormData(prev => {
          const newState = JSON.parse(JSON.stringify(prev));
          let parentArray = newState;
          path.forEach(key => {
            parentArray = parentArray[key];
          });
          const parentObject = parentArray[index];
          parentObject[nestedArrayName][nestedIndex] = { ...parentObject[nestedArrayName][nestedIndex], [field]: value };
          return newState;
      });
  }, []);


  // Generic handler to add an item to an array
  const addArrayItem = useCallback((path, newItem) => {
      setFormData(prev => {
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
      setFormData(prev => {
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
  const getNextNumericId = (arr, start = 1) => arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : start;
  const getNextZeroNumericId = (arr) => arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 0;
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
      // Add more validation rules for other tabs if needed
      if (!formData.teile.teil1.titel) newErrors['teile.teil1.titel'] = "Titel for Teil 1 is required.";
      
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
      navigate("/lesen");
    } catch (err) {
      console.error("Failed to save LESEN item", err);
      const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
      alert(`Failed to save LESEN item: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <p className="text-center text-white">Loading form...</p>;
  
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
            {activeTab === 'main' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="ID" name="id" type="number" value={formData.id} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} error={errors.id} />
                    <Input label="Thema" name="thema" value={formData.thema} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} error={errors.thema} />
                    <Input label="Thema TR" name="themaTr" value={formData.themaTr} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} error={errors.themaTr} />
                </div>
            )}

            {activeTab === 'teil1' && (
                <div>
                    <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Teil 1 Details</h3>
                    <Input label="Titel" name="teile.teil1.titel" value={formData.teile.teil1.titel} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} error={errors['teile.teil1.titel']} />
                    <Input label="Photo URL" name="teile.teil1.photo" value={formData.teile.teil1.photo} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                    
                    {/* Überschriften */}
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Überschriften</h4>
                        {formData.teile.teil1.Überschriften.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 my-2 bg-gray-800 rounded-md">
                                <Input label="ID" name={`uberschrift-id-${index}`} value={item.id} onChange={(e) => handleArrayChange(['teile', 'teil1', 'Überschriften'], index, 'id', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Text" name={`uberschrift-text-${index}`} value={item.text} onChange={(e) => handleArrayChange(['teile', 'teil1', 'Überschriften'], index, 'text', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <button type="button" onClick={() => removeArrayItem(['teile', 'teil1', 'Überschriften'], index)} className="mt-6 text-red-500 hover:text-red-400"><XCircle size={22} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(['teile', 'teil1', 'Überschriften'], { id: getNextAlphaId(formData.teile.teil1.Überschriften), text: "" })} className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"><PlusCircle size={20} className="mr-2" /> Add Überschrift</button>
                    </div>

                    {/* Texte */}
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Texte</h4>
                        {formData.teile.teil1.Texte.map((item, index) => (
                             <div key={index} className="p-4 my-2 bg-gray-800 rounded-md border border-gray-700">
                                <div className="flex justify-end"><button type="button" onClick={() => removeArrayItem(['teile', 'teil1', 'Texte'], index)} className="text-red-500 hover:text-red-400"><XCircle size={22} /></button></div>
                                <Input label="ID" type="number" value={item.id} onChange={(e) => handleArrayChange(['teile', 'teil1', 'Texte'], index, 'id', parseInt(e.target.value) || 0)} onFocus={handleFocus} onBlur={handleBlur} />
                                <TextArea label="Text" value={item.text} onChange={(e) => handleArrayChange(['teile', 'teil1', 'Texte'], index, 'text', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} rows="4" />
                                <Input label="Antwort" value={item.antwort} onChange={(e) => handleArrayChange(['teile', 'teil1', 'Texte'], index, 'antwort', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Fazit" value={item.fazit} onChange={(e) => handleArrayChange(['teile', 'teil1', 'Texte'], index, 'fazit', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(['teile', 'teil1', 'Texte'], { id: getNextNumericId(formData.teile.teil1.Texte), text: "", antwort: "", fazit: "" })} className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"><PlusCircle size={20} className="mr-2" /> Add Text</button>
                    </div>
                </div>
            )}

            {activeTab === 'teil2' && (
                <div>
                    <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Teil 2 Details</h3>
                    <Input label="Titel" name="teile.teil2.titel" value={formData.teile.teil2.titel} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                    <Input label="Photo URL" name="teile.teil2.photo" value={formData.teile.teil2.photo} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                    <TextArea label="Text" name="teile.teil2.text" value={formData.teile.teil2.text} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} rows="3" />

                    {/* Fragen */}
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Fragen</h4>
                        {formData.teile.teil2.fragen.map((frage, idx) => (
                            <div key={idx} className="p-4 my-2 bg-gray-800 rounded-md border border-gray-700">
                                <div className="flex justify-end"><button type="button" onClick={() => removeArrayItem(['teile', 'teil2', 'fragen'], idx)} className="text-red-500 hover:text-red-400"><XCircle size={22} /></button></div>
                                <Input label="ID" type="number" value={frage.id} onChange={(e) => handleArrayChange(['teile', 'teil2', 'fragen'], idx, 'id', parseInt(e.target.value) || 0)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Text" value={frage.text} onChange={(e) => handleArrayChange(['teile', 'teil2', 'fragen'], idx, 'text', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                
                                {/* Options */}
                                <div className="ml-4 mt-4">
                                    <h5 className="font-semibold">Options</h5>
                                    {frage.options.map((opt, optIdx) => (
                                        <div key={optIdx} className="flex gap-2 items-center">
                                            <Input label="Option ID" value={opt.id} onChange={(e) => handleNestedArrayChange(['teile', 'teil2', 'fragen'], idx, 'options', optIdx, 'id', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                            <Input label="Option Text" value={opt.text} onChange={(e) => handleNestedArrayChange(['teile', 'teil2', 'fragen'], idx, 'options', optIdx, 'text', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                            <button type="button" onClick={() => removeArrayItem(['teile', 'teil2', 'fragen', idx, 'options'], optIdx)} className="mt-6 text-red-500 hover:text-red-400"><XCircle size={20} /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addArrayItem(['teile', 'teil2', 'fragen', idx, 'options'], { id: getNextAlphaId(frage.options), text: "" })} className="text-indigo-400 mt-2 text-sm">Add Option</button>
                                </div>
                                
                                <Input label="Antwort" value={frage.antwort} onChange={(e) => handleArrayChange(['teile', 'teil2', 'fragen'], idx, 'antwort', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Begründung" value={frage.begründung} onChange={(e) => handleArrayChange(['teile', 'teil2', 'fragen'], idx, 'begründung', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(['teile', 'teil2', 'fragen'], { id: getNextNumericId(formData.teile.teil2.fragen), text: "", options: [], antwort: "", begründung: "" })} className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"><PlusCircle size={20} className="mr-2" /> Add Frage</button>
                    </div>
                </div>
            )}

             {activeTab === 'teil3' && (
                <div>
                    <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Teil 3 Details</h3>
                    <Input label="Titel" name="teile.teil3.titel" value={formData.teile.teil3.titel} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />

                    {/* Situationen */}
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Situationen</h4>
                        {formData.teile.teil3.situationen.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-3 my-2 bg-gray-800 rounded-md">
                                <Input label="ID" type="number" value={item.id} onChange={(e) => handleArrayChange(['teile', 'teil3', 'situationen'], idx, 'id', parseInt(e.target.value) || 0)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Text" value={item.text} onChange={(e) => handleArrayChange(['teile', 'teil3', 'situationen'], idx, 'text', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <button type="button" onClick={() => removeArrayItem(['teile', 'teil3', 'situationen'], idx)} className="mt-6 text-red-500 hover:text-red-400"><XCircle size={22} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(['teile', 'teil3', 'situationen'], { id: getNextZeroNumericId(formData.teile.teil3.situationen), text: "" })} className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"><PlusCircle size={20} className="mr-2" /> Add Situation</button>
                    </div>

                    {/* Anzeigen */}
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Anzeigen</h4>
                        {formData.teile.teil3.anzeigen.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-3 my-2 bg-gray-800 rounded-md">
                                <Input label="ID" value={item.id} onChange={(e) => handleArrayChange(['teile', 'teil3', 'anzeigen'], idx, 'id', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Text" value={item.text} onChange={(e) => handleArrayChange(['teile', 'teil3', 'anzeigen'], idx, 'text', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Antwort" type="number" value={item.antwort} onChange={(e) => handleArrayChange(['teile', 'teil3', 'anzeigen'], idx, 'antwort', parseInt(e.target.value) || 0)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Fazit" value={item.fazit} onChange={(e) => handleArrayChange(['teile', 'teil3', 'anzeigen'], idx, 'fazit', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <button type="button" onClick={() => removeArrayItem(['teile', 'teil3', 'anzeigen'], idx)} className="mt-6 text-red-500 hover:text-red-400"><XCircle size={22} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(['teile', 'teil3', 'anzeigen'], { id: getNextAlphaId(formData.teile.teil3.anzeigen), text: "", antwort: 0, fazit: "" })} className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"><PlusCircle size={20} className="mr-2" /> Add Anzeige</button>
                    </div>
                </div>
            )}

            {activeTab === 'sprachb' && (
                <div>
                    <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Sprachbausteine</h3>
                    {/* Sprachb Teil 1 */}
                    <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold">Teil 1</h4>
                        <TextArea label="Text" name="sprachb.teil1.text" value={formData.sprachb.teil1.text} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} rows="2" />
                        {formData.sprachb.teil1.fragen.map((frage, idx) => (
                            <div key={idx} className="p-4 my-2 bg-gray-800 rounded-md border border-gray-700">
                                <div className="flex justify-end"><button type="button" onClick={() => removeArrayItem(['sprachb', 'teil1', 'fragen'], idx)} className="text-red-500 hover:text-red-400"><XCircle size={22} /></button></div>
                                <Input label="ID" type="number" value={frage.id} onChange={(e) => handleArrayChange(['sprachb', 'teil1', 'fragen'], idx, 'id', parseInt(e.target.value) || 0)} onFocus={handleFocus} onBlur={handleBlur} />
                                <div className="ml-4 mt-4">
                                    <h5 className="font-semibold">Options</h5>
                                    {frage.options.map((opt, optIdx) => (
                                        <div key={optIdx} className="flex gap-2 items-center">
                                            <Input label="Option ID" value={opt.id} onChange={(e) => handleNestedArrayChange(['sprachb', 'teil1', 'fragen'], idx, 'options', optIdx, 'id', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                            <Input label="Option Text" value={opt.text} onChange={(e) => handleNestedArrayChange(['sprachb', 'teil1', 'fragen'], idx, 'options', optIdx, 'text', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                            <button type="button" onClick={() => removeArrayItem(['sprachb', 'teil1', 'fragen', idx, 'options'], optIdx)} className="mt-6 text-red-500 hover:text-red-400"><XCircle size={20} /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addArrayItem(['sprachb', 'teil1', 'fragen', idx, 'options'], { id: getNextAlphaId(frage.options), text: "" })} className="text-indigo-400 mt-2 text-sm">Add Option</button>
                                </div>
                                <Input label="Antwort" value={frage.antwort} onChange={(e) => handleArrayChange(['sprachb', 'teil1', 'fragen'], idx, 'antwort', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Begründung" value={frage.begründung} onChange={(e) => handleArrayChange(['sprachb', 'teil1', 'fragen'], idx, 'begründung', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(['sprachb', 'teil1', 'fragen'], { id: getNextNumericId(formData.sprachb.teil1.fragen), options: [], antwort: "", begründung: "" })} className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"><PlusCircle size={20} className="mr-2" /> Add Frage</button>
                    </div>

                    {/* Sprachb Teil 2 */}
                    <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold">Teil 2</h4>
                        <TextArea label="Text" name="sprachb.teil2.text" value={formData.sprachb.teil2.text} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} rows="2" />
                        {formData.sprachb.teil2.options.map((opt, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-3 my-2 bg-gray-800 rounded-md">
                                <Input label="ID" value={opt.id} onChange={(e) => handleArrayChange(['sprachb', 'teil2', 'options'], idx, 'id', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Text" value={opt.text} onChange={(e) => handleArrayChange(['sprachb', 'teil2', 'options'], idx, 'text', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Antwort" type="number" value={opt.antwort} onChange={(e) => handleArrayChange(['sprachb', 'teil2', 'options'], idx, 'antwort', parseInt(e.target.value) || 0)} onFocus={handleFocus} onBlur={handleBlur} />
                                <Input label="Begründung" value={opt.begründung} onChange={(e) => handleArrayChange(['sprachb', 'teil2', 'options'], idx, 'begründung', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                                <button type="button" onClick={() => removeArrayItem(['sprachb', 'teil2', 'options'], idx)} className="mt-6 text-red-500 hover:text-red-400"><XCircle size={22} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(['sprachb', 'teil2', 'options'], { id: getNextAlphaId(formData.sprachb.teil2.options), text: "", antwort: 0, begründung: "" })} className="flex items-center text-indigo-400 hover:text-indigo-300 mt-2"><PlusCircle size={20} className="mr-2" /> Add Option</button>
                    </div>
                </div>
            )}
        </div>
      </form>
    </div>
  );
};

export default LesenForm;
