// UserPrompt.jsx
import React, { useState } from 'react';

export default function UserPrompt({ initialValues = {}, onSave }) {
  const [weight, setWeight] = useState(initialValues.weight ?? '');
  const [height, setHeight] = useState(initialValues.height ?? '');
  const [age, setAge] = useState(initialValues.age ?? '');
  const [gender, setGender] = useState(initialValues.gender || 'male');
  const [activity, setActivity] = useState(initialValues.activity || 'moderate');

  const handleSave = () => {
    if (!weight || !height || !age) {
      alert('Please fill in all numeric fields.');
      return;
    }

    onSave({
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      gender,
      activity,
    });

    localStorage.setItem('userInfo', JSON.stringify({
  weight: parseFloat(weight),
  height: parseFloat(height),
  age: parseInt(age),
  gender,
  activity,
}));
  };

  return (
    <div className="border p-4 mb-4 rounded">
      <h2 className="font-semibold mb-2">Your Info</h2>
      <div className="grid gap-2 mb-2">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (kg)"
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height (cm)"
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="border px-2 py-1 rounded"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="sedentary">Sedentary</option>
          <option value="light">Lightly Active</option>
          <option value="moderate">Moderately Active</option>
          <option value="active">Very Active</option>
          <option value="veryActive">Extremely Active</option>
        </select>
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  );
}
