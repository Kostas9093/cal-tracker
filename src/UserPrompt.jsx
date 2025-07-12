// src/components/UserPrompt.jsx
import React, { useState } from 'react';

export default function UserPrompt({ onSave, initialValues = null }) {
  const [weight, setWeight] = useState(initialValues?.weight || '');
  const [activity, setActivity] = useState(initialValues?.activity || 'light');

  const handleSave = () => {
    const parsedWeight = parseFloat(weight);
    if (!isNaN(parsedWeight)) {
      onSave({ weight: parsedWeight, activity });
    }
  };

  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="text-lg font-semibold mb-2">
        {initialValues ? 'Update Profile' : 'Enter Your Profile'}
      </h2>
      <div className="mb-2">
        <label className="block text-sm">Current Weight (kg):</label>
        <input
          type="number"
          className="border px-2 py-1 rounded w-full"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Activity Level:</label>
        <select
          className="border px-2 py-1 rounded w-full"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        >
          <option value="sedentary">Sedentary (little/no exercise)</option>
          <option value="light">Light (1–3 days/week)</option>
          <option value="moderate">Moderate (3–5 days/week)</option>
          <option value="active">Active (6–7 days/week)</option>
          <option value="very">Very active (twice/day or hard labor)</option>
        </select>
      </div>
      <button
        onClick={handleSave}
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        {initialValues ? 'Update' : 'Save'}
      </button>
    </div>
  );
}