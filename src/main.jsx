import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import DayDetail from './DayDetail';
import MonthlyProgress from './MonthlyProgress';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <Router basename="/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/day/:dayName" element={<DayDetail />} />
        <Route path="/monthly" element={<MonthlyProgress />} />
      </Routes>
    </Router>
  </React.StrictMode>
);