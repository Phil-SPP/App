import React, { useEffect, useState } from "react";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const WuenscherDashboard = () => {
  const [wishlists, setWishlists] = useState([]);
  const [newWishlistName, setNewWishlistName] = useState(""); // Name der neuen Wunschliste
  const [newArticle, setNewArticle] = useState({
    name: "",
    link: "",
    preview: "",
  }); // Neuer Artikel
  const [selectedWishlist, setSelectedWishlist] = useState(null); // Ausgewählte Wunschliste

  // Für jede Wunschliste ein Zustand, ob die Artikel-Eingabefelder sichtbar sind
  const [isAddArticleVisible, setIsAddArticleVisible] = useState({});

  // Wunschlisten aus Firestore laden
  const fetchWishlists = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Benutzer-Daten aus Firestore:", userData);

        const wishlists = userData.wishlists || [];
        setWishlists(wishlists);
      } else {
        console.error("Benutzer-Dokument nicht gefunden!");
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Wunschlisten:", error);
    }
  };

  // Wunschliste erstellen und speichern
  const createWishlist = async () => {
    if (newWishlistName.trim() === "") {
      console.error("Der Name der Wunschliste darf nicht leer sein.");
      return;
    }

    const newWishlist = {
      id: Date.now().toString(), // Eine eindeutige ID für die Wunschliste
      name: newWishlistName,
      createdAt: new Date().toISOString(),
      articles: [], // Starten mit einer leeren Artikelliste
    };

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        wishlists: arrayUnion(newWishlist), // Wunschliste zu Firestore hinzufügen
      });

      // Lokale Wunschlisten aktualisieren
      setWishlists((prevWishlists) => [...prevWishlists, newWishlist]);
      setNewWishlistName(""); // Eingabefeld nach dem Speichern zurücksetzen
    } catch (error) {
      console.error("Fehler beim Erstellen der Wunschliste:", error);
    }
  };

  // Artikel zu einer Wunschliste hinzufügen
  const addArticleToWishlist = async (wishlistId) => {
    if (!newArticle.name || !newArticle.link) {
      console.error("Artikelname und Link sind erforderlich.");
      return;
    }

    const newArticleData = {
      name: newArticle.name,
      link: newArticle.link,
      preview: newArticle.preview || "",
    };

    // Artikel zur lokalen Wunschliste hinzufügen
    const updatedWishlists = wishlists.map((wishlist) =>
      wishlist.id === wishlistId
        ? { ...wishlist, articles: [...wishlist.articles, newArticleData] }
        : wishlist
    );
    setWishlists(updatedWishlists);

    // Artikel in Firestore hinzufügen
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      wishlists: updatedWishlists,
    });

    setNewArticle({ name: "", link: "", preview: "" }); // Eingabefelder zurücksetzen
    setIsAddArticleVisible((prev) => ({ ...prev, [wishlistId]: false })); // Eingabefelder wieder schließen
  };

  // Auswahl der Wunschliste für die Anzeige der Artikel
  const selectWishlist = (wishlistId) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId);
    setSelectedWishlist(wishlist);
  };

  // useEffect, um die Wunschlisten nach dem ersten Laden zu holen
  useEffect(() => {
    fetchWishlists();
  }, []);

  // Funktion zum Umschalten der Sichtbarkeit der Artikel hinzufügen-Eingabefelder
  const toggleAddArticle = (wishlistId) => {
    setIsAddArticleVisible((prevState) => ({
      ...prevState,
      [wishlistId]: !prevState[wishlistId],
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Wünscher Dashboard</h2>

      {/* Wunschlisten-Kacheln */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlists.map((wishlist) => (
          <div
            key={wishlist.id}
            className="p-4 border rounded-lg cursor-pointer"
            onClick={() => selectWishlist(wishlist.id)}
          >
            <h3 className="text-lg font-bold">{wishlist.name}</h3>
            <p>Erstellt am: {new Date(wishlist.createdAt).toLocaleDateString()}</p>
            
            {/* Button zum Hinzufügen eines Artikels */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Verhindert das Öffnen der Wunschliste beim Klicken auf den Button
                toggleAddArticle(wishlist.id);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
            >
              Artikel hinzufügen
            </button>

            {/* Formular zum Hinzufügen eines Artikels, falls sichtbar */}
            {isAddArticleVisible[wishlist.id] && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Artikelname"
                  value={newArticle.name}
                  onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
                  className="p-2 border rounded-lg mr-4 mb-2"
                />
                <input
                  type="text"
                  placeholder="Artikellink"
                  value={newArticle.link}
                  onChange={(e) => setNewArticle({ ...newArticle, link: e.target.value })}
                  className="p-2 border rounded-lg mr-4 mb-2"
                />
                <input
                  type="text"
                  placeholder="Vorschau-URL"
                  value={newArticle.preview}
                  onChange={(e) => setNewArticle({ ...newArticle, preview: e.target.value })}
                  className="p-2 border rounded-lg mr-4 mb-2"
                />
                <button
                  onClick={() => addArticleToWishlist(wishlist.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Artikel hinzufügen
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Anzeige der Artikel der ausgewählten Wunschliste */}
      {selectedWishlist && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Artikel in {selectedWishlist.name}</h3>
          <ul>
            {selectedWishlist.articles.length > 0 ? (
              selectedWishlist.articles.map((article, index) => (
                <li key={index}>
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    {article.name}
                  </a>
                </li>
              ))
            ) : (
              <p>Keine Artikel gefunden.</p>
            )}
          </ul>
        </div>
      )}

      {/* Formular zum Erstellen einer neuen Wunschliste */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Name der Wunschliste"
          value={newWishlistName}
          onChange={(e) => setNewWishlistName(e.target.value)}
          className="p-2 border rounded-lg mr-4"
        />
        <button
          onClick={createWishlist}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Wunschliste erstellen
        </button>
      </div>
    </div>
  );
};

export default WuenscherDashboard;
