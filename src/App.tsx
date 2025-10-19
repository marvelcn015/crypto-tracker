import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CryptoDetail from './pages/CryptoDetail';
import AlertsPage from './pages/AlertsPage';
import FavoritesPage from './pages/FavoritesPage';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crypto/:id" element={<CryptoDetail />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
};

export default App;