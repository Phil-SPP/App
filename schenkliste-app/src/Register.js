import React, { useState } from "react";
import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./style.css"; // Falls spezifische Stile für Register vorhanden sind


const Register = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      console.error("Fehler bei der Registrierung:", error);
    }
  };

  return (
    <div>
      <h2>Registrieren</h2>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrieren</button>
    </div>
  );
};

export default Register;
