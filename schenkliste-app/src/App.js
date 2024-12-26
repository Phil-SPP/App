import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import WuenscherDashboard from "./WuenscherDashboard";
import SchenkerDashboard from "./SchenkerDashboard";
import RoleSwitcher from "./RoleSwitcher";
import BottomNavigation from "./BottomNavigation";
import Navbar from "./Navbar";
import "./App.css";
import "./index.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [role, setRole] = useState("wuenscher");

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        {!isAuthenticated ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              <Login onLogin={handleLogin} />
              <Register onLogin={handleLogin} />
            </div>
          </div>
        ) : (
          <>
            {/* Header mit RoleSwitcher */}
            <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Schenkliste App</h1>
              <RoleSwitcher role={role} setRole={setRole} />
            </header>

            {/* Dynamische Anzeige basierend auf der Rolle */}
            <main className="p-4">
              {role === "wuenscher" && <WuenscherDashboard />}
              {role === "schenker" && <SchenkerDashboard />}
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 w-full bg-gray-800 text-white">
              <BottomNavigation toggleDarkMode={toggleDarkMode} />
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
