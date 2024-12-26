import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig";
import WishlistCard from "./WishlistCard";

const WishlistsComponent = ({ wishlists, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {wishlists.map((wishlist) => (
        <WishlistCard key={wishlist.id} wishlist={wishlist} onSelect={onSelect} />
      ))}
    </div>
  );
};

const Wishlists = () => {
  const [wishlists, setWishlists] = useState([]);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [newArticle, setNewArticle] = useState({ name: "", link: "", preview: "" });
  const [articles, setArticles] = useState([]);

  const db = getFirestore(app);
  const auth = getAuth(app);

  // Wunschlisten des aktuellen Nutzers laden
  useEffect(() => {
    const fetchWishlists = async () => {
      const user = auth.currentUser;
      const q = query(collection(db, "wunschlisten"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const lists = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWishlists(lists);
    };

    fetchWishlists();
  }, [db, auth]);

  // Neue Wunschliste erstellen
  const createWishlist = async () => {
    const newList = {
      id: Date.now().toString(),
      name: newWishlistName,
      createdAt: new Date().toISOString(),
      articles: [], // Initialisiere `articles` als leeres Array
      userId: auth.currentUser.uid,
    };
  
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        wishlists: arrayUnion(newList),
      });
  
      setWishlists([...wishlists, newList]);
      setNewWishlistName("");
    } catch (error) {
      console.error("Fehler beim Erstellen der Wunschliste:", error);
    }
  };
  
  

  return (
    <div>
      <h2>Deine Wunschlisten</h2>
      
      {/* Neue Wunschliste erstellen */}
      <div>
        <input
          type="text"
          placeholder="Name der Wunschliste"
          value={newWishlistName}
          onChange={(e) => setNewWishlistName(e.target.value)}
        />
        <button onClick={createWishlist}>Neue Wunschliste erstellen</button>
      </div>

      {/* Liste der Wunschlisten */}
      <ul>
        {wishlists.map((list) => (
          <li key={list.id} onClick={() => setSelectedWishlist(list)}>
            {list.name}
          </li>
        ))}
      </ul>

      {/* Artikel hinzufügen */}
      {selectedWishlist && (
        <div>
          <h3>{selectedWishlist.name}</h3>
          <input
            type="text"
            placeholder="Artikelname"
            value={newArticle.name}
            onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Artikellink"
            value={newArticle.link}
            onChange={(e) => setNewArticle({ ...newArticle, link: e.target.value })}
          />
          <input
            type="text"
            placeholder="Vorschau-URL"
            value={newArticle.preview}
            onChange={(e) => setNewArticle({ ...newArticle, preview: e.target.value })}
          />
          <button onClick={addArticle}>Artikel hinzufügen</button>

          {/* Vorschau der Artikel */}
          <ul>
            {articles.map((article, index) => (
              <li key={index}>
                <img src={article.preview} alt={article.name} style={{ width: "50px" }} />
                <p>{article.name}</p>
                <a href={article.link} target="_blank" rel="noopener noreferrer">Link</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Wishlists;
