import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/lesen"
    : import.meta.env.VITE_API_URL + "/api/lesen";

const Teil1 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => {
      const teil1Data = res.data?.teile?.teil1 || [];
      setData(teil1Data);
      setLoading(false);
    });
  }, [id]);

  const handleRadioChange = (textId, selectedId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [textId]: selectedId,
    }));
  };

  // Prüfen, ob alle Texte beantwortet sind
  const allAnswered = data.every((set) =>
    set.Texte.every((text) => userAnswers[text.id])
  );

  // Bewertung
  const handleReview = () => {
    let correctCount = 0;
    data.forEach((set) => {
      set.Texte.forEach((text) => {
        if (userAnswers[text.id] === text.antwort) {
          correctCount++;
        }
      });
    });
    setScore(correctCount);
    setShowReview(true);
    sessionStorage.setItem("teil1", correctCount); // Save score
  };

  if (loading) return <div className="p-4">⏳ Wird geladen...</div>;

  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      {data.map((set, sIdx) => (
        <div key={sIdx} className="space-y-8">
          <h1 className="text-xl font-semibold mb-4">
            📘 Teil 1 – {set.titel}
          </h1>

          {set.Texte.map((text) => {
            const selectedId = userAnswers[text.id];

            return (
              <div
                key={text.id}
                className="border p-4 rounded shadow space-y-4"
              >
                <p>
                  <b>Text : {text.id}</b>
                </p>
                <p className="mb-2">{text.text.replace(/\s+/g, " ").trim()}</p>

                <div className="grid grid-cols-1 gap-2">
                  {set.Überschriften.map((heading) => {
                    // Vergleich über IDs:
                    const isSelected = selectedId === heading.id;
                    const isCorrect = heading.id === text.antwort;

                    // Hintergrundfarben nach Review Status:
                    let bgClass = "bg-white";
                    if (showReview) {
                      if (isSelected && isCorrect) bgClass = "bg-green-200";
                      else if (isSelected && !isCorrect) bgClass = "bg-red-200";
                      else if (isCorrect) bgClass = "bg-green-100";
                    }

                    return (
                      <label
                        key={heading.id}
                        className={`border px-3 py-2 rounded cursor-pointer flex items-center ${bgClass}`}
                      >
                        {heading.id}- &nbsp;
                        <input
                          type="radio"
                          name={`text-${text.id}`}
                          value={heading.id}
                          checked={isSelected}
                          disabled={showReview}
                          onChange={() =>
                            handleRadioChange(text.id, heading.id)
                          }
                          className="mr-2"
                        />
                        {heading.text}
                      </label>
                    );
                  })}
                </div>

                {showReview && (
                  <p className="mt-2 text-sm text-blue-700">
                    💡 <strong>Erklärung:</strong> {text.fazit}
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
            onClick={() =>
              navigate(`/lesen/${id}/teil2`, { state: { teil1: score } })
            }
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ➡️ Weiter zu Teil 2
          </button>

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
            {data.reduce((acc, set) => acc + set.Texte.length, 0)} Punkte
          </div>{" "}
        </>
      )}
      <button
        onClick={() => navigate(`/lesen/${id}/teil2`)}
        className="px-4 py-1 max-sm:translate-x-[40vw]  translate-x-[60vw] bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Weiter zu Teil 2 ➡️
      </button>
    </div>
  );
};

export default Teil1;
