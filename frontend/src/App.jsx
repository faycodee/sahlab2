import { BrowserRouter , Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Lesen from "./pages/Lesen";
import Hören from "./pages/Hören";
import Schreiben from "./pages/Schreiben";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="App">
      <Navbar user={user} setUser={setUser} />


        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/lesen" element={<Lesen />} />
          <Route path="/hören" element={<Hören />} />
          <Route path="/schreiben" element={<Schreiben />} />
          <Route path="/login" element={<Login setUser={setUser}  />} />
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
