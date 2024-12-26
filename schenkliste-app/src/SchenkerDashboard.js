import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const SchenkerDashboard = () => {
  const [users, setUsers] = useState([]); // Alle Nutzer
  const [expandedUser, setExpandedUser] = useState(null); // Ausgeklappter Nutzer
  const [expandedWishlist, setExpandedWishlist] = useState(null); // Ausgeklappte Wunschliste

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
    fetchUsers();
  }, []);

  const toggleUserAccordion = (userId) => {
    setExpandedUser((prev) => (prev === userId ? null : userId));
    setExpandedWishlist(null);
  };

  const toggleWishlistAccordion = (wishlistId) => {
    setExpandedWishlist((prev) => (prev === wishlistId ? null : wishlistId));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Schenker Dashboard</h2>
      <div className="row justify-content-center">
        {users.map((user) => (
          <div key={user.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card shadow border-0">
              <div
                className="card-body text-center cursor-pointer"
                onClick={() => toggleUserAccordion(user.id)}
              >
                <img
                  src={user.avatar || "https://via.placeholder.com/100"}
                  alt="Avatar"
                  className="rounded-circle mb-3 shadow-sm"
                  width="80"
                  height="80"
                />
                <h5 className="mb-0">{user.email}</h5>
              </div>

              {expandedUser === user.id && (
                <div className="card-body">
                  <h6 className="text-muted text-center mb-3">Wunschlisten:</h6>
                  {user.wishlists && user.wishlists.length > 0 ? (
                    user.wishlists.map((wishlist) => (
                      <div key={wishlist.id} className="mb-3">
                        <button
                          className="btn btn-outline-primary w-100 text-start"
                          onClick={() => toggleWishlistAccordion(wishlist.id)}
                        >
                          {wishlist.name}
                        </button>
                        {expandedWishlist === wishlist.id && (
                          <div className="mt-2">
                            {wishlist.articles && wishlist.articles.length > 0 ? (
                              <ul className="list-group">
                                {wishlist.articles.map((article, index) => (
                                  <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                  >
                                    <a
                                      href={article.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-none text-primary"
                                    >
                                      {article.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted text-center mt-2">
                                Keine Artikel gefunden.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center">Keine Wunschlisten gefunden.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchenkerDashboard;
