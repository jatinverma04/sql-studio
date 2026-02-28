import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AssignmentsPage from './pages/AssignmentsPage';
import AttemptPage from './pages/AttemptPage';
import './styles/main.scss';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<AssignmentsPage />} />
        <Route path="/assignments/:id" element={<AttemptPage />} />
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h2 style={{ color: '#f0883e' }}>404</h2>
              <p style={{ color: '#8b949e' }}>Page not found.</p>
              <a href="/" className="btn btn--secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                ← Back to Assignments
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
