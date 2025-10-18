import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

// 先用 placeholder，之後會實作
const CryptoDetail = () => <div>Crypto Detail - Coming Soon</div>;
const AlertsPage = () => <div>Alerts - Coming Soon</div>;
const FavoritesPage = () => <div>Favorites - Coming Soon</div>;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crypto/:id" element={<CryptoDetail />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;