import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Homepage from "./Hompage";
import Table from "./table.js";
import Meals from "./Meals.js";
import OldMeals from "./OldMeals.js";

function App() {
  const [showPlan, setShowPlan] = useState(false);

  const navigateToPlan = () => {
    setShowPlan(true);
  };

  return (
    <Router>
      <div className="container">
        {showPlan ? (
          <>
            <nav>
              <Link to="/">الرئيسية</Link> |{" "}
              <Link to="/old-meals">الوجبات القديمة</Link>
            </nav>
            <Routes>
              {/* Main content route */}
              <Route
                path="/"
                element={
                  <div>
                    <Table />
                    <Meals />
                  </div>
                }
              />
              {/* Old Meals page route */}
              <Route path="/old-meals" element={<OldMeals />} />
            </Routes>
          </>
        ) : (
          // Render the Homepage component initially
          <Homepage navigateToPlan={navigateToPlan} />
        )}
      </div>
    </Router>
  );
}

export default App;
