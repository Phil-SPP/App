import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./style.css"; // Falls spezifische Stile für Login vorhanden sind

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(); // Benutzer ist eingeloggt, Dashboard anzeigen
    } catch (error) {
      setError("Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-Mail
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mt-1"
          placeholder="Deine E-Mail-Adresse"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Passwort
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mt-1"
          placeholder="Dein Passwort"
        />
      </div>

      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Einloggen
      </button>

      <div className="text-center mt-4">
        <span
          className="text-sm text-gray-600 cursor-pointer"
          onClick={() => {
            setError(""); // Clear error when switching
            // Wechseln zu Register
          }}
        >
          Noch kein Konto? Jetzt registrieren
        </span>
      </div>
    </div>
  );
};

export default Login;
