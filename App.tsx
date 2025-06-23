import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UrlProvider } from './context/UrlContext';
import ShortenerPage from './pages/ShortenerPage';
import StatsPage from './pages/StatsPage';
import RedirectHandler from './pages/RedirectHandler';

function App() {
  return (
    <Router>
      <UrlProvider>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </UrlProvider>
    </Router>
  );
}

export default App;