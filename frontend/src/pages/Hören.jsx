// Hören.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/horen"
    : import.meta.env.VITE_API_URL + "/api/horen";

const Hören = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    axios.get(API_URL).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  }, []);

  // GSAP animation on mount
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="p-4 space-y-10 w-full  h-[86vh] bg-gradient-to-r from-green-50 to-blue-100 py-16 md:py-24">
       <h1 className="text-4xl  md:text-5xl font-extrabold text-gray-800 mb-10">
        Hören Teile :<span className="text-green-700">B2</span>
        </h1>
      {/* Card */}
      <div className="flex items-center justify-center bg-white border-b dark:bg-gray-800 h-[60vh] ">
      <div
        ref={cardRef}
        className=" bg-green-100 rounded-2xl shadow-xl max-w-lg w-full p-[100px] text-center"
      >
       
        <p className="text-black mb-6">
          Trainiere dein Hörverstehen für die B2 TELC Prüfung.  
          Wähle einen Teil aus und starte den Test.
        </p>

        {/* Example buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/hören/teil1")}
            className="px-6 py-3 bg-black hover:bg-black/65 text-white rounded-lg shadow-md transition"
          >
            Teil 1 starten
          </button>
          <button
            onClick={() => navigate("/hören/teil2")}
            className="px-6 py-3 bg-black hover:bg-black/65 text-white rounded-lg shadow-md transition"
          >
            Teil 2 starten
          </button>
          <button
            onClick={() => navigate("/hören/teil2")}
            className="px-6 py-3 bg-black hover:bg-black/65 text-white rounded-lg shadow-md transition"
          >
            Teil 3 starten
          </button>
        </div>
      </div>
      </div>
  
    </div>
  );
};

export default Hören;
