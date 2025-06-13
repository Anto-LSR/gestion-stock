import { useState, useEffect } from "react";
import ArticleList from "../components/articles/ArticleList";
import CommandeList from "../components/commandes/CommandeList";

function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [articles, setArticles] = useState([]);

  const fetchCommandes = async () => {
    try {
      if (window.api && typeof window.api.getAllCommandesWithLignes === "function") {
        const fetchedCommandes = await window.api.getAllCommandesWithLignes();
        setCommandes(fetchedCommandes);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes", error);
    }
  };

  const fetchClients = async () => {
    try {
      if (window.api && typeof window.api.getAllClients === "function") {
        const fetchedClients = await window.api.getAllClients();
        setClients(fetchedClients);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des clients", error);
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
    fetchCommandes();
    fetchClients();
    fetchArticles();
  }, []);

  return (
    <div className="container mt-4">
      <CommandeList commandes={commandes} fetchCommandes={fetchCommandes} clients={clients} fetchClients={fetchClients} articles={articles} />
    </div>
  );
}

export default Commandes;
