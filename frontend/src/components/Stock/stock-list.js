import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StockList = ({ articles }) => {
    const [showArchived, setShowArchived] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    // Filtrage dynamique des articles
    const filteredArticles = Array.isArray(articles)
        ? articles.filter((article) => {
            const matchesSearch = searchQuery
                ? article.designation.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            const matchesStatus = showArchived ? !article.is_active : article.is_active;
            return matchesSearch && matchesStatus;
        })
        : [];

    return (
        <div className="mt-3 container">
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="mb-3">Stock des Articles</h3>
            </div>

            {/* Filtres */}
            <div className="search-container mb-3">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexCheckArchived"
                        checked={showArchived}
                        onChange={() => setShowArchived((prev) => !prev)}
                    />
                    <label className="form-check-label" htmlFor="flexCheckArchived">
                        Afficher les articles archivés
                    </label>
                </div>
                <input
                    type="text"
                    className="form-control search-input mt-2"
                    placeholder="Rechercher par nom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Warning Bootstrap avec navigation */}
            <div className="alert alert-warning d-flex align-items-center" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <div>
                    Pour faire l'inventaire d'un article, veuillez vous rendre sur la page&nbsp;
                    <span
                        onClick={() => navigate("/articles")}
                        style={{ cursor: "pointer", color: "#0d6efd", textDecoration: "underline" }}
                    >
                        Liste des articles
                    </span>
                    &nbsp;et éditer l'article concerné.
                </div>
            </div>

            {/* Tableau du stock */}
            {filteredArticles.length === 0 ? (
                <p>Aucun article trouvé.</p>
            ) : (
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th style={{ width: "50%" }}>Nom</th>
                            <th style={{ width: "25%" }}>Stock réel</th>
                            <th style={{ width: "25%" }}>Stock réserve</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.map((article) => (
                            <tr key={article.id}>
                                <td>{article.designation}</td>
                                <td>{article.stock_reel ?? 0}</td>
                                <td>{article.stock_reserve !== "" ? article.stock_reserve : 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StockList;
