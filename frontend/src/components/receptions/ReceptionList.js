import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReceptionList = ({ receptions, articles }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    // Fonction utilitaire pour récupérer la désignation d'un article depuis son id
    const getArticleDesignation = (article_id) => {
        const article = articles?.find((a) => a.id === article_id);
        return article ? article.designation : "—";
    };

    // Filtrage dynamique des réceptions en fonction des lignes (articles)
    const filteredReceptions = Array.isArray(receptions)
        ? receptions.filter((reception) => {
            if (!reception.lignes || !Array.isArray(reception.lignes)) return false;

            if (!searchQuery) return true; // si pas de recherche, tout afficher

            // Cherche si au moins une ligne correspond à la recherche (sur designation)
            return reception.lignes.some((ligne) => {
                const designation = getArticleDesignation(ligne.article_id);
                return designation.toLowerCase().includes(searchQuery.toLowerCase());
            });
        })
        : [];

    return (
        <div className="mt-3 container">
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="mb-3">Liste des Réceptions</h3>
                <button
                    onClick={() => navigate(`/receptions/info/new`)}
                    className="btn btn-primary"
                >
                    Nouvelle réception
                </button>
            </div>

            {/* Champ de recherche */}
            <div className="search-container mb-2">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Rechercher un article..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Affichage des réceptions */}
            {filteredReceptions.length === 0 ? (
                <p>Aucune réception trouvée.</p>
            ) : (
                filteredReceptions.map((rec) => (
                    <div key={rec.reception.id} className="mb-4">
                        <h5>Date de réception : {new Date(Number(rec.reception.dateReception)).toLocaleDateString()}</h5>

                        {rec.lignes && rec.lignes.length > 0 ? (
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{ width: "60%" }}>Article</th>
                                        <th style={{ width: "40%" }}>Quantité</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rec.lignes.map((ligne) => (
                                        <tr key={ligne.id}>
                                            <td>{getArticleDesignation(ligne.article_id)}</td>
                                            <td>{ligne.qt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Aucune ligne pour cette réception.</p>
                        )}
                    </div>
                ))

            )}
        </div>
    );
};

export default ReceptionList;
