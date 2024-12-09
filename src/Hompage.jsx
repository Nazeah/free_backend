import React, { useState } from "react";

function Homepage({ navigateToPlan }) {
  const [wrongAnswer, setWrongAnswer] = useState(false);

  const handleAnswer = (answer) => {
    if (answer === "Nazaeh") {
      navigateToPlan();
    } else {
      setWrongAnswer(true);
    }
  };

  return (
    <div className="homepage">
      <h1>وين رح نعمل احلى عرس بالعالم ؟؟؟؟؟</h1>
      <div className="options">
        {/* Large Nazaeh Button */}
        <button className="nazaeh-btn" onClick={() => handleAnswer("Nazaeh")}>
          فندق الحرييييييير
        </button>
        {/* Small Other Button */}
        <button className="other-btn" onClick={() => handleAnswer("Other")}>
          الشيراتون
        </button>
      </div>
      {wrongAnswer && (
        <div className="wrong-answer">❌ خطأ! حاول مرة أخرى.</div>
      )}
    </div>
  );
}

export default Homepage;
