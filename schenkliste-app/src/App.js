import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import WuenscherDashboard from "./WuenscherDashboard";
import SchenkerDashboard from "./SchenkerDashboard";
import RoleSwitcher from "./RoleSwitcher";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("wuenscher"); // Standardrolle: Wünscher

  const handleLogin = () => {
    setIsAuthenticated(true); // Authentifizierung bestätigen
  };

  return (
    <div className="container">
      <h1>Schenkliste</h1>
      
      {!isAuthenticated ? (
        <>
          <Register onLogin={handleLogin} />
          <Login onLogin={handleLogin} />
        </>
      ) : (
        <>
          <RoleSwitcher role={role} setRole={setRole} />
          {role === "wuenscher" && <WuenscherDashboard />}
          {role === "schenker" && <SchenkerDashboard />}
        </>
      )}
    </div>
  );
}

export default App;
