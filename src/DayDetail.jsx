import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function DayDetail() {
  const { dayName } = useParams(); // ISO date string
  const navigate = useNavigate();
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('calorieData');
    return stored ? JSON.parse(stored) : {};
  });

  const [mealCalories, setMealCalories] = useState('');
  const [mealName, setMealName] = useState('');

  const meals = data[dayName]?.meals || [];

  const addMeal = () => {
    const calories = parseInt(mealCalories);
    if (!isNaN(calories) && calories > 0 && mealName.trim() !== '') {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const updatedMeals = [
        ...meals,
        {
          name: mealName.trim(),
          calories,
          time: timestamp,
        },
      ];

      const updatedDay = {
        meals: updatedMeals,
        total: updatedMeals.reduce((sum, m) => sum + m.calories, 0),
      };

      const updatedData = {
        ...data,
        [dayName]: updatedDay,
      };

      setData(updatedData);
      localStorage.setItem('calorieData', JSON.stringify(updatedData));
      setMealCalories('');
      setMealName('');
    }
  };

  const deleteMeal = (index) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    const updatedDay = {
      meals: updatedMeals,
      total: updatedMeals.reduce((sum, m) => sum + m.calories, 0),
    };
    const updatedData = {
      ...data,
      [dayName]: updatedDay,
    };
    setData(updatedData);
    localStorage.setItem('calorieData', JSON.stringify(updatedData));
  };

  const readableDate = new Date(dayName).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back
      </button>
      <h2 className="text-xl font-bold mb-2">{readableDate}</h2>

      <ul className="mb-4">
        {meals.map((meal, index) => (
          <li key={index} className="border-b py-1 flex justify-between items-center">
            <span>
              <strong>{meal.name}</strong>: {meal.calories} kcal{' '}
              <span className="text-gray-500 text-sm">({meal.time})</span>
            </span>
            <button
              onClick={() => deleteMeal(index)}
              className="text-red-500 ml-4"
            >
              Delete
            </button>
          </li>
        ))}
        {meals.length === 0 && (
          <li className="text-gray-500">No meals logged.</li>
        )}
      </ul>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Meal name"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <input
          type="number"
          placeholder="Calories"
          value={mealCalories}
          onChange={(e) => setMealCalories(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={addMeal}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  );
}
