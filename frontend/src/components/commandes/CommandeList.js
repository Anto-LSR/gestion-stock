import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const CommandeList = ({ commandes, fetchCommandes, clients, articles }) => {
  const navigate = useNavigate();
  const [filtreFinalisee, setFiltreFinalisee] = useState(() => {
    return localStorage.getItem("commandeListFiltreFinalisee") || "non-finalisees";
  });
  const [searchClient, setSearchClient] = useState("");
  const [sortOrderDate, setSortOrderDate] = useState("desc"); // null | "asc" | "desc"
  const [afficherAnnulees, setAfficherAnnulees] = useState(() => {
    const saved = localStorage.getItem("commandeListAfficherAnnulees");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const updateCommande = async (id, champs) => {
    try {
      const commande = commandes.find((c) => c.id === id);
      if (!commande) throw new Error("Commande non trouvée.");

      const { lignes, total, ...commandeSansLignes } = commande;
      const updatedCommande = {
        ...commandeSansLignes,
        ...champs,
      };

      await window.api.updateCommande(updatedCommande);
      toast.success("Commande mise à jour.");
      fetchCommandes();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      toast.error("Échec de la mise à jour.");
    }
  };

  const commandesFiltrees = Array.isArray(commandes)
    ? commandes.filter((commande) => {
      // Filtrer selon finalisée
      if (filtreFinalisee === "finalisees" && !commande.finalisee) return false;
      if (filtreFinalisee === "non-finalisees" && commande.finalisee) return false;

      // Filtrer selon nom client (insensible à la casse)
      if (searchClient.trim() !== "") {
        const client = clients.find((c) => c.id === commande.user_id);
        if (!client) return false;
        if (!client.name.toLowerCase().includes(searchClient.toLowerCase())) return false;
      }

      // Nouveau filtre : afficher ou non les commandes annulées
      if (!afficherAnnulees && commande.annulee) return false;

      return true;
    })
    : [];

  // Tri par date si demandé
  if (sortOrderDate) {
    commandesFiltrees.sort((a, b) => {
      const dateA = new Date(a.cree_le);
      const dateB = new Date(b.cree_le);
      if (sortOrderDate === "asc") return dateA - dateB;
      else return dateB - dateA;
    });
  }

  const nbCommandesAFinaliser = commandes.filter(c => c.payee && c.livree && !c.finalisee).length;

  // Gestion du clic sur l'entête Date pour changer le tri
  const toggleSortDate = () => {
    if (sortOrderDate === "asc") setSortOrderDate("desc");
    else setSortOrderDate("asc");
  };

  useEffect(() => {
    localStorage.setItem("commandeListFiltreFinalisee", filtreFinalisee);
  }, [filtreFinalisee]);

  useEffect(() => {
    localStorage.setItem("commandeListAfficherAnnulees", JSON.stringify(afficherAnnulees));
  }, [afficherAnnulees]);

  return (
    <>
      <div className="mt-3 container">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3>Liste des Commandes</h3>
          <button onClick={() => navigate(`/commandes/info/new`)} className="btn btn-primary">
            Ajouter une commande
          </button>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary ms-2 position-relative"
          >
            Imprimer commandes à finaliser &nbsp;
            {nbCommandesAFinaliser > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                {nbCommandesAFinaliser}
              </span>
            )}
          </button>
        </div>

        <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
          <label htmlFor="filtreFinalisee" className="form-label mb-0">
            Filtrer :
          </label>
          <select
            id="filtreFinalisee"
            className="form-select form-select-sm"
            style={{ maxWidth: "200px" }}
            value={filtreFinalisee}
            onChange={(e) => setFiltreFinalisee(e.target.value)}
          >
            <option value="toutes">Toutes les commandes</option>
            <option value="finalisees">Commandes finalisées</option>
            <option value="non-finalisees">Commandes non finalisées</option>
          </select>

          <label htmlFor="searchClient" className="form-label mb-0 ms-3">
            Rechercher client :
          </label>
          <input
            id="searchClient"
            type="text"
            className="form-control form-control-sm"
            style={{ maxWidth: "250px" }}
            placeholder="Nom du client"
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
          />
          <div className="form-check ms-3">
            <input
              type="checkbox"
              id="afficherAnnulees"
              className="form-check-input"
              checked={afficherAnnulees}
              onChange={(e) => setAfficherAnnulees(e.target.checked)}
            />
            <label htmlFor="afficherAnnulees" className="form-check-label">
              Afficher commandes annulées
            </label>
          </div>
        </div>

        {commandesFiltrees.length > 0 ? (
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>N°</th>
                <th>Client</th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={toggleSortDate}
                  title="Trier par date"
                >
                  Date&nbsp;
                  {sortOrderDate === "asc" && "↑"}
                  {sortOrderDate === "desc" && "↓"}
                </th>
                <th>Total</th>
                <th>Actions</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {commandesFiltrees.map((commande) => {
                const canFinalize = commande.livree && commande.payee;

                let rowClass = "";
                if (commande.annulee) {
                  rowClass = "table-danger";
                } else if (commande.finalisee) {
                  rowClass = "table-primary";
                } else if (canFinalize) {
                  rowClass = "table-success";
                }

                return (
                  <tr
                    key={commande.id}
                    onClick={() => navigate(`/commandes/info/${commande.id}`)}
                    className={`${rowClass} cursor-pointer`}
                  >
                    <td>{commande.id}</td>
                    <td>{clients.find((c) => c.id === commande.user_id)?.name || "Client inconnu"}</td>
                    <td>{new Date(commande.cree_le).toLocaleDateString()}</td>
                    <td>{commande.total?.toFixed(2)} €</td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="d-flex flex-wrap gap-2">

                        {!commande.annulee && !commande.finalisee &&(
                          <>
                            <button
                              className={`btn btn-sm ${commande.livree ? "btn-success" : "btn-outline-success"}`}
                              onClick={() => {
                                const nextValue = !commande.livree;
                                const message = nextValue
                                  ? "Souhaitez-vous marquer cette commande comme livrée ? Le stock des articles sera automatiquement mis à jour."
                                  : "Annuler la livraison de cette commande ? Le stock des articles sera mis à jour automatiquement.";
                                // if (window.confirm(message)) {
                                  updateCommande(commande.id, { livree: nextValue });
                                // }
                              }}
                            >
                              Livrée
                            </button>

                            <button
                              className={`btn btn-sm ${commande.payee ? "btn-info" : "btn-outline-info"}`}
                              onClick={() => {
                                const nextValue = !commande.payee;
                                const message = nextValue
                                  ? "Marquer cette commande comme payée ?"
                                  : "Annuler l'état payée ?";
                                // if (window.confirm(message)) {
                                  updateCommande(commande.id, { payee: nextValue });
                                // }
                              }}
                            >
                              Payée
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="d-flex flex-wrap gap-2">
                        {!commande.annulee ? (
                          <>
                            <button
                              className={`btn btn-sm ${commande.finalisee ? "btn-dark" : "btn-outline-dark"}`}
                              disabled={!canFinalize && !commande.finalisee}
                              onClick={() => {
                                const nextValue = !commande.finalisee;
                                const message = nextValue
                                  ? "Confirmer la finalisation de cette commande ? Cela indique que le chèque et le bon de livraison ont été envoyés au fournisseur."
                                  : "Annuler l'état finalisée ?";
                                // if (window.confirm(message)) {
                                  updateCommande(commande.id, { finalisee: nextValue });
                                // }
                              }}
                            >
                              Finalisée
                            </button>

                            {!commande.livree &&
                              !commande.payee &&
                              !commande.cheque_envoye &&
                              !commande.finalisee && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    // if (window.confirm("Annuler cette commande ?")) {
                                      updateCommande(commande.id, { annulee: true });
                                    // }
                                  }}
                                >
                                  Annuler
                                </button>
                              )}
                          </>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              updateCommande(commande.id, { annulee: false });
                            }}
                          >
                            Réactiver la commande
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Aucune commande trouvée.</p>
        )}

        <div className="d-none d-print-block mt-5">
          <h4>Commandes réglées</h4>
          {commandes
            .filter(c => c.livree && c.payee && !c.finalisee)
            .map((commande) => {
              const client = clients.find((c) => c.id === commande.user_id);
              return (
                <div key={commande.id} className="print-commande-block">
                  <div className="commande-header">
                    <div className="col id">
                      <strong>#{commande.id}</strong>
                    </div>
                    <div className="col client">
                      <strong>{client?.name || "Inconnu"}</strong>
                    </div>
                    <div className="col date">
                      <strong>{new Date(commande.cree_le).toLocaleDateString()}</strong>
                    </div>
                    <div className="col total">
                      <strong>{commande.total?.toFixed(2)} €</strong>
                    </div>
                  </div>
                  {commande.facturation === 1 && (
                    <div className="col facture text-primary">
                      <strong>Demande de facture 📄</strong>
                    </div>
                  )}

                  <div className="commande-lignes">
                    {commande.lignes?.map((ligne, index) => {
                      const article = articles?.find(a => a.id === ligne.article_id);
                      const designation = article?.designation || `Article #${ligne.article_id}`;
                      const prixUnitaire = ligne.prix_unitaire ?? 0;
                      const sousTotal = prixUnitaire * ligne.qt;

                      const isLast = index === commande.lignes.length - 1;

                      return (
                        <div
                          key={index}
                          className="ligne-article"
                          style={{
                            borderBottom: isLast ? "none" : "1px dotted #999",
                            paddingBottom: "4px",
                            marginBottom: "4px",
                          }}
                        >
                          <span className="article">
                            <strong>{designation}</strong>
                          </span>
                          <span className="qt">
                            <strong>Qté:</strong> {ligne.qt}
                          </span>
                          <span className="soustotal">
                            <strong>{sousTotal.toFixed(2)} €</strong>
                          </span>
                          <span className="prixunitaire">
                            Prix unitaire : {prixUnitaire} €
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );

            })}
        </div>
      </div>

      <style>{`
      @media print {
        body * {
          visibility: hidden;
        }
        .d-print-block, .d-print-block * {
          visibility: visible;
        }
        .d-print-block {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          background: white;
        }
        .print-commande-block {
          page-break-inside: avoid;
          border-bottom: 1px solid #ccc;
          padding-bottom: 12px;
          margin-bottom: 24px;
          font-size: 10px;
        }
        .commande-header {
          display: grid;
          grid-template-columns: 40px 1fr 70px 60px 20px;
          column-gap: 8px;
          align-items: center;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .commande-lignes {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-left: 6px;
        }
        .ligne-article {
          display: grid;
          grid-template-columns: 1fr 60px 60px;
          column-gap: 8px;
          align-items: center;
          font-size: 9px;
        }
        .ligne-article span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .print-commande-block h5 {
          margin-bottom: 6px;
        }
        .print-commande-block p, .print-commande-block ul {
          margin: 4px 0;
        }
        .print-commande-block ul {
          padding-left: 20px;
        }
      }
    `}</style>
    </>
  );


};

export default CommandeList;
