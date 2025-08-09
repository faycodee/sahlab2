import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/horen"
    : import.meta.env.VITE_API_URL + "/api/horen";

const HorenTeil2 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => {
      setData(res.data?.teil2 || []);
      setLoading(false);
    });
  }, [id]);

  const handleRadioChange = (frageId, selectedId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [frageId]: selectedId,
    }));
  };

  const allAnswered = data.every((frage) => userAnswers[frage.id]);

  const handleReview = () => {
    let correctCount = 0;
    data.forEach((frage) => {
      if (userAnswers[frage.id] === frage.antwort) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowReview(true);
    sessionStorage.setItem("horen_teil2", correctCount);
  };

  if (loading) {
    return (
 
 
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
        
      </div>
  

    );
  }

  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">🎧 Hören Teil 2</h1>
      {data.map((frage) => {
        const selectedId = userAnswers[frage.id];
        return (
          <div key={frage.id} className="border p-4 rounded shadow space-y-4">
            <p>
              <b>Frage: {frage.text}</b>
            </p>
            <div className="grid grid-cols-1 gap-2">
              {frage.options.map((option) => {
                const isSelected = selectedId === option.id;
                const isCorrect = option.id === frage.antwort;
                let bgClass = "bg-white";
                if (showReview) {
                  if (isSelected && isCorrect) bgClass = "bg-green-200";
                  else if (isSelected && !isCorrect) bgClass = "bg-red-200";
                  else if (isCorrect) bgClass = "bg-green-100";
                }
                return (
                  <label
                    key={option.id}
                    className={`border px-3 py-2 rounded cursor-pointer flex items-center ${bgClass}`}
                  >
                    {option.id}- &nbsp;
                    <input
                      type="radio"
                      name={`frage-${frage.id}`}
                      value={option.id}
                      checked={isSelected}
                      disabled={showReview}
                      onChange={() => handleRadioChange(frage.id, option.id)}
                      className="mr-2"
                    />
                    {option.code}
                  </label>
                );
              })}
            </div>
            {showReview && (
              <p className="mt-2 text-sm text-blue-700">
                💡 <strong>Begründung:</strong> {frage.begründung}
              </p>
            )}
          </div>
        );
      })}

      {allAnswered && !showReview && (
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleReview}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            ✅ Antworten überprüfen
          </button>
        </div>
      )}

      {showReview && (
        <div className="text-xl font-bold mt-8">
          🧮 Ergebnis: {score} / {data.length} Punkte
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(`/hören/teil3`)}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Weiter zu Teil 3 ➡️
        </button>
      </div>
    </div>
  );
};

export default HorenTeil2;