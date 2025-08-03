import React, { useState, useEffect } from 'react';
import { calculateMaintenance, getWeekNumber } from './utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(d.setDate(diff));
}

function getWeeksInMonth(year, month) {
  const weeks = new Set();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const startOfWeek = getStartOfWeek(d);
    weeks.add(startOfWeek.toISOString().slice(0, 10));
  }
  return Array.from(weeks).sort();
}

function getWeekDates(start) {
  const base = new Date(start);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export default function MonthlyProgress() {
  const [data, setData] = useState({});
  const [userData, setUserData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('calorieData');
    if (stored) setData(JSON.parse(stored));
    const user = localStorage.getItem('userData');
    if (user) setUserData(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (!userData) return;

    const now = new Date();
    const weeks = getWeeksInMonth(now.getFullYear(), now.getMonth());

    const summary = weeks.map((start) => {
      const dates = getWeekDates(start);

      const total = dates.reduce((sum, d) => sum + (data[d]?.total || 0), 0);

      const weeklyMaintenance = dates.reduce((sum, d) => {
        const day = data[d];
        if (day?.maintenance) {
          return sum + day.maintenance;
        } else {
          console.warn(`Missing maintenance for ${d}`);
          return sum;
        }
      }, 0);

      const diff = total - weeklyMaintenance;

      return {
        week: `Week ${getWeekNumber(new Date(start))}`,
        total,
        diff,
        maintenance: weeklyMaintenance,
        status:
          diff > 50 ? 'Surplus' : diff < -50 ? 'Deficit' : 'Maintenance',
      };
    });

    setMonthlyData(summary);
  }, [data, userData]);

  const totalMonth = monthlyData.reduce((sum, w) => sum + w.total, 0);
  const totalMaintenance = monthlyData.reduce(
    (sum, w) => sum + (w.maintenance || 0),
    0
  );
  const totalDiff = totalMonth - totalMaintenance;
  const overallStatus =
    totalDiff > 50
      ? 'Surplus (Weight Gain)'
      : totalDiff < -50
      ? 'Deficit (Weight Loss)'
      : 'Maintenance';

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Monthly Progress</h1>
      <div className="mb-4 border p-4 rounded">
        <div className="font-semibold mb-2">Monthly Summary</div>
        <div>Total Calories: {totalMonth.toFixed(0)} kcal</div>
        <div>Expected Maintenance: {totalMaintenance.toFixed(0)} kcal</div>
        <div>Status: {overallStatus}</div>
      </div>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Calories" />
            <Line
              type="monotone"
              dataKey="maintenance"
              stroke="#82ca9d"
              name="Maintenance"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ul className="grid gap-2">
        {monthlyData.map((week, i) => (
          <li key={i} className="border p-3 rounded">
            <div className="font-medium">{week.week}</div>
            <div>Total: {week.total} kcal</div>
            <div>Diff: {week.diff > 0 ? '+' : ''}{week.diff} kcal</div>
            <div>Status: {week.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
