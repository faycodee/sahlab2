import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/lesen"
    : import.meta.env.VITE_API_URL + "/api/lesen";

const Teil2 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => {
      const teil2Data = res.data?.teile?.teil2 || [];
      setData(teil2Data);
      setLoading(false);
    });
  }, [id]);

  const handleRadioChange = (frageId, selectedId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [frageId]: selectedId,
    }));
  };

  // Prüfen, ob alle Fragen beantwortet sind
  const allAnswered = data.every((block) =>
    block.fragen.every((frage) => userAnswers[frage.id])
  );

  // Bewertung
  const handleReview = () => {
    let correctCount = 0;
    data.forEach((block) => {
      block.fragen.forEach((frage) => {
        if (userAnswers[frage.id] === frage.antwort) {
          correctCount++;
        }
      });
    });
    setScore(correctCount);
    setShowReview(true);
    sessionStorage.setItem("teil2", correctCount); // Save score
  };

  if (loading) return <div className="p-4">⏳ Wird geladen...</div>;

  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      {data.map((block, bIdx) => (
        <div key={bIdx} className="space-y-8">
          <h1 className="text-xl font-semibold mb-4">
            📗 Teil 2 – {block.titel}
          </h1>
          <p className="mb-4">{block.text}</p>
          {block.fragen.map((frage) => {
            const selectedId = userAnswers[frage.id];
            return (
              <div
                key={frage.id}
                className="border p-4 rounded shadow space-y-4"
              >
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
                          onChange={() =>
                            handleRadioChange(frage.id, option.id)
                          }
                          className="mr-2"
                        />
                        {option.text}
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
            {data.reduce((acc, block) => acc + block.fragen.length, 0)} Punkte
          </div>
        </>
      )}

      <div className="max-sm:flex max-sm:flex-col justify-between mt-8">
        <button
          onClick={() => navigate(`/lesen/${id}/teil1`)}
          className="px-4 py-1 mr-5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          🔙 Züruck zu Teil 1
        </button>
        <button
          onClick={() =>
            navigate(`/lesen/${id}/teil3`, {
              state: { teil1: location.state?.teil1 || 0, teil2: score },
            })
          }
          className="px-3 mt-5 max-sm:px-0 py-1 max-sm:translate-x-[0vw]  translate-x-[40vw] bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Weiter zu Teil 3 ➡️
        </button>
      </div>
    </div>
  );
};

export default Teil2;
