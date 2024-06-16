import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/material";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import Header from "../../admin/components/Header";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { ticketService } from "../../services/ticke_servicet";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import Slide from "@mui/material/Slide";
import { format } from "date-fns";
import { technicienService } from "../../services/technicien_service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Historique = () => {
  const theme = useTheme();

  const [dataRows, setDataRows] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // useEffect(() => {
  //   ticketService
  //     .getTicketArchivedClient()
  //     .then((response) => {
  //       const updatedDataRows = response.data.map((item) => ({
  //         ...item,
  //         id: item.interCode,
  //       }));
  //       setDataRows(updatedDataRows);
  //       console.log("ticket", response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ticketService.getTicketArchivedClient();
        const ticketData = response.data;
  
        // Fetch technicien data for each ticket
        const updatedDataRows = await Promise.all(
          ticketData.map(async (item) => {
            let technicienData = null;
            if (item.technicien.user){
              technicienData = item.technicien;
            }
            else if (item.technicien) {
              try {
                const techResponse = await technicienService.getTechnicien(item.technicien);
                technicienData = techResponse.data;
              } catch (error) {
                console.error("Error fetching technicien data:", error);
              }
            }
            return {
              ...item,
              id: item.interCode,
              technicienData: technicienData,
            };
          })
        );
        setDataRows(updatedDataRows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleViewDetails = (ticketId) => {
    console.log(`Affichage des détails du ticket avec l'ID : ${ticketId}`);
    ticketService
      .getTicket(ticketId)
      .then((response) => {
        setSelectedTicket(response.data);
        setOpenDetailsDialog(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };

  const columns = [
    {
      field: "interCode",
      headerName: "ID",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "interDesignation",
      headerName: "Designation",
      flex: 2,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "interventionNature.libelle",
    //   headerName: "Nature",
    //   align: "center",
    //   headerAlign: "center",
    //   valueGetter: (params) =>
    //     params.row.interventionNature
    //       ? params.row.interventionNature.libelle
    //       : "",
    // },
    {
      field: "technicien",
      headerName: "Technicien",
      flex: 1,
      headerAlign: "center",
      renderCell: ({ row }) => {
        const { technicienData } = row;
        if (technicienData && technicienData.user && technicienData.user.image) {
          return (
            <Box display="flex" alignItems="center">
              <Avatar
                src={`data:image/png;base64,${technicienData.user.image.image}`}
                alt={`${technicienData.user.prenom} ${technicienData.user.nom}`}
                sx={{ width: 24, height: 24, marginRight: 1 }}
              />
              <Typography>
                {technicienData.user.prenom} {technicienData.user.nom}
              </Typography>
            </Box>
          );
        } 
        else if (technicienData && technicienData.user){
          return (
            <Box display="flex" alignItems="center">
              <Avatar
                src={`data:image/png;base64,${technicienData.user.image}`}
                alt={`${technicienData.user.prenom} ${technicienData.user.nom}`}
                sx={{ width: 24, height: 24, marginRight: 1 }}
              />
              <Typography>
                {technicienData.user.prenom} {technicienData.user.nom}
              </Typography>
            </Box>
          );
        }
        else {
          return <Typography>Aucun technicien</Typography>;
        }
      },
    },
    {
      field: "equipement",
      headerName: "Equipement",
      align: "center",
      flex: 1,
      headerAlign: "center",
      valueGetter: (params) =>
        params.row.equipement ? params.row.equipement.eqptDesignation : "",
    },
    {
      field: "interPriorite",
      headerName: "Priorité",
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        // Correctement déstructurer l'objet row
        const { interPriorite } = row; // Accéder directement à la propriété interPriorite
        return (
          <Box
            sx={{
              p: "5px",
              width: "99px",
              borderRadius: "3px",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-evenly",
              backgroundColor:
                interPriorite === "Haute"
                  ? theme.palette.mode === "light"
                    ? "#fee2e2"
                    : "#ffc1cc"
                  : interPriorite === "Moyenne"
                  ? theme.palette.mode === "light"
                    ? "#f6ffc2"
                    : "#f1fc8c"
                  : "#e0fec9",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "bold",
                color:
                  interPriorite === "Haute"
                    ? theme.palette.mode === "light"
                      ? "#ff0000" // Rouge pour priorité haute
                      : "#ff0000"
                    : interPriorite === "Moyenne"
                    ? theme.palette.mode === "light"
                      ? "#f19d0f" // Jaune pour priorité moyenne
                      : "#c58d09"
                    : "#008000", // Vert pour les autres priorités
              }}
            >
              {interPriorite}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "dateCreation",
      headerName: "Date de création",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const options = { day: "2-digit", month: "short", year: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(
          date
        );
        return formattedDate;
      },
    },
    {
      field: "dateCloture",
      headerName: "Date de cloture",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>
          {row.intervention ? (
            <>
              {row.intervention.dateCloture
                ? new Date(row.intervention.dateCloture).toLocaleString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "-"}
            </>
          ) : (
            "-"
          )}
        </span>
      ),
    },
    {
      field: "interStatut",
      headerName: "Statut",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        // Correctement déstructurer l'objet row
        const { interStatut } = row; // Accéder directement à la propriété interPriorite
        return (
          <Box
            sx={{
              p: "5px",
              width: "99px",
              borderRadius: "3px",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-evenly",
              backgroundColor:
                interStatut === "En attente"
                  ? theme.palette.mode === "light"
                    ? "#f16609"
                    : "#f16609"
                  : interStatut === "A réaliser"
                  ? theme.palette.mode === "light"
                    ? "#e4b60e"
                    : "#f4ce1b"
                  : interStatut === "Annulé"
                  ? theme.palette.mode === "light"
                    ? "#cf0606"
                    : "#f10909"
                  : interStatut === "Réalisé"
                  ? theme.palette.mode === "light"
                    ? "#0aae02"
                    : "#0aae02"
                  : "#ff",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {interStatut}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "", // Nouvelle colonne pour les actions
      headerName: "Action", // Vous pouvez laisser vide si vous ne voulez pas de texte dans l'en-tête
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <>
          <RemoveRedEyeOutlined
            sx={{ color: "#438e96" }}
            onClick={() => handleViewDetails(row.interCode)}
            style={{ cursor: "pointer" }}
          />
        </>
      ),
    },
  ];

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}
      ></Box>
      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <Header
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "24px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
              }}
            >
              <ConfirmationNumberOutlined />
              Tickets
            </Box>
          }
          subTitle=""
        />
        <Box sx={{ height: 600, mx: "auto" }}>
          <DataGrid
            rows={dataRows}
            columns={columns}
            getRowId={(row) => row.interCode}
          />
        </Box>
      </Box>
      <Dialog
        open={openDetailsDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDetailsDialog}
        aria-labelledby="ticket-details-dialog"
      >
        <DialogTitle id="ticket-details-dialog">Détails du Ticket</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <TableContainer style={{ minWidth: "400px" }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>InterCode:</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.interCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>InterDesignation:</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.interDesignation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Description:</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Nature:</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.interventionNature.libelle}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Machine arrêtée:</strong>
                    </TableCell>
                    <TableCell>
                      {selectedTicket.machineArret === "Oui" ? "Oui" : "Non"}
                    </TableCell>
                  </TableRow>
                  {selectedTicket.machineArret === "Oui" && (
                    <>
                      <TableRow>
                        <TableCell>
                          <strong>Durée d'arrêt:</strong>
                        </TableCell>
                        <TableCell>{selectedTicket.dureeArret}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Date d'arrêt:</strong>
                        </TableCell>
                        <TableCell>
                          {format(
                            selectedTicket.dateArret,
                            "dd, MMMM, yyyy HH:mm"
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Historique;
