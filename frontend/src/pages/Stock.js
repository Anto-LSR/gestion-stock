import { useEffect, useState } from "react";
import StockList from "../components/Stock/stock-list";

function Stock() {
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

  console.log(articles);

  return (
    <div className="container mt-4">
      <StockList articles={articles} fetchArticles={fetchArticles} />
    </div>
  )
}

export default Stock;
