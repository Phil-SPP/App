import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "./firebaseConfig"; // Benannter Import

const Register = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nachname, setNachname] = useState("");
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Benutzer in der Firestore-Datenbank speichern
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name,
        nachname: nachname,
        registrierungsdatum: new Date().toISOString(),
      });

      onLogin(); // Weiterleitung zum Dashboard
    } catch (error) {
      alert("Fehler bei der Registrierung: " + error.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registrieren</h2>
      <input
        type="text"
        placeholder="Vorname"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Nachname"
        value={nachname}
        onChange={(e) => setNachname(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrieren</button>
    </form>
  );
};

export default Register;
