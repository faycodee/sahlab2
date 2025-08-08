// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Lesen from "./pages/Lesen";
import Hören from "./pages/Hören";
import Schreiben from "./pages/Schreiben";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useState } from "react";

import Teil1 from "./lesen/teil1";
import Teil2 from "./lesen/teil2";
import Teil3 from "./lesen/teil3";
import SprachTeil1 from "./lesen/spteil1";
import SprachTeil2 from './lesen/spteil2';
import Ergebnis from "./lesen/ergebnis";


function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/lesen" element={<Lesen />} />
          <Route path="/lesen/:id/teil1" element={<Teil1 />} />
          <Route path="/lesen/:id/teil2" element={<Teil2 />} />
          <Route path="/lesen/:id/teil3" element={<Teil3 />} />
          <Route path="/lesen/:id/sprachteil1" element={<SprachTeil1 />} />
          <Route path="/lesen/:id/sprachteil2" element={<SprachTeil2 />} />
          <Route path="/lesen/:id/ergebnis" element={<Ergebnis  />} />
          <Route path="/hören" element={<Hören />} />
          <Route path="/schreiben" element={<Schreiben />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
