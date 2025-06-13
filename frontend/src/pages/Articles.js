import { useState, useEffect } from "react";
import ArticleList from "../components/articles/ArticleList";

function Articles() {
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    try {
      if (window.api && typeof window.api.getAllArticles === "function") {
        const fetchedArticles = await window.api.getAllArticles();        
        setArticles(fetchedArticles);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des articles", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="container mt-4">
      <ArticleList articles={articles} fetchArticles={fetchArticles} />
    </div>
  );
}

export default Articles;
