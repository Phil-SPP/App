import React from "react";
import "./style.css"; // Falls spezifische Stile für Artikelkarten vorhanden sind


const ArticleCard = ({ article }) => {
    return (
      <div className="flex items-center bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
        <img
          src={article.preview}
          alt={article.name}
          className="w-16 h-16 rounded-lg object-cover mr-4"
        />
        <div>
          <h3 className="text-lg font-bold">{article.name}</h3>
          <a href={article.link} className="text-blue-500 text-sm">
            Zum Artikel
          </a>
        </div>
      </div>
    );
  };
  
  export default ArticleCard;
  