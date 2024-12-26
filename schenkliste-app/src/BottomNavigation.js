import React from "react";
import "./style.css";

const BottomNavigation = ({ toggleDarkMode, onNavigate }) => {
  return (
    <div className="bg-gray-800 text-white py-4 flex justify-around">
      <button
        onClick={() => onNavigate("start")}
        className="flex flex-col items-center"
      >
        <span>🏠</span>
        <span className="text-sm">Start</span>
      </button>
      <button
        onClick={() => onNavigate("wuenscherDashboard")}
        className="flex flex-col items-center"
      >
        <span>📜</span>
        <span className="text-sm">Wunschlisten</span>
      </button>
      <button
        onClick={toggleDarkMode}
        className="flex flex-col items-center"
      >
        <span>🌙</span>
        <span className="text-sm">Dark Mode</span>
      </button>
    </div>
  );
};

export default BottomNavigation;
