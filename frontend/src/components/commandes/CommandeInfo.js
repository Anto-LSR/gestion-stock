import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CommandeInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewCommande = id === "new";

  const [clients, setClients] = useState([]);
  const [articles, setArticles] = useState([]);
  const [commande, setCommande] = useState({ user_id: "", facturation: false });
  const [lignes, setLignes] = useState([]);
  const [articleTarifs, setArticleTarifs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientList, articleList, tarifsList] = await Promise.all([
          window.api.getAllClients(false),
          window.api.getAllArticles(),
          window.api.getAllTarifs(),
        ]);

        setClients(clientList);
        setArticles(articleList);
        setArticleTarifs(tarifsList);

        if (!isNewCommande) {
          const fetchedCommande = await window.api.getCommandeWithLignes(id);

          setCommande({
            ...fetchedCommande.commande,
            user_id: String(fetchedCommande.commande.user_id),
            facturation: Boolean(fetchedCommande.commande.facturation),
          });

          setLignes(
            fetchedCommande.lignes.map((l) => ({
              article_id: l.article_id,
              commande_id: l.commande_id,
              prix_unitaire: l.prix_unitaire,
              qt: l.qt,
              isExisting: true, // 👈 Ligne existante
            }))
          );
        }
      } catch (error) {
        console.error("Erreur chargement commande :", error);
        toast.error("Erreur chargement des données.");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {}, [articleTarifs]);

  const addLigne = () => {
    setLignes([...lignes, { article_id: "", qt: 1, isExisting: false }]);
  };

  const updateLigne = (index, field, value) => {
    const updated = [...lignes];

    if (field === "article_id") {
      updated[index].article_id = value;
      updated[index].prix_unitaire = null; // Réinitialise le tarif sélectionné
    } else if (field === "qt") {
      updated[index][field] = parseInt(value);
    } else {
      updated[index][field] = value;
    }

    setLignes(updated);
  };

  const removeLigne = (index) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const getTotal = () => {
    return lignes
      .reduce((total, ligne) => {
        const prix =
          ligne.prix_unitaire != null
            ? parseFloat(ligne.prix_unitaire)
            : (() => {
                const article = articles.find((a) => a.id == ligne.article_id);
                return article
                  ? parseFloat(article.prix_unitaire || article.prix || 0)
                  : 0;
              })();
        return total + prix * (ligne.qt || 1);
      }, 0)
      .toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commande.user_id) {
      toast.warning("Veuillez sélectionner un client.");
      return;
    }

    if (commande.finalisee) {
      toast.warning("Impossible de modifier une commande finalisée");
      return;
    }

    const lignesValides = lignes
      .filter((l) => l.article_id && l.qt > 0)
      .map((l) => {
        return {
          article_id: l.article_id,
          prix_unitaire:
            l.prix_unitaire != null
              ? parseFloat(l.prix_unitaire)
              : (() => {
                  const article = articles.find((a) => a.id == l.article_id);
                  return article
                    ? parseFloat(article.prix_unitaire || article.prix || 0)
                    : 0;
                })(),
          qt: l.qt,
        };
      });

    if (lignesValides.length === 0) {
      toast.warning("Ajoutez au moins un article.");
      return;
    }

    try {
      if (!isNewCommande) {
        // 🔄 Récupère l'ancienne commande pour ajustement
        const ancienneCommande = await window.api.getCommandeWithLignes(id);
        lignesValides.forEach((ligne) => {
          const article = articles.find((a) => a.id == ligne.article_id);
          const ancienneLigne = ancienneCommande.lignes.find(
            (l) => l.article_id == ligne.article_id
          );
          const ancienneQt = ancienneLigne ? ancienneLigne.qt : 0;
          const diff = ligne.qt - ancienneQt;

          if (diff > 0) {
            const stockDispo = article.stock_reel - article.stock_reserve;
            if (diff > stockDispo) {
              throw new Error(
                `Stock insuffisant pour l'article ${article.designation}`
              );
            }
          }
        });
      } else {
        // 🆕 Vérifie que chaque article a assez de stock disponible
        lignesValides.forEach((ligne) => {
          const article = articles.find((a) => a.id == ligne.article_id);
          const stockDispo = article.stock_reel - article.stock_reserve;
          if (ligne.qt > stockDispo) {
            throw new Error(
              `Stock insuffisant pour l'article ${article.designation}`
            );
          }
        });
      }

      // ✅ Si tout est bon, sauvegarde
      if (isNewCommande) {
        const newCommande = await window.api.createCommandeWithLignes({
          commande: {
            user_id: commande.user_id,
            facturation: commande.facturation,
          },
          lignes: lignesValides,
        });
        toast.success("Commande créée !");
        navigate(`/commandes/info/${newCommande.id}`);
      } else {
        await window.api.updateCommandeWithLignes({
          id,
          commande: {
            user_id: commande.user_id,
            facturation: commande.facturation,
          },
          lignes: lignesValides,
        });
        toast.success("Commande mise à jour !");
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
      toast.error("Erreur lors de l'enregistrement. " + error.message || error);
    }
  };

  return (
    <div className="container mt-4">
      <button
        onClick={() => navigate("/commandes")}
        className="btn btn-secondary mb-3"
      >
        <i className="fas fa-arrow-left me-2"></i> Retour
      </button>

      <div className="card shadow-sm">
        <div className="card-header">
          <h2>{isNewCommande ? "Nouvelle commande" : "Modifier commande"}</h2>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Client</label>
              <select
                className="form-select"
                value={commande.user_id}
                onChange={(e) =>
                  setCommande({ ...commande, user_id: e.target.value })
                }
                disabled={!isNewCommande}
              >
                <option value="">-- Sélectionner --</option>
                {clients.map((client) => (
                  <option key={client.id} value={String(client.id)}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <h5>Articles</h5>
            {lignes.map((ligne, index) => (
              <div className="d-flex gap-2 mb-2" key={index}>
                <select
                  className="form-select"
                  value={ligne.article_id}
                  onChange={(e) =>
                    updateLigne(index, "article_id", e.target.value)
                  }
                  disabled={ligne.isExisting} // 👈 On désactive l’article si c’est une ligne existante
                >
                  <option value="">Sélectionner un article</option>
                  {articles
                    .filter((article) => article.is_active)
                    .map((article) => (
                      <option key={article.id} value={article.id}>
                        {article.designation}
                      </option>
                    ))}
                </select>

                {ligne.isExisting ? (
                  // 🔒 Prix non modifiable, affiché seulement
                  <input
                    className="form-control"
                    value={parseFloat(ligne.prix_unitaire).toFixed(2) + " €"}
                    disabled
                  />
                ) : (
                  // 🔄 Select pour les tarifs si c'est une nouvelle ligne
                  <select
                    className="form-select"
                    disabled={!ligne.article_id}
                    value={ligne.prix_unitaire ?? ""}
                    onChange={(e) =>
                      updateLigne(
                        index,
                        "prix_unitaire",
                        parseFloat(e.target.value)
                      )
                    }
                  >
                    <option value="">Sélectionner un tarif</option>
                    {Array.isArray(articleTarifs) &&
                      articleTarifs
                        .filter(
                          (t) =>
                            String(t.id_article) === String(ligne.article_id)
                        )
                        .map((tarif) => (
                          <option key={tarif.id} value={tarif.pu}>
                            {new Date(tarif.date).toLocaleDateString()} -{" "}
                            {parseFloat(tarif.pu).toFixed(2)} €
                          </option>
                        ))}
                  </select>
                )}

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  style={{ maxWidth: "80px" }}
                  value={ligne.qt}
                  onChange={(e) => updateLigne(index, "qt", e.target.value)}
                  disabled={commande.finalisee}
                />
                {!commande.finalisee && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeLigne(index)}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            ))}

            {!commande.finalisee && (
              <button
                type="button"
                className="btn btn-secondary mb-3"
                onClick={addLigne}
              >
                + Ajouter un article
              </button>
            )}

            <div className="mb-3">
              <strong>Total : {getTotal()} €</strong>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="facturation"
                checked={commande.facturation}
                onChange={(e) =>
                  setCommande({ ...commande, facturation: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="facturation">
                Nécessite une facture
              </label>
            </div>

            <button type="submit" className="btn btn-success w-100">
              <i className="fas fa-save me-2"></i>
              {isNewCommande ? "Créer la commande" : "Modifier la commande"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommandeInfo;
