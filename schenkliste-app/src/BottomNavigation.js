import React from "react";
import "./style.css"; // Stile für die untere Navigation


const BottomNavigation = ({ toggleDarkMode }) => {
    return (
      <div className="flex justify-around">
        <button className="flex flex-col items-center">
          <span>🏠</span>
          <span className="text-sm">Start</span>
        </button>
        <button className="flex flex-col items-center">
          <span>📜</span>
          <span className="text-sm">Wunschlisten</span>
        </button>
        <button className="flex flex-col items-center" onClick={toggleDarkMode}>
          <span>🌙</span>
          <span className="text-sm">Dark Mode</span>
        </button>
      </div>
    );
  };
  
  export default BottomNavigation;
  