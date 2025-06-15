import { useEffect, useState } from "react";
import ReceptionList from "../components/receptions/ReceptionList";

function Receptions() {
  const [receptions, setReceptions] = useState([]);
  const [articles, setArticles] = useState([]);

  const fetchReceptionsWithLignes = async () => {
    try {
      if (window.api && typeof window.api.getAllReceptionsWithLignes === "function") {
        const fetchedReceptions = await window.api.getAllReceptionsWithLignes();
        setReceptions(fetchedReceptions);
      } else {
        console.warn("La méthode getAllReceptionsWithLignes n'est pas disponible dans window.api");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des réceptions avec lignes", error);
    }
  };

  const fetchArticles = async () => {
    try {
      if (window.api && typeof window.api.getArticles === "function") {
        const fetchedArticles = await window.api.getArticles();
        setArticles(fetchedArticles);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des articles", error);
    }
  }

  useEffect(() => {
    fetchReceptionsWithLignes();
    fetchArticles();
  }, []);

  console.log(receptions);

  return (
    <div className="container mt-4">
      <ReceptionList receptions={receptions} fetchReceptions={fetchReceptionsWithLignes} articles={articles} fetchArticles={fetchArticles} />
    </div>
  );
}

export default Receptions;
