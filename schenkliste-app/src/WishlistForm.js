import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import "./style.css"; // Falls Formular-spezifische Stile vorhanden sind


const WishlistForm = ({ userId, wishlists, setWishlists }) => {
  const [wishlist, setWishlist] = useState({
    name: "",
    articles: [],
  });
  const [newArticle, setNewArticle] = useState({ name: "", link: "", preview: "" });

  const addArticle = () => {
    if (!newArticle.name || !newArticle.link) {
      console.error("Artikelname und Link sind erforderlich!");
      return;
    }

    setWishlist((prevWishlist) => ({
      ...prevWishlist,
      articles: [...prevWishlist.articles, newArticle],
    }));

    setNewArticle({ name: "", link: "", preview: "" });
  };

  const saveWishlist = async () => {
    console.log("Speichern der Wunschliste gestartet:", wishlist);
  
    if (!wishlist.name) {
      console.error("Der Name der Wunschliste ist erforderlich!");
      return;
    }
  
    try {
      const userRef = doc(db, "users", userId);
      console.log("Firestore-Referenz:", userRef);
  
      // Wunschliste an Firestore senden
      await updateDoc(userRef, {
        wishlists: arrayUnion({ ...wishlist, id: Date.now().toString() }),
      });
  
      console.log("Wunschliste erfolgreich an Firestore gesendet!");
  
      // Lokale Wunschlisten aktualisieren
      setWishlists([...wishlists, { ...wishlist, id: Date.now().toString() }]);
  
      // Formular zurücksetzen
      setWishlist({ name: "", articles: [] });
      console.log("Wunschliste lokal aktualisiert!");
    } catch (error) {
      console.error("Fehler beim Speichern der Wunschliste in Firestore:", error);
    }
  };
  

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Neue Wunschliste erstellen</h3>

      <input
        type="text"
        placeholder="Name der Wunschliste"
        value={wishlist.name}
        onChange={(e) =>
          setWishlist((prevWishlist) => ({ ...prevWishlist, name: e.target.value }))
        }
        className="p-2 border border-gray-300 rounded-lg mb-4 w-full"
      />

      <h4 className="font-bold">Artikel hinzufügen</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Artikelname"
          value={newArticle.name}
          onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
          className="p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Artikellink"
          value={newArticle.link}
          onChange={(e) => setNewArticle({ ...newArticle, link: e.target.value })}
          className="p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Vorschau-URL"
          value={newArticle.preview}
          onChange={(e) => setNewArticle({ ...newArticle, preview: e.target.value })}
          className="p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        onClick={addArticle}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Artikel hinzufügen
      </button>

      <h4 className="font-bold mt-6">Aktuelle Artikel</h4>
      <ul className="list-disc list-inside">
        {wishlist.articles.map((article, index) => (
          <li key={index}>
            {article.name} - <a href={article.link}>{article.link}</a>
          </li>
        ))}
      </ul>

      <button
        onClick={saveWishlist}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Wunschliste speichern
      </button>
    </div>
  );
};

export default WishlistForm;
