import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const AddArticleForm = ({ wishlist, setWishlists, wishlists }) => {
  const [newArticle, setNewArticle] = useState({ name: "", link: "", preview: "" });

  const addArticle = async () => {
    console.log("Aktuelle Wunschliste:", wishlist);
    console.log("Alle Wunschlisten:", wishlists);
  
    if (!newArticle.name || !newArticle.link) {
      console.error("Artikelname und Link sind erforderlich!");
      return;
    }
  
    try {
      const userRef = doc(db, "users", wishlist.userId);
  
      // Aktualisiere nur die Artikel in der spezifischen Wunschliste
      const updatedArticles = [...(wishlist.articles || []), newArticle];
  
      await updateDoc(userRef, {
        wishlists: wishlists.map((w) =>
          w.id === wishlist.id
            ? { ...w, articles: updatedArticles }
            : w
        ),
      });
  
      // Lokale Wunschlisten aktualisieren
      setWishlists((prevWishlists) =>
        prevWishlists.map((w) =>
          w.id === wishlist.id
            ? { ...w, articles: updatedArticles }
            : w
        )
      );
  
      setNewArticle({ name: "", link: "", preview: "" });
      console.log("Artikel erfolgreich hinzugefügt!");
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Artikels:", error);
    }
  };
  
  

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Neuen Artikel hinzufügen</h3>
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
    </div>
  );
};

export default AddArticleForm;
