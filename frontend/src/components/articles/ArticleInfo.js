import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import articleDAO from "../../dao/article-dao";
import { toast } from "react-toastify";

const ArticleInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewArticle = id === "new";

  const [articleInfos, setArticleInfos] = useState({});
  const [tarifs, setTarifs] = useState([]);
  const [nouveauPrix, setNouveauPrix] = useState("");
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);

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
  useEffect(() => {
    if (!isNewArticle) {
      fetchArticleInfos();
      fetchClients();
    } else {
      setArticleInfos(
        articleDAO.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
      );
    }
  }, [id]);

  const fetchCommandes = async (article) => {
    try {
      const fetchedCommandes =
        await window.api.getCommandesWithLignesByArticleId(article.id);

      const nonLivrees = fetchedCommandes.filter(
        (commandeObj) => commandeObj.commande.livree === 0
      );

      setCommandes(nonLivrees);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des données des commandes :",
        err
      );
      toast.error("Erreur lors du chargement de l'article.");
    }
  };

  const fetchArticleInfos = async () => {
    try {
      const fetchedArticle = await window.api.getArticle(id);
      setArticleInfos(fetchedArticle);

      const fetchedTarifs = await window.api.getTarifsByArticle(id);
      setTarifs(fetchedTarifs);

      fetchCommandes(fetchedArticle);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de l'article :",
        error
      );
      toast.error("Erreur lors du chargement de l'article.");
    }
  };

  const handleAjoutTarif = async () => {
    const prix = parseFloat(nouveauPrix);
    if (isNaN(prix) || prix <= 0) {
      toast.warn("Veuillez entrer un prix valide.");
      return;
    }

    try {
      const now = new Date();
      await window.api.addTarif({
        id_article: id,
        pu: prix,
        date: now,
      });

      // Recharge les tarifs depuis la base, pour éviter des données partielles
      const updatedTarifs = await window.api.getTarifsByArticle(id);
      setTarifs(updatedTarifs);

      setNouveauPrix("");
      toast.success("Tarif ajouté !");
    } catch (err) {
      console.error("Erreur lors de l'ajout du tarif :", err);
      toast.error("Impossible d'ajouter le tarif.");
    }
  };

  const handleSupprimerTarif = async (idTarif) => {
    if (tarifs.length <= 1) {
      toast.warn("Impossible de supprimer le dernier tarif.");
      return;
    }

    try {
      await window.api.deleteTarif(idTarif);
      const updatedTarifs = await window.api.getTarifsByArticle(id);
      setTarifs(updatedTarifs);
      toast.success("Tarif supprimé.");
    } catch (err) {
      console.error("Erreur lors de la suppression du tarif :", err);
      toast.error("Impossible de supprimer ce tarif.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isNewArticle) {
        await window.api.addArticle(articleInfos);
        toast.success("Article ajouté.");
      } else {
        await window.api.updateArticle(articleInfos);
        toast.success("Article mis à jour.");
      }
      navigate("/articles");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'article :", error);
      toast.error("Erreur lors de la sauvegarde.");
    }
  };

  const commandesParClient = commandes.reduce((acc, commandeObj) => {
    const { commande, lignes } = commandeObj;

    const client = clients.find((c) => c.id === commande.user_id);
    if (!client) return acc;

    const totalQt = lignes.reduce((sum, ligne) => sum + ligne.qt, 0);
    if (totalQt === 0) return acc;

    if (!acc[client.name]) {
      acc[client.name] = 0;
    }

    acc[client.name] += totalQt;
    return acc;
  }, {});

  const totalStocksReserves = commandes.reduce((total, commandeObj) => {
    const totalQt = commandeObj.lignes.reduce(
      (sum, ligne) => sum + ligne.qt,
      0
    );
    return total + totalQt;
  }, 0);

  return (
    <div className="container mt-4">
      <button
        onClick={() => navigate("/articles")}
        className="btn btn-secondary btn-sm text-white mb-3"
      >
        <i className="fas fa-long-arrow-alt-left me-2"></i>
        Retour
      </button>

      <div className="card shadow-sm">
        <div className="card-header bg-tertiary">
          <h2 className="mb-0">
            {isNewArticle
              ? "Ajouter un article"
              : `Modifier ${articleInfos.designation}`}
          </h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="p-3 border rounded">
            {articleDAO.map(
              ({ name, label, type, required, disabled, info }) => {
                const isPrixField = name === "prix";

                return (
                  <div className="mb-3" key={name}>
                    <label className="form-label fw-bold">
                      {label}{" "}
                      {required && <span className="text-danger">*</span>}
                    </label>

                    {info && !isNewArticle && (
                      <p className="alert alert-warning">{info}</p>
                    )}

                    {/* Si c’est le champ prix et qu’on modifie, on affiche les tarifs */}
                    {isPrixField && !isNewArticle ? (
                      <>
                        <ul className="list-group mb-3">
                          Tarifs :
                          {tarifs.length > 0 ? (
                            tarifs.map((tarif) => (
                              <li
                                key={tarif.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                <div>
                                  <span className="me-3">
                                    {new Date(tarif.date).toLocaleDateString()}
                                  </span>
                                  <span>
                                    {parseFloat(tarif.pu).toFixed(2)} €
                                  </span>
                                </div>

                                {tarifs.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                      handleSupprimerTarif(tarif.id)
                                    }
                                    title="Supprimer ce tarif"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                )}
                              </li>
                            ))
                          ) : (
                            <li className="list-group-item text-muted">
                              Aucun tarif disponible
                            </li>
                          )}
                        </ul>

                        <div className="d-flex gap-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Nouveau tarif (€)"
                            value={nouveauPrix}
                            onChange={(e) => setNouveauPrix(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleAjoutTarif}
                          >
                            OK
                          </button>
                        </div>
                      </>
                    ) : (
                      <input
                        type={type}
                        className="form-control"
                        placeholder={label}
                        value={articleInfos[name] || ""}
                        onChange={(e) =>
                          setArticleInfos({
                            ...articleInfos,
                            [name]: e.target.value,
                          })
                        }
                        required={required}
                        disabled={disabled}
                      />
                    )}
                  </div>
                );
              }
            )}

            <button type="submit" className="btn btn-success w-100">
              <i className="fas fa-save me-2"></i>
              {isNewArticle ? "Ajouter" : "Modifier"}
            </button>
            {totalStocksReserves > 0 && (
              <div className="alert alert-info mb-3 mt-4">
                <strong>Total stocks réservés :</strong> {totalStocksReserves}
              </div>
            )}

            {Object.keys(commandesParClient).length > 0 && (
              <div className="mt-4">
                <h5 className="fw-bold">Commandes en attente</h5>
                <ul className="list-group">
                  {Object.entries(commandesParClient).map(
                    ([nomClient, quantite]) => (
                      <li
                        key={nomClient}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{nomClient}</span>
                        <span className="badge bg-warning text-dark">
                          {quantite} en attente
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleInfo;
