import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DayDetail() {
  const { dayName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('calorieData');
    return stored ? JSON.parse(stored) : {};
  });

  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const [editIndex, setEditIndex] = useState(null);
  const [editMeal, setEditMeal] = useState({});

  const meals = data[dayName]?.meals || [];

  const addMeal = () => {
    const calories = parseInt(mealCalories);
    const proteinVal = protein !== '' ? parseFloat(protein) : null;
    const carbsVal = carbs !== '' ? parseFloat(carbs) : null;
    const fatVal = fat !== '' ? parseFloat(fat) : null;

    if (!isNaN(calories) && calories > 0 && mealName.trim() !== '') {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newMeal = {
        name: mealName.trim(),
        calories,
        time: timestamp,
      };

      if (proteinVal !== null) newMeal.protein = proteinVal;
      if (carbsVal !== null) newMeal.carbs = carbsVal;
      if (fatVal !== null) newMeal.fat = fatVal;

      const updatedMeals = [...meals, newMeal];

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

      setMealName('');
      setMealCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
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

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditMeal(meals[index]);
  };

  const handleEditChange = (key, value) => {
    setEditMeal((prev) => ({ ...prev, [key]: value }));
  };

  const saveEditedMeal = () => {
    const updatedMeals = [...meals];
    updatedMeals[editIndex] = {
      ...editMeal,
      calories: parseInt(editMeal.calories),
      protein: parseFloat(editMeal.protein || 0),
      carbs: parseFloat(editMeal.carbs || 0),
      fat: parseFloat(editMeal.fat || 0),
    };

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
    setEditIndex(null);
    setEditMeal({});
  };

  const readableDate = new Date(dayName).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const totalMacros = meals.reduce(
    (totals, m) => {
      totals.protein += m.protein || 0;
      totals.carbs += m.carbs || 0;
      totals.fat += m.fat || 0;
      return totals;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  const macroTotal = totalMacros.protein + totalMacros.carbs + totalMacros.fat;
  const macroPercentages =
    macroTotal > 0
      ? [
          { name: 'Protein', value: Math.round((totalMacros.protein / macroTotal) * 100) },
          { name: 'Carbs', value: Math.round((totalMacros.carbs / macroTotal) * 100) },
          { name: 'Fat', value: Math.round((totalMacros.fat / macroTotal) * 100) },
        ]
      : [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back
      </button>
      <h2 className="text-xl font-bold mb-2">{readableDate}</h2>

      {meals.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-700">
            <strong>Daily Totals:</strong><br />
            Calories: {data[dayName].total} kcal<br />
            Protein: {totalMacros.protein} g, Carbs: {totalMacros.carbs} g, Fat: {totalMacros.fat} g
          </div>

          <div className="mb-4" style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroPercentages}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ value }) => `${value}%`}
                >
                  {macroPercentages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <ul className="mb-4">
        {meals.map((meal, index) => (
          <li key={index} className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              {editIndex === index ? (
  <div className="text-gray-500">
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Meal name"
        value={editMeal.name}
        onChange={(e) => handleEditChange('name', e.target.value)}
        className="border px-2 py-1 rounded w-full"
      />
   
      <input
        type="number"
        placeholder="calories"
        value={editMeal.calories}
        onChange={(e) => handleEditChange('calories', e.target.value)}
        className="cal"
      />
    </div>
    <br />
    <div className="mb-2">
      <input
        type="number"
        placeholder="Protein"
        value={editMeal.protein || ''}
        onChange={(e) => handleEditChange('protein', e.target.value)}
        className="Nutr"
      />
   
      <input
        type="number"
        placeholder="Carbs"
        value={editMeal.carbs || ''}
        onChange={(e) => handleEditChange('carbs', e.target.value)}
        className="Nutr"
      />
   
      <input
        type="number"
        placeholder="Fat"
        value={editMeal.fat || ''}
        onChange={(e) => handleEditChange('fat', e.target.value)}
        className="Nutr"
      />
 
      <button onClick={saveEditedMeal} className="but">
        Save
      </button>
      <button onClick={() => setEditIndex(null)} className="but">
        Cancel
      </button>
    </div>
  </div>
              ) : (
                <div className="flex justify-between w-full">
                  <span onClick={() => handleEditClick(index)} className="cursor-pointer">
                    <strong>{meal.name}</strong>: {meal.calories} kcal{' '}
                    <span className="text-gray-500 text-sm">({meal.time})</span>
                    <br />
                    {meal.protein !== undefined && (
                      <span className="text-sm text-gray-600">
                        Protein: {meal.protein}g, Carbs: {meal.carbs || 0}g, Fat: {meal.fat || 0}g
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => deleteMeal(index)}
                    className="but"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
        {meals.length === 0 && (
          <li className="text-gray-500">No meals logged.</li>
        )}
      </ul>

      <div className="flex flex-col gap-2">
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
          className="cal"
        />
        <button
          onClick={addMeal}
          className="addMeal"
        >
          Add Meal
        </button>
      </div>
      <br />
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Protein"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          className="Nutr"
        />
        <input
          type="number"
          placeholder="Carbs"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
          className="Nutr"
        />
        <input
          type="number"
          placeholder="Fat"
          value={fat}
          onChange={(e) => setFat(e.target.value)}
          className="Nutr"
        />
      </div>
    </div>
  );
}
