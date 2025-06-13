import { useState } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

const ArticleList = ({ articles, fetchArticles }) => {
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Filtrage dynamique des articles
  const filteredArticles = Array.isArray(articles)
    ? articles.filter((article) => {
        const matchesSearch = searchQuery
          ? article.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        const matchesStatus = showArchived ? !article.is_active : article.is_active;
        return matchesSearch && matchesStatus;
      })
    : []; 

  const deactivateArticle = async (id) => {
    try {
      await window.api.unpublishArticle(id);
      toast.success("Article archivé.");
      fetchArticles(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de l'archivage de l'article :", error);
    }
  };

  const activateArticle = async (id) => {
    try {
      await window.api.publishArticle(id);
      toast.success("Article réactivé.");
      fetchArticles(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de la réactivation de l'article :", error);
    }
  };

  return (
    <div className="mt-3 container">
      <div className="d-flex align-items-center justify-content-between">
        <h3 className="mb-3">Liste des Articles</h3>
        <button onClick={() => navigate(`/articles/info/new`)} className="btn btn-primary">
          Ajouter un Article
        </button>
      </div>

      {/* Filtres */}
      <div className="search-container mb-2">
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
          className="form-control search-input"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table des articles */}
      {filteredArticles.length === 0 ? (
        <p>Aucun article trouvé.</p>
      ) : (
        <table className="table table-striped table-responsive table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col" style={{ width: "40%" }}>Nom</th>
              <th scope="col" style={{ width: "40%" }}>Description</th>
              <th scope="col" style={{ width: "20%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr
                key={article.id}
                onClick={() => navigate(`/articles/info/${article.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{article.designation}</td>
                <td>{article.description}</td>
                <td>
                  {article.is_active ? (
                    <div>
                      <button
                        data-tooltip-id="tooltip-deactivate"
                        data-tooltip-content="Archiver l'article"
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deactivateArticle(article.id);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                        <Tooltip id="tooltip-deactivate" />
                      </button>

                      <button
                        data-tooltip-id="tooltip-edit"
                        data-tooltip-content="Modifier l'article"
                        className="btn btn-info btn-sm ms-2 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/articles/info/${article.id}`);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                        <Tooltip id="tooltip-edit" />
                      </button>
                    </div>
                  ) : (
                    <button
                      data-tooltip-id="tooltip-reactivate"
                      data-tooltip-content="Réactiver l'article"
                      className="btn btn-warning btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        activateArticle(article.id);
                      }}
                    >
                      <i className="fas fa-redo"></i>
                      <Tooltip id="tooltip-reactivate" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ArticleList;
