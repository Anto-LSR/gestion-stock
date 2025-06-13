import { useState } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

const ClientList = ({ clients, fetchClients }) => {
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Filtrage dynamique des clients
  const filteredClients = Array.isArray(clients)
    ? clients.filter((client) => {
      const matchesSearch = searchQuery
        ? client.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesStatus = showArchived ? !client.is_active : client.is_active;
      return matchesSearch && matchesStatus;
    })
    : [];

  const deactivateClient = async (id) => {
    try {
      await window.api.deactivateClient(id);
      toast.success("Client archivé.");
      fetchClients(); // Rafraîchit la liste
    } catch (error) {
      console.error("Erreur lors de l'archivage du client :", error);
    }
  };

  const activateClient = async (id) => {
    try {
      await window.api.activateClient(id);
      toast.success("Client réactivé.");
      fetchClients(); // Rafraîchit la liste
    } catch (error) {
      console.error("Erreur lors de la réactivation du client :", error);
    }
  };

  return (
    <div className="mt-3 container">
      <div className="d-flex align-items-center justify-content-between">
        <h3 className="mb-3">Liste des Clients</h3>
        <button onClick={() => navigate(`/clients/info/new`)} className="btn btn-primary">
          Ajouter un Client
        </button>
      </div>

      {/* Filtres */}
      <div className="search-container mb-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexCheckDefault"
            checked={showArchived}
            onChange={() => setShowArchived((prev) => !prev)}
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Afficher les clients archivés
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

      {/* Table des clients */}
      {filteredClients.length === 0 ? (
        <p>Aucun client trouvé.</p>
      ) : (
        <table className="table table-striped table-responsive table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col" style={{ width: "40%" }}>Nom</th>
              <th scope="col" style={{ width: "15%" }}>Tél.</th>
              <th scope="col" style={{ width: "15%" }}>Mail.</th>
              <th scope="col" style={{ width: "30%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                onClick={() => navigate(`/clients/info/${client.id}`)} // Navigation au clic sur la ligne
                style={{ cursor: 'pointer' }} // Indiquer que la ligne est cliquable
              >
                <td>{client.name}</td>
                <td>{client.phone}</td>
                <td>{client.email}</td>
                <td className="d-flex justify-content-between align-items-center">
                  {client.is_active ? (
                    <div>
                      <button
                        data-tooltip-id="my-tooltip-deactivate"
                        data-tooltip-content="Désactiver le client"
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Empêche la propagation de l'événement pour ne pas naviguer
                          deactivateClient(client.id);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                        <Tooltip id="my-tooltip-deactivate" />
                      </button>

                      <button
                        data-tooltip-id="my-tooltip-edit"
                        data-tooltip-content="Modifier le client"
                        className="btn btn-info btn-sm ms-2 text-white"
                        onClick={(e) => {
                          e.stopPropagation(); // Empêche la propagation de l'événement pour ne pas naviguer
                          navigate(`/clients/info/${client.id}`);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fas fa-edit"></i>
                        <Tooltip id="my-tooltip-edit" />
                      </button>
                    </div>
                  ) : (
                    <button
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Réactiver le client"
                      className="btn btn-warning btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Empêche la propagation de l'événement pour ne pas naviguer
                        activateClient(client.id);
                      }}
                    >
                      <i className="fas fa-redo"></i>
                      <Tooltip id="my-tooltip" />
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

export default ClientList;
