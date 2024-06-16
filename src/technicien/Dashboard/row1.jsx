import { Stack, useTheme } from "@mui/material";
import Card from "./card";
import { useEffect, useState } from "react";
import { NombreTickets } from "../../services/nombreTicket_service";
import { dashboardTechnicienService } from "../../services/dashboardTechnicien_service";

const Row1 = () => {
  const theme = useTheme();

  const [total, setTotal] = useState(0);
  const [enAttente, setEnAttente] = useState(0);
  const [aRealiser, setARealiser] = useState(0);
  const [annule, setAnnule] = useState(0);
  const [bloque, setBloque] = useState(0);
  const [realise, setRealise] = useState(0);

  const loadTicketToltal = async () => {
    try {
      const response = await NombreTickets.getTotalTicketTech();
      setTotal(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadEnAttenteTicket = async () => {
    try {
      const response = await NombreTickets.getTicketAReliserTech();
      setEnAttente(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadTicketRealise = async () => {
    try {
      const response = await NombreTickets.getTicketRealiseTech();
      setRealise(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadTicketARealise = async () => {
    try {
      const response = await NombreTickets.getTicketAReliser();
      setARealiser(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };
  const loadTicketBloque = async () => {
    try {
      const response = await NombreTickets.getTicketBloque();
      setBloque(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadTicketAnnule = async () => {
    try {
      const response = await NombreTickets.getTicketAnnuler();
      setAnnule(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  useEffect(() => {
    loadTicketToltal();
    loadEnAttenteTicket();
    loadTicketARealise();
    loadTicketAnnule();
    loadTicketBloque();
    loadTicketRealise();
  }, []);

  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      gap={1}
      justifyContent={{ xs: "center", sm: "space-between" }}
    >
      <Card
        title={"Total interventions"}
        nombre={total}
        increase={"100%"}
        data={[
          {
            id: "Total",
            label: "Total",
            value: 100,
            color: "hsl(22, 90%, 90%)",
          },
        ]}
        scheme={"category10"}
      />
      <Card
        title={"Interventions à réaliser"}
        nombre={aRealiser}
        increase={((aRealiser / total) * 100).toFixed(1) + "%"}
        data={[
          {
            id: "A réaliser",
            label: "A réaliser",
            value: ((aRealiser / total) * 100).toFixed(1), // Utilisez le pourcentage par rapport au total
            color: "hsl(111, 90%, 90%)",
          },
          {
            id: "Restant",
            label: "Restant",
            value: (100 - (aRealiser / total) * 100).toFixed(1), // Calculer le pourcentage restant
            color: "hsl(22, 90%, 90%)",
          },
        ]}
        scheme={"accent"}
      />
      <Card
        title={"Interventions réalisées"}
        nombre={realise}
        increase={((realise / total) * 100).toFixed(1) + "%"}
        data={[
          {
            id: "Réalisées",
            label: "Interventions réalisées",
            value: ((realise / total) * 100).toFixed(1), // Utilisez le pourcentage par rapport au total
            color: "hsl(22, 90%, 90%)",
          },
          {
            id: "Restant",
            label: "Restant",
            value: (100 - (realise / total) * 100).toFixed(1), // Calculer le pourcentage restant
            color: "hsl(22, 90%, 90%)",
          },
        ]}
        scheme={"nivo"}
      />
    </Stack>
  );
};

export default Row1;
