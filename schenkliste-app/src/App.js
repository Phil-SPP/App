import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import WuenscherDashboard from "./WuenscherDashboard";
import SchenkerDashboard from "./SchenkerDashboard";
import RoleSwitcher from "./RoleSwitcher";
import BottomNavigation from "./BottomNavigation";
import "./App.css"; // Falls spezifische App-Stile vorhanden sind
import "./index.css"; // Tailwind oder globale Stile


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true); // Authentifizierung bestätigen
  };

  return (
    <div>
      {!isAuthenticated ? (
        <>
          <Register onLogin={handleLogin} />
          <Login onLogin={handleLogin} />
        </>
      ) : (
        <WuenscherDashboard />
      )}
    </div>
  );
}

export default App;
