import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/horen"
    : import.meta.env.VITE_API_URL + "/api/horen";

const HorenTeil1 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        setData(res.data[0]?.teil1 || []);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && data.length > 0) {
      gsap.fromTo(
        cardRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading, data]);

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
    sessionStorage.setItem("horen_teil1", correctCount);
  };

  if (loading) {
    return (
 
 
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
        
      </div>
  

    );
  }

  return (
    <div ref={cardRef} className="p-6 space-y-10 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">🎧 Hören Teil 1</h1>
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
                let fontWeight = "font-normal";
                let icon = null;

                if (showReview) {
                  if (isSelected && isCorrect) {
                    bgClass = "bg-green-200";
                    fontWeight = "font-bold";
                    icon = (
                      <span className="ml-2 text-green-700 font-bold" title="Richtig">
                        ✔️
                      </span>
                    );
                  } else if (isSelected && !isCorrect) {
                    bgClass = "bg-red-200";
                  } else if (isCorrect) {
                    bgClass = "bg-green-100";
                    fontWeight = "font-bold";
                    icon = (
                      <span className="ml-2 text-green-600 font-bold" title="Richtige Antwort">
                        ✔️
                      </span>
                    );
                  }
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
                    <span className={fontWeight}>{option.code}</span>
                    {icon}
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
          onClick={() => navigate(`/hören/teil2`)}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Weiter zu Teil 2 ➡️
        </button>
      </div>
    </div>
  );
};

export default HorenTeil1;
