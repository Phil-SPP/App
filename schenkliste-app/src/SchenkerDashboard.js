import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const SchenkerDashboard = () => {
  const [users, setUsers] = useState([]); // Alle Nutzer
  const [expandedUser, setExpandedUser] = useState(null); // Ausgeklappter Nutzer
  const [expandedWishlist, setExpandedWishlist] = useState(null); // Ausgeklappte Wunschliste

  // Alle Nutzer aus Firestore laden
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Fehler beim Laden der Nutzer:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Nutzer beim ersten Laden abrufen
  }, []);

  // Akkordeon für Nutzer toggeln
  const toggleUserAccordion = (userId) => {
    setExpandedUser((prev) => (prev === userId ? null : userId));
    setExpandedWishlist(null); // Zurücksetzen der ausgeklappten Wunschliste
  };

  // Akkordeon für Wunschlisten toggeln
  const toggleWishlistAccordion = (wishlistId) => {
    setExpandedWishlist((prev) => (prev === wishlistId ? null : wishlistId));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Schenker Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded-lg shadow-md">
            <div
              className="cursor-pointer flex items-center"
              onClick={() => toggleUserAccordion(user.id)}
            >
              <img
                src={user.avatar || "https://via.placeholder.com/100"}
                alt="Avatar"
                className="w-16 h-16 rounded-full mr-4"
              />
              <h4 className="font-bold">{user.email}</h4>
            </div>
            {/* Wunschlisten Akkordeon */}
            {expandedUser === user.id && (
              <div className="mt-4">
                {user.wishlists && user.wishlists.length > 0 ? (
                  user.wishlists.map((wishlist) => (
                    <div key={wishlist.id} className="mb-4">
                      <div
                        className="p-2 border rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
                        onClick={() => toggleWishlistAccordion(wishlist.id)}
                      >
                        <h5 className="font-bold">{wishlist.name}</h5>
                      </div>
                      {/* Artikel Akkordeon */}
                      {expandedWishlist === wishlist.id && (
                        <div className="mt-2 ml-4">
                          {wishlist.articles && wishlist.articles.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {wishlist.articles.map((article, index) => (
                                <li key={index}>
                                  <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500"
                                  >
                                    {article.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>Keine Artikel gefunden.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>Keine Wunschlisten gefunden.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchenkerDashboard;
