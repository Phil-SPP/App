import React from "react";
import "./style.css"; // Falls spezifische Stile für die BottomNavigation vorhanden sind

const BottomNavigation = ({ toggleDarkMode }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md">
      <div className="flex justify-around items-center py-3">
        {/* Start Button */}
        <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition duration-200">
          <span className="text-xl">🏠</span>
          <span className="text-sm">Start</span>
        </button>

        {/* Wunschlisten Button */}
        <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition duration-200">
          <span className="text-xl">📜</span>
          <span className="text-sm">Wunschlisten</span>
        </button>

        {/* Dark Mode Button */}
        <button
          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition duration-200"
          onClick={toggleDarkMode}
        >
          <span className="text-xl">🌙</span>
          <span className="text-sm">Dark Mode</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
