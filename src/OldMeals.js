import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OldMeals.css";

const apiUrl = process.env.REACT_APP_API_URL;

function OldMeals() {
  const [meals, setMeals] = useState([]);
  const mealCategories = ["الفطور", "سناك 1", "الغداء", "سناك 2", "العشاء"];

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(`${apiUrl}/meals`);
        setMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  const deleteMeal = async (mealId) => {
    try {
      await axios.delete(`${apiUrl}/meals/${mealId}`);
      setMeals(meals.filter((meal) => meal._id !== mealId));
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  return (
    <div className="container">
      <h2>قائمة الوجبات القديمة</h2>
      <div className="meals-table-container">
        {meals.length > 0 ? (
          <table className="meals-table">
            <thead>
              <tr>
                {mealCategories.map((category) => (
                  <th key={category}>{category}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {mealCategories.map((category) => (
                  <td key={category}>
                    <ul>
                      {meals
                        .filter((meal) => meal.category === category)
                        .map((meal, index) => (
                          <li key={meal._id}>
                            <strong>{meal.name}</strong> - {meal.calories} سعر
                            حراري
                            <button
                              className="delete-button"
                              onClick={() => deleteMeal(meal._id)}
                            >
                              x
                            </button>
                          </li>
                        ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <p>لا توجد وجبات محفوظة</p>
        )}
      </div>
    </div>
  );
}

export default OldMeals;
