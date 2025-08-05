import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Lesen from './pages/Lesen';
import LesenForm from './pages/LesenForm'; // Import the new form component
import Horen from './pages/Horen';
import Schreiben from './pages/Schreiben';
import Sprechen from './pages/Sprechen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="lesen" element={<Lesen />} />
          <Route path="lesen/new" element={<LesenForm />} />       {/* Route jdida l'Add */}
          <Route path="lesen/edit/:id" element={<LesenForm />} />   {/* Route jdida l'Edit */}
          <Route path="horen" element={<Horen />} />
          <Route path="schreiben" element={<Schreiben />} />
          <Route path="sprechen" element={<Sprechen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;