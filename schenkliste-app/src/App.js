import React, { useState, useEffect } from "react";
import Register from "./Register";
import Login from "./Login";
import WuenscherDashboard from "./WuenscherDashboard";
import SchenkerDashboard from "./SchenkerDashboard";
import BottomNavigation from "./BottomNavigation";
import StartPage from "./StartPage";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";
import "./index.css";
import "./Global.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [role, setRole] = useState("wuenscher");
  const [currentPage, setCurrentPage] = useState("start");

  // Überwachung des Authentifizierungsstatus
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCurrentPage("start");
      }
    });

    // Cleanup des Listeners
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setIsAuthenticated(false);
      setCurrentPage("start");
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigateToRole = (selectedRole) => {
    setRole(selectedRole);
    setCurrentPage(selectedRole === "wuenscher" ? "wuenscherDashboard" : "schenkerDashboard");
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="full-height d-flex flex-column">
        {!isAuthenticated ? (
          <div className="flex-center flex-grow-1">
            <div className="auth-container">
              <Login onLogin={handleLogin} />
              <Register onLogin={handleLogin} />
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="header">
              <h1 className="header-title">Schenkliste App</h1>
              <button onClick={handleLogout} className="btn-logout">
                Abmelden
              </button>
            </header>

            {/* Dynamische Anzeige basierend auf der aktuellen Seite */}
            <main className="main-content">
              {currentPage === "start" && <StartPage navigateToRole={navigateToRole} />}
              {currentPage === "wuenscherDashboard" && <WuenscherDashboard />}
              {currentPage === "schenkerDashboard" && <SchenkerDashboard />}
            </main>

            {/* Footer */}
            <footer className="footer">
              <BottomNavigation
                toggleDarkMode={toggleDarkMode}
                onNavigate={(page) => setCurrentPage(page)}
              />
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
