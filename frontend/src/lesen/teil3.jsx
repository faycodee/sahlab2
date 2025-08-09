// Teil3.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/lesen"
    : import.meta.env.VITE_API_URL + "/api/lesen";

const Teil3 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => {
      const teil3Data = res.data?.teile?.teil3 || [];
      setData(teil3Data);
      setLoading(false);
    });
  }, [id]);

  const handleRadioChange = (anzeigeId, selectedId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [anzeigeId]: selectedId,
    }));
  };

  // Prüfen, ob alle Anzeigen beantwortet sind
  const allAnswered = data.every((block) =>
    block.anzeigen.every((anzeige) => userAnswers[anzeige.id])
  );

  // Bewertung
  const handleReview = () => {
    let correctCount = 0;
    data.forEach((block) => {
      block.anzeigen.forEach((anzeige) => {
        if (userAnswers[anzeige.id] === String(anzeige.antwort)) {
          correctCount++;
        }
      });
    });
    setScore(correctCount);
    setShowReview(true);
    sessionStorage.setItem("teil3", correctCount); // Save score
  };

  if (loading) return <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
    
  </div>

;

  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      {data.map((block, bIdx) => (
        <div key={bIdx} className="space-y-8">
          <h1 className="text-xl font-semibold mb-4">
            📙 Teil 3 – {block.titel}
          </h1>

          {block.anzeigen.map((anzeige) => {
            const selectedId = userAnswers[anzeige.id];
            const isCorrect = String(anzeige.antwort);
            let bgClass = "bg-white";
            if (showReview) {
              if (selectedId === isCorrect) bgClass = "bg-green-200";
              else if (selectedId && selectedId !== isCorrect)
                bgClass = "bg-red-200";
            }
            return (
              <div
                key={anzeige.id}
                className={`border p-4 rounded shadow space-y-4 ${bgClass}`}
              >
                <p>
                  <b>Anzeige {anzeige.id}:</b> {anzeige.text}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {block.situationen.map((situation) => (
                    <label
                      key={situation.id}
                      className={`border px-3 py-2 rounded cursor-pointer flex items-center ${
                        showReview && String(situation.id) === isCorrect
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`anzeige-${anzeige.id}`}
                        value={situation.id}
                        checked={selectedId === String(situation.id)}
                        disabled={showReview}
                        onChange={() =>
                          handleRadioChange(anzeige.id, String(situation.id))
                        }
                        className="mr-2"
                      />
                      Situation {situation.id}: {situation.text}
                    </label>
                  ))}
                </div>
                {showReview && (
                  <p className="mt-2 text-sm text-blue-700">
                    💡 <strong>Erklärung:</strong> {anzeige.fazit}
                  </p>
                )}
              </div>
            );
          })}
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
            {data.reduce((acc, block) => acc + block.anzeigen.length, 0)} Punkte
          </div>
        </>
      )}

      <div className="max-sm:flex max-sm:flex-col justify-between mt-8">
        <button
          onClick={() => navigate(`/lesen/${id}/teil2`)}
          className="px-4 py-1 mr-5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          🔙 Züruck zu Teil 2
        </button>
        <button
          onClick={() =>
            navigate(`/lesen/${id}/sprachteil1`, {
              state: {
                teil1: location.state?.teil1 || 0,
                teil2: location.state?.teil2 || 0,
                teil3: score,
              },
            })
          }
          className="px-4 py-1 mt-5 mr-5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Weiter zu SprachBausteine 1 ➡️
        </button>
      </div>
    </div>
  );
};

export default Teil3;
