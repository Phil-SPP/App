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
    <div className="container mt-4">
      <div className="row">
        {/* Formular zum Erstellen einer neuen Wunschliste */}
        <div className="col-12 mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Name der Wunschliste"
              value={newWishlistName}
              onChange={(e) => setNewWishlistName(e.target.value)}
            />
            <button className="btn btn-primary" onClick={createWishlist}>
              Wunschliste erstellen
            </button>
          </div>
        </div>

        {/* Wunschlisten-Kacheln */}
        {wishlists.map((wishlist) => (
          <div key={wishlist.id} className="col-lg-4 col-md-6 mb-4">
            <div
              className="card shadow-sm"
              onClick={() => selectWishlist(wishlist.id)}
            >
              <div className="card-body position-relative">
                {/* Wunschliste löschen */}
                <button
                  className="btn-close position-absolute top-0 end-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWishlist(wishlist.id);
                  }}
                ></button>
                <h5 className="card-title">{wishlist.name}</h5>
                <p className="card-text">
                  Erstellt am: {new Date(wishlist.createdAt).toLocaleDateString()}
                </p>

                {/* Button zum Hinzufügen eines Artikels */}
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAddArticle(wishlist.id);
                  }}
                >
                  Artikel hinzufügen
                </button>

                {/* Artikel hinzufügen Formular */}
                {isAddArticleVisible[wishlist.id] && (
                  <div className="mt-3">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Artikelname"
                      value={newArticle.name}
                      onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Artikellink"
                      value={newArticle.link}
                      onChange={(e) => setNewArticle({ ...newArticle, link: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Vorschau-URL"
                      value={newArticle.preview}
                      onChange={(e) => setNewArticle({ ...newArticle, preview: e.target.value })}
                    />
                    <button
                      className="btn btn-success w-100"
                      onClick={() => addArticleToWishlist(wishlist.id)}
                    >
                      Artikel hinzufügen
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Anzeige der Artikel der ausgewählten Wunschliste */}
        {selectedWishlist && (
          <div className="col-12 mt-4">
            <h3 className="h5">Artikel in {selectedWishlist.name}</h3>
            <ul className="list-group">
              {selectedWishlist.articles.length > 0 ? (
                selectedWishlist.articles.map((article, index) => (
                  <li key={index} className="list-group-item">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      {article.name}
                    </a>
                  </li>
                ))
              ) : (
                <li className="list-group-item">Keine Artikel gefunden.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WuenscherDashboard;
