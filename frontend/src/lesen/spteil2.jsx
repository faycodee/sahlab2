import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/lesen"
    : import.meta.env.VITE_API_URL + "/api/lesen";

const SprachTeil2 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => {
      const spData = res.data?.sprachb?.teil2 || [];
      setData(spData);
      setLoading(false);
    });
  }, [id]);

  // Find max number of options for radio inputs
  const maxOptions = Math.max(
    ...data.map((block) => block.options.length),
    10 // fallback to 10 if no data
  );

  const handleRadioChange = (optionId, selectedOrder) => {
    setUserAnswers((prev) => ({
      ...prev,
      [optionId]: selectedOrder,
    }));
  };

  // Prüfen, ob alle Optionen beantwortet sind
  const allAnswered = data.every((block) =>
    block.options.every((option) => userAnswers[option.id])
  );

  // Bewertung
  const handleReview = () => {
    let correctCount = 0;
    data.forEach((block) => {
      block.options.forEach((option) => {
        if (String(userAnswers[option.id]) === String(option.antwort)) {
          correctCount++;
        }
      });
    });
    setScore(correctCount);
    setShowReview(true);
    sessionStorage.setItem("spteil2", correctCount); // Save score
  };

  if (loading) return <div className="p-4">⏳ Wird geladen...</div>;

  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      {data.map((block, bIdx) => (
        <div key={bIdx} className="space-y-8">
          <h1 className="text-xl font-semibold mb-4">
            📝 Sprachbausteine Teil 2 – {block.titel}
          </h1>
          <p className="mb-4">{block.text}</p>
          <div className="grid grid-cols-1 gap-4">
            {block.options.map((option) => {
              const selectedOrder = userAnswers[option.id];
              const isCorrect = String(option.antwort);
              let bgClass = "bg-white";
              if (showReview) {
                if (selectedOrder === isCorrect) bgClass = "bg-green-200";
                else if (selectedOrder && selectedOrder !== isCorrect)
                  bgClass = "bg-red-200";
                else if (isCorrect) bgClass = "bg-green-100";
              }
              return (
                <div
                  key={option.id}
                  className={`border p-4 rounded shadow space-y-2 ${bgClass}`}
                >
                  <div className="flex items-center gap-2">
                    <b>{option.id}</b>- &nbsp;
                    <span>{option.text}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.from({ length: maxOptions }, (_, i) => i).map(
                      (num) => (
                        <label
                          key={num}
                          className={`border px-2 py-1 rounded cursor-pointer flex items-center ${
                            showReview && String(num) === isCorrect
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={`option-${option.id}`}
                            value={num}
                            checked={selectedOrder === String(num)}
                            disabled={showReview}
                            onChange={() =>
                              handleRadioChange(option.id, String(num))
                            }
                            className="mr-1"
                          />
                          {num}
                        </label>
                      )
                    )}
                  </div>
                  {showReview && (
                    <p className="mt-2 text-sm text-blue-700">
                      💡 <strong>Begründung:</strong> {option.begründung}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

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
        <>
          <div className="text-xl font-bold mt-8">
            🧮 Ergebnis: {score} /{" "}
            {data.reduce((acc, block) => acc + block.options.length, 0)} Punkte
          </div>
        </>
      )}

      <div className="max-sm:flex max-sm:flex-col justify-between mt-8">
        <button
          onClick={() => navigate(`/lesen/${id}/sprachteil1`)}
          className="px-4 py-1 mr-5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          🔙 Züruck zu SprachBausteine 1
        </button>
        <button
          onClick={() =>
            navigate(`/lesen/${id}/ergebnis`, {
              state: {
                teil1: location.state?.teil1 || 0,
                teil2: location.state?.teil2 || 0,
                teil3: location.state?.teil3 || 0,
                spteil1: location.state?.spteil1 || 0,
                spteil2: score,
              },
            })
          }
          className="px-4 py-1 mt-5 mr-5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Weiter zu Ergebnis ➡️
        </button>
      </div>
    </div>
  );
};

export default SprachTeil2;
