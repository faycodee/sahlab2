import { useState } from "react"; 
import { useNavigate } from "react-router-dom";

const SignUp = ({ setUser }) => {
  const API_URL = "https://sahlab2.onrender.com/api/users/register";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Neu
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ Start
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/");
      } else {
        setError(data.error || "Sign up failed");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error");
    } finally {
      setLoading(false); // ✅ Stopp
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700">Sign Up</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 py-2 rounded text-white transition ${
            loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Wird geladen...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
