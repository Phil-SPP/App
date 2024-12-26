import React from "react";
import ArticleCard from "./ArticleCard";
import "./style.css"; // Falls spezifische Stile für die Artikelliste vorhanden sind


const ArticleList = ({ articles }) => {
    if (!articles || articles.length === 0) {
      return <p className="text-gray-500">Keine Artikel in dieser Wunschliste.</p>;
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
          >
            <h4 className="text-lg font-bold">{article.name}</h4>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              Zum Artikel
            </a>
            {article.preview && (
              <img
                src={article.preview}
                alt={article.name}
                className="w-full h-32 object-cover mt-2 rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default ArticleList;
  