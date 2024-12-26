import React, { useState } from "react";
import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./style.css"; // Falls spezifische Stile für Register vorhanden sind

const Register = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Benutzer in Firestore erstellen
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        wishlists: [],
      });

      console.log("Benutzer erfolgreich registriert!");
      onLogin(); // Nach Registrierung einloggen
    } catch (error) {
      setError("Fehler bei der Registrierung. Überprüfe deine Eingaben.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Registrierung</h2>

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
        onClick={handleRegister}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Registrieren
      </button>

      <div className="text-center mt-4">
        <span
          className="text-sm text-gray-600 cursor-pointer"
          onClick={() => {
            setError(""); // Clear error when switching
            // Wechseln zu Login
          }}
        >
          Schon ein Konto? Zum Login
        </span>
      </div>
    </div>
  );
};

export default Register;
