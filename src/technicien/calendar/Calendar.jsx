import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import "./calendar.css";
import { ticketService } from "../../services/ticke_servicet";
import { adminService } from "../../services/equipement_service"; // Assurez-vous d'importer votre service d'admin

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchEventsFromBackend = async () => {
      try {
        const response = await ticketService.getTicketTech();
        if (!response.data) {
          throw new Error("Erreur lors de la récupération des événements");
        }
        console.log(response.data);
        const eventsWithEquipments = await Promise.all(
          response.data.map(async (event) => {
            let equipement = event.equipement;
            if (typeof equipement === "string") {
              // Si l'équipement est un ID, récupérez l'objet complet
              const equipResponse = await adminService.getEquipement(equipement);
              equipement = equipResponse.data;
            }
            return {
              id: event.interCode,
              title: event.interDesignation,
              start: event.interStatut === "Réalisé" ? event.intervention.dtRealisation : event.datePrevue,
              end: event.interStatut === "Réalisé" ? event.intervention.dtRealisation : event.datePrevue,
              demandeur: event.demandeur && event.demandeur.client && event.demandeur.client.nomSociete,
              statut: event.interStatut,
              equipement: equipement,
            };
          })
        );
        setCurrentEvents(eventsWithEquipments);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchEventsFromBackend();
  }, []);

  const handleDateSelect = (selectInfo) => {
    if (!selectInfo.hasEvent) {
      return;
    }

    setOpenDialog(true);
    setSelectedEvent({
      id: createEventId(),
      title: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      demandeur: selectInfo.demandeur ? selectInfo.demandeur.client.nomSociete : null,
    });
    setIsEditing(false);
  };

  const handleEventClick = (clickInfo) => {
    setOpenDialog(true);
    setSelectedEvent(clickInfo.event);
    setIsEditing(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const createEventId = () => {
    return String(Date.now());
  };

  function renderEventContent(eventInfo) {
    let backgroundColor = "#b3cbe4";
    console.log(eventInfo.event.extendedProps.statut);

    if (eventInfo.event.extendedProps.statut === "Réalisé") {
      backgroundColor = "lightgreen";
    } else if (eventInfo.event.extendedProps.statut === "A réaliser") {
      backgroundColor = "yellow";
    }

    let eventStyle = {
      backgroundColor: backgroundColor,
      color: "#000000",
      borderRadius: "10px",
      padding: "5px 10px",
      width: "100%",
      borderColor: "#000000",
    };

    return (
      <>
        <div style={eventStyle}>{eventInfo.event.title}</div>
      </>
    );
  }

  const renderSidebarEvent = (event) => {
    return (
      <li key={event.id} style={{ margin: 10 }}>
        <b>{event.title}</b>
        <i>
          {formatDate(event.start, {
            year: "numeric",
            month: "short",
            day: "numeric",
            locale: "fr-FR",
          })}
        </i>
      </li>
    );
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  let filteredEvents = currentEvents;
  if (filter === "realise") {
    filteredEvents = currentEvents.filter((event) => event.statut === "Réalisé");
  } else if (filter === "aRealiser") {
    filteredEvents = currentEvents.filter((event) => event.statut === "A réaliser");
  }

  const filterOptions = [
    { label: "Tous", value: "all" },
    { label: "Réalisé", value: "realise" },
    { label: "A réaliser", value: "aRealiser" },
  ];

  return (
    <>
      <Autocomplete
        options={filterOptions}
        size="small"
        getOptionLabel={(option) => option.label}
        value={filterOptions.find((option) => option.value === filter)}
        onChange={(event, newValue) => {
          if (newValue) {
            handleFilterChange(newValue.value);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Filtrer" variant="outlined" />}
        style={{ margin: "auto", width: "20%" }}
      />

      <Stack direction={"row"}>
        <Paper className="demo-app-sidebar">
          <h2 style={{ textAlign: "center", margin: 10, marginTop: 20 }}>
            Tous les événements ({currentEvents.length})
          </h2>
          <ul>{filteredEvents.map(renderSidebarEvent)}</ul>
        </Paper>
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventClassNames="custom-event"
            eventContent={renderEventContent}
            events={filteredEvents}
          />
        </div>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{"Détails d'événement"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body1">
                  <b>Designation :</b>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  {selectedEvent ? selectedEvent.title : ""}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <b>Nom de client :</b>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  {selectedEvent ? selectedEvent.extendedProps.demandeur : ""}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Fermer</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </>
  );
};

export default Calendar;
