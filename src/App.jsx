import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWeekNumber, calculateMaintenance } from './utils';
import UserPrompt from './UserPrompt';

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(d.setDate(diff));
}

function getCurrentWeekDates() {
  const start = getStartOfWeek(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function App() {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('calorieData');
    return stored ? JSON.parse(stored) : {};
  });

  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  });

  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    localStorage.setItem('calorieData', JSON.stringify(data));
  }, [data]);

  const weekDates = getCurrentWeekDates();
  const weeklyTotal = weekDates.reduce((sum, date) => {
    const iso = date.toISOString().slice(0, 10);
    return sum + (data[iso]?.total || 0);
  }, 0);

  const dailyMaintenance = userData ? calculateMaintenance(userData) : NaN;
  const maintenancePerWeek = isNaN(dailyMaintenance) ? null : dailyMaintenance * 7;
  const diff = maintenancePerWeek !== null ? weeklyTotal - maintenancePerWeek : null;

  let status = '';
  if (diff !== null) {
    if (diff > 50) status = 'surplus';
    else if (diff < -50) status = 'deficit';
    else status = 'neutral';
  }

  const weekLabel = `Week ${getWeekNumber(new Date())}`;

  const statusStyles = {
    surplus: 'bg-red-100 border-red-400 text-red-700',
    deficit: 'bg-green-100 border-green-400 text-green-700',
    neutral: 'bg-gray-100 border-gray-400 text-gray-800',
  };

  const colorClass = status ? statusStyles[status] : '';

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Weekly Calorie Tracker</h1>

      {editingProfile || !userData ? (
        <UserPrompt
          initialValues={userData}
          onSave={(data) => {
            setUserData(data);
            localStorage.setItem('userData', JSON.stringify(data));
            setEditingProfile(false);
          }}
        />
      ) : null}

      {userData && !editingProfile && (
        <div className={`p-4 mb-4 border rounded ${colorClass}`}>
          <div className="font-semibold mb-1">{weekLabel}</div>
          <div>Total Calories: {weeklyTotal .toFixed(0)} kcal</div>
          <div>Maintenance: {maintenancePerWeek !== null ? `${maintenancePerWeek.toFixed(0)} kcal` : 'N/A'}</div>
          <div>
            Status:{' '}
            {status === 'surplus'
              ? 'Surplus (↑ Likely weight gain)'
              : status === 'deficit'
              ? 'Deficit (↓ Possible weight loss)'
              : 'Neutral (↔ Maintenance)'}
          </div>
        </div>
      )} 

      {userData && !editingProfile && (
        <>
          <button
            onClick={() => setEditingProfile(true)}
            className="mb-4 text-sm text-blue-600 underline"
          >
            Update Weight or Activity
          </button>

          <Link
            to="/monthly"
            className="block mb-6 text-sm text-purple-700 underline hover:text-purple-900"
          >
            📊 View Monthly Progress
          </Link>
        </>
      )}

      <div className="grid gap-2">
        {weekDates.map(date => {
          const iso = date.toISOString().slice(0, 10);
          const label = date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
          return (
            <Link
              key={iso}
              to={`/day/${iso}`}
              className="flex justify-between items-center p-3 border rounded hover:bg-gray-50"
            >
              <span>{label}</span>
              <span>{data[iso]?.total || 0} kcal</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}