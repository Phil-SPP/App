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
  const [isAddArticleVisible, setIsAddArticleVisible] = useState({});

  const fetchWishlists = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const wishlists = userData.wishlists || [];
        setWishlists(wishlists);
      } else {
        console.error("Benutzer-Dokument nicht gefunden!");
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Wunschlisten:", error);
    }
  };

  const createWishlist = async () => {
    if (newWishlistName.trim() === "") {
      console.error("Der Name der Wunschliste darf nicht leer sein.");
      return;
    }

    const newWishlist = {
      id: Date.now().toString(),
      name: newWishlistName,
      createdAt: new Date().toISOString(),
      articles: [],
    };

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        wishlists: arrayUnion(newWishlist),
      });

      setWishlists((prevWishlists) => [...prevWishlists, newWishlist]);
      setNewWishlistName("");
    } catch (error) {
      console.error("Fehler beim Erstellen der Wunschliste:", error);
    }
  };

  const deleteWishlist = async (wishlistId) => {
    try {
      const updatedWishlists = wishlists.filter((wishlist) => wishlist.id !== wishlistId);
      setWishlists(updatedWishlists);

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        wishlists: updatedWishlists,
      });

      console.log(`Wunschliste mit ID ${wishlistId} gelöscht.`);
    } catch (error) {
      console.error("Fehler beim Löschen der Wunschliste:", error);
    }
  };

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

    const updatedWishlists = wishlists.map((wishlist) =>
      wishlist.id === wishlistId
        ? { ...wishlist, articles: [...wishlist.articles, newArticleData] }
        : wishlist
    );
    setWishlists(updatedWishlists);

    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      wishlists: updatedWishlists,
    });

    setNewArticle({ name: "", link: "", preview: "" });
    setIsAddArticleVisible((prev) => ({ ...prev, [wishlistId]: false }));
  };

  const selectWishlist = (wishlistId) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId);
    setSelectedWishlist(wishlist);
  };

  const toggleAddArticle = (wishlistId) => {
    setIsAddArticleVisible((prevState) => ({
      ...prevState,
      [wishlistId]: !prevState[wishlistId],
    }));
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-6">
        {/* Wunschlisten-Kacheln */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlists.map((wishlist) => (
            <div
              key={wishlist.id}
              className="relative p-4 border border-gray-300 rounded-lg cursor-pointer shadow-md hover:bg-gray-50 transition"
              onClick={() => selectWishlist(wishlist.id)}
            >
              {/* Button zum Löschen */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWishlist(wishlist.id);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-700"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold">{wishlist.name}</h3>
              <p>Erstellt am: {new Date(wishlist.createdAt).toLocaleDateString()}</p>

              {/* Button zum Hinzufügen eines Artikels */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAddArticle(wishlist.id);
                }}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Artikel hinzufügen
              </button>

              {/* Artikel hinzufügen Formular */}
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-4">
        <div className="text-center">
          <p>&copy; 2024 Schenkliste App. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
};

export default WuenscherDashboard;
