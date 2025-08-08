import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const getFeedback = (total) => {
  if (total > 15)
    return {
      text: "Fantastisch! Du hast eine hervorragende Punktzahl erreicht! 🎉🥳",
      color: "bg-green-600",
      emoji: "🥳",
    };
  if (total > 10)
    return {
      text: "Super! Du hast bestanden und kannst stolz auf dich sein! 😃✨",
      color: "bg-blue-500",
      emoji: "😃",
    };
  return {
    text: "Leider nicht bestanden. Versuche es nochmal und gib nicht auf! 😢",
    color: "bg-red-500",
    emoji: "😢",
  };
};

const ResultBubble = ({ label, score, max, color }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className={`flex flex-col items-center justify-center rounded-full shadow-lg w-32 h-32 ${color} text-white mx-2 mb-4`}
  >
    <span className="text-2xl font-bold">{label}</span>
    <span className="text-3xl font-extrabold mt-2">
      {score} / {max}
    </span>
  </motion.div>
);

const Ergebnis = () => {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({ width: 400, height: 400 });

  // Read scores from sessionStorage
  const teil1 = Number(sessionStorage.getItem("teil1")) || 0;
  const teil2 = Number(sessionStorage.getItem("teil2")) || 0;
  const teil3 = Number(sessionStorage.getItem("teil3")) || 0;
  const spteil1 = Number(sessionStorage.getItem("spteil1")) || 0;
  const spteil2 = Number(sessionStorage.getItem("spteil2")) || 0;

  // You can adjust max points per Teil as needed
  const max1 = 5,
    max2 = 5,
    max3 = 12,
    maxSp1 = 10,
    maxSp2 = 10; // adjust as needed
  const total = teil1 + teil2 + teil3 + spteil1 + spteil2;
  const maxTotal = max1 + max2 + max3 + maxSp1 + maxSp2;
  const moyenne = (total / maxTotal) * 100; // percentage
  const feedback = getFeedback(total);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-100"
    >
      {/* Confetti animation for scores above 10 */}
      {total > 10 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={150}
          recycle={false}
        />
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center"
      >
        <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
          Dein Ergebnis {feedback.emoji}
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <ResultBubble
            label="Teil 1"
            score={teil1}
            max={max1}
            color="bg-blue-400"
          />
          <ResultBubble
            label="Teil 2"
            score={teil2}
            max={max2}
            color="bg-green-400"
          />
          <ResultBubble
            label="Teil 3"
            score={teil3}
            max={max3}
            color="bg-yellow-400"
          />
          <ResultBubble
            label="SprachTeil 1"
            score={spteil1}
            max={maxSp1}
            color="bg-purple-400"
          />
          <ResultBubble
            label="SprachTeil 2"
            score={spteil2}
            max={maxSp2}
            color="bg-pink-400"
          />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`rounded-lg px-6 py-4 text-center text-lg font-semibold shadow ${feedback.color} text-white mb-4`}
        >
          Gesamtpunktzahl:{" "}
          <span className="text-2xl font-bold">
            {total} / {maxTotal}
          </span>
          <div className="mt-2">{feedback.text}</div>
          <div className="mt-2 text-base">
            Durchschnitt:{" "}
            <span className="font-bold">{moyenne.toFixed(1)}%</span>
          </div>
        </motion.div>

        {total > 10 && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2 mt-4"
          >
            {/* Joyful bubbles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-xl shadow-lg"
              >
                🎈
              </motion.div>
            ))}
          </motion.div>
        )}

        <button
          onClick={() => navigate(`/lesen/`)}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-bold shadow"
        >
          Zurück zur Übersicht
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Ergebnis;
