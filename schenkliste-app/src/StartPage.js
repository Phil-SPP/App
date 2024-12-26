import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const StartPage = ({ navigateToRole }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWishlists, setTotalWishlists] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);

  const fetchDashboardData = () => {
    const usersCollection = collection(db, "users");

    // Live-Update mit onSnapshot
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => doc.data());

      // Benutzeranzahl
      setTotalUsers(usersData.length);

      // Wunschlisten- und Artikelanzahl
      let wishlistsCount = 0;
      let articlesCount = 0;

      usersData.forEach((user) => {
        if (user.wishlists) {
          wishlistsCount += user.wishlists.length;
          articlesCount += user.wishlists.reduce(
            (total, wishlist) => total + (wishlist.articles ? wishlist.articles.length : 0),
            0
          );
        }
      });

      setTotalWishlists(wishlistsCount);
      setTotalArticles(articlesCount);
    });

    // Cleanup bei unmount
    return () => unsubscribe();
  };

  useEffect(() => {
    const unsubscribe = fetchDashboardData();
    return unsubscribe; // Cleanup-Funktion
  }, []);

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-75 bg-light dark-mode">
      <h1 className="h3 font-weight-bold mb-3 text-center">
        Willkommen bei der Schenkliste App!
      </h1>
      <div className="d-flex gap-2 mb-4">
        <button
          onClick={() => navigateToRole("wuenscher")}
          className="btn btn-primary btn-md px-3 py-2"
        >
          Wünscher
        </button>
        <button
          onClick={() => navigateToRole("schenker")}
          className="btn btn-success btn-md px-3 py-2"
        >
          Schenker
        </button>
      </div>

      {/* Dashboard */}
      <div className="bg-white dark:bg-dark shadow p-4 rounded-lg text-center w-100" style={{ maxWidth: "400px" }}>
        <h4 className="font-weight-bold mb-3">Dashboard</h4>
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="mb-1">{totalUsers}</h5>
            <p className="text-muted">Benutzer</p>
          </div>
          <div>
            <h5 className="mb-1">{totalWishlists}</h5>
            <p className="text-muted">Wunschlisten</p>
          </div>
          <div>
            <h5 className="mb-1">{totalArticles}</h5>
            <p className="text-muted">Artikel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
