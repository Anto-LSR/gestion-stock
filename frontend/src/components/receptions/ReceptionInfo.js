import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ReceptionInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNewReception = id === "new";

    const [articles, setArticles] = useState([]);
    const [reception, setReception] = useState(null);
    const [lignes, setLignes] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                if (window.api && typeof window.api.getAllArticles === "function") {
                    const fetchedArticles = await window.api.getAllArticles();
                    setArticles(fetchedArticles);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des articles", error);
                toast.error("Erreur lors du chargement des articles");
            }
        };

        fetchArticles();
    }, []);

    useEffect(() => {
        if (!isNewReception) {
            const fetchReception = async () => {
                try {
                    if (window.api && typeof window.api.getReceptionWithLignes === "function") {
                        const fetchedReception = await window.api.getReceptionWithLignes(id);
                        setReception(fetchedReception.reception);
                        setLignes(
                            fetchedReception.lignes.map(l => ({
                                article_id: l.article_id,
                                qt: l.qt,
                            }))
                        );
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération de la réception", error);
                    toast.error("Erreur lors du chargement de la réception");
                }
            };

            fetchReception();
        }
    }, [id, isNewReception]);

    // Ajoute une nouvelle ligne (article + qt)
    const addLigne = () => {
        setLignes([...lignes, { article_id: "", qt: 1 }]);
    };

    // Mets à jour une ligne (article, qt, etc)
    const updateLigne = (index, field, value) => {
        const updated = [...lignes];
        if (field === "qt") {
            updated[index][field] = Math.max(1, parseInt(value) || 1);
        } else {
            updated[index][field] = value;
        }
        setLignes(updated);
    };

    // Supprime une ligne
    const removeLigne = (index) => {
        setLignes(lignes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation simple
        const lignesValides = lignes.filter(l => l.article_id && l.qt > 0);

        if (lignesValides.length === 0) {
            toast.warning("Veuillez ajouter au moins un article avec quantité.");
            return;
        }

        try {
            if (isNewReception) {
                // Créer nouvelle réception avec lignes
                console.log(lignesValides);

                const newReception = await window.api.createReceptionWithLignes({
                    reception: {}, // rajouter d'autres champs si besoin
                    lignes: lignesValides,
                });

                console.log(newReception);

                toast.success("Réception créée !");
                navigate(`/receptions/info/${newReception}`);
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
            toast.error("Erreur lors de l'enregistrement : " + (error.message || error));
        }
    };

    // Affichage
    if (!isNewReception && !reception) {
        return <p>Chargement de la réception...</p>;
    }

    return (
        <div className="container mt-4">
            <button
                onClick={() => navigate("/receptions")}
                className="btn btn-outline-secondary mb-4"
                aria-label="Retour à la liste des réceptions"
            >
                <i className="fas fa-arrow-left me-2"></i> Retour
            </button>

            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h2 className="mb-0">
                        {isNewReception ? "Nouvelle réception" : `Réception #${reception.id}`}
                    </h2>
                </div>

                <div className="card-body">
                    {isNewReception ? (
                        <form onSubmit={handleSubmit}>
                            <h5 className="mb-3">Articles</h5>

                            {lignes.map((ligne, index) => (
                                <div
                                    key={index}
                                    className="d-flex gap-3 align-items-center mb-3"
                                >
                                    <select
                                        className="form-select flex-grow-1"
                                        value={ligne.article_id}
                                        onChange={(e) => updateLigne(index, "article_id", e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner un article</option>
                                        {articles
                                            .filter(article => article.is_active)
                                            .map(article => (
                                                <option key={article.id} value={article.id}>
                                                    {article.designation}
                                                </option>
                                            ))}
                                    </select>

                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control"
                                        style={{ maxWidth: "100px" }}
                                        value={ligne.qt}
                                        onChange={(e) => updateLigne(index, "qt", e.target.value)}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => removeLigne(index)}
                                        aria-label="Supprimer cet article"
                                        title="Supprimer cet article"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="btn btn-outline-primary mb-4"
                                onClick={addLigne}
                            >
                                <i className="fas fa-plus me-2"></i> Ajouter un article
                            </button>

                            <button type="submit" className="btn btn-primary w-100">
                                <i className="fas fa-save me-2"></i> Valider la réception
                            </button>
                        </form>
                    ) : (
                        <>
                            <h5 className="mb-3">Lignes de réception</h5>
                            <table className="table table-hover table-bordered align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Article</th>
                                        <th style={{ width: "120px" }}>Quantité</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lignes.map((ligne, idx) => {
                                        const article = articles.find(a => a.id == ligne.article_id);
                                        return (
                                            <tr key={idx}>
                                                <td>{article ? article.designation : "Inconnu"}</td>
                                                <td>{ligne.qt}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

};

export default ReceptionInfo;
