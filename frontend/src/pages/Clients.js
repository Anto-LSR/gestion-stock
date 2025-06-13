import { useState, useEffect } from "react";
import ClientList from "../components/clients/ClientList";

function Clients() {
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
    fetchClients();
  }, []);

  return (
    <div className="container mt-4">
      <ClientList clients={clients} fetchClients={fetchClients} />
    </div>
  );
}

export default Clients;
