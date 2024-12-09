import React, { useState } from "react";
import axios from "axios";
import "./Meals.css";

const apiUrl = process.env.REACT_APP_API_URL;

function Meals() {
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [mealCategory, setMealCategory] = useState("");
  const mealCategories = ["الفطور", "سناك 1", "الغداء", "سناك 2", "العشاء"];

  const addMeal = async () => {
    if (mealName && mealCalories && mealCategory) {
      const newMeal = {
        name: mealName,
        calories: parseInt(mealCalories),
        category: mealCategory,
      };
      try {
        console.log("API URL:", apiUrl);
        await axios.post(`${apiUrl}/meals`, newMeal);
        alert("تمت إضافة الوجبة بنجاح!");
      } catch (error) {
        console.error("Error adding meal:", error);
      }
      setMealName("");
      setMealCalories("");
      setMealCategory("");
    }
  };

  return (
    <div className="container">
      <h2>إضافة وجبة جديدة</h2>
      <div className="meal-form">
        <input
          type="text"
          placeholder="اسم الوجبة"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="meal-name-input"
        />
        <input
          type="number"
          placeholder="السعرات الحرارية"
          value={mealCalories}
          onChange={(e) => setMealCalories(e.target.value)}
          className="meal-calories-input"
        />
        <select
          value={mealCategory}
          onChange={(e) => setMealCategory(e.target.value)}
          className="meal-category-select"
        >
          <option value="">اختر الفئة...</option>
          {mealCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button onClick={addMeal} className="add-meal-button">
          إضافة الوجبة
        </button>
      </div>
    </div>
  );
}

export default Meals;
