import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clientDAO from "../../dao/client-dao"
import { toast } from "react-toastify";

const ClientInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewClient = id === "new";

  const [clientInfos, setClientInfos] = useState({});

  useEffect(() => {
    if (!isNewClient) {
      fetchClientInfos();
    } else {
      setClientInfos(clientDAO.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));
    }
  }, [id]);

  const fetchClientInfos = async () => {
    try {
      if (window.api && typeof window.api.getClient === "function") {
        const fetchedClient = await window.api.getClient(id);
        setClientInfos(fetchedClient);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du client", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientData = {
      is_active: true,
      ...clientInfos // Ajoute toutes les infos du client à l'objet
    };
    
    try {
      if (window.api && typeof window.api.addClient === 'function') {
        if (isNewClient) {
          await window.api.addClient(clientData);
          toast.success('Client ajouté.')
        } else {
          await window.api.updateClient(clientData);
          toast.success('Client mis à jour.')
        }
        navigate('/clients'); // Redirige vers la page des clients

      } else {
        console.error("window.api.addClient is not available");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du client", error);
    }
  };

  return (
    <div className="container mt-4">
      <button
        onClick={() => navigate("/clients")}
        className="btn btn-secondary btn-sm text-white mb-3"
      >
        <i className="fas fa-long-arrow-alt-left me-2"></i>
        Retour
      </button>

      <div className="card shadow-sm">
        <div className="card-header bg-tertiary">
          <h2 className="mb-0">{isNewClient ? "Ajouter un client" : `Informations de ${clientInfos.name}`}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="p-3 border rounded">
            {clientDAO.map(({ name, label, type, required }) => (
              <div className="mb-3" key={name}>
                <label className="form-label fw-bold">{label} <span>{required ? <span className="text-danger">*</span> : ''}</span></label>
                <input
                  type={type}
                  className="form-control"
                  placeholder={label}
                  value={clientInfos[name] || ""}
                  onChange={(e) => setClientInfos({ ...clientInfos, [name]: e.target.value })}
                  required={required}
                />
              </div>
            ))}

            <button type="submit" className="btn btn-success w-100">
              <i className="fas fa-save me-2"></i>
              {isNewClient ? "Ajouter" : "Modifier"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientInfo;
