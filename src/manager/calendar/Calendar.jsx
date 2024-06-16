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
  TextField,
  Autocomplete,
} from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import "./calendar.css";
import { ticketService } from "../../services/ticke_servicet"; // Ensure you have the correct path for your service
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/equipement_service"; // Ensure you have the correct path for your service

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState("A réaliser");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventsFromBackend = async () => {
      try {
        const response = await ticketService.getAllTickets();
        if (!response.data) {
          throw new Error("Erreur lors de la récupération des événements");
        }
        const eventsWithEquipments = await Promise.all(
          response.data.map(async (event) => {
            let equipement = event.equipement;
            if (typeof equipement === "string") {
              const equipResponse = await adminService.getEquipement(equipement);
              equipement = equipResponse.data;
            }
            return {
              id: event.interCode,
              title: `${event.interCode} - ${equipement.eqptDesignation}`,
              start: getEventStartDate(event),
              end: getEventEndDate(event),
              demandeur:
                event.demandeur &&
                event.demandeur.client &&
                event.demandeur.client.nomSociete,
              technicien:
                event.technicien &&
                event.technicien.user &&
                `${event.technicien.user.nom} ${event.technicien.user.prenom}`,
              statut: event.interStatut,
              equipement: equipement
            };
          })
        );
        setCurrentEvents(eventsWithEquipments);
        setFilteredEvents(eventsWithEquipments.filter(event => event.statut === filter));
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchEventsFromBackend();
  }, []);

  useEffect(() => {
    setFilteredEvents(currentEvents.filter(event => event.statut === filter || filter === "all"));
  }, [filter, currentEvents]);

  const handleEventClick = async (clickInfo) => {
    const ticketId = clickInfo.event.id;
    try {
      const ticketData = await ticketService.getTicket(ticketId);
      navigate(`/manager/creer-intervention?ticketData=${JSON.stringify(ticketData.data)}`);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du ticket:", error);
    }
  };

  const getEventStartDate = (event) => {
    if (event.interStatut === "Réalisé") {
      return event.intervention.dateCloture;
    } else if (
      event.interStatut === "En attente" ||
      event.interStatut === "Annulé" ||
      event.interStatut === "Bloqué"
    ) {
      return event.dateCreation;
    } else if (event.interStatut === "A réaliser"){
      return event.datePrevue;
    }
  };

  const getEventEndDate = (event) => {
    if (event.interStatut === "Réalisé") {
      return event.intervention.dateCloture;
    } else if (
      event.interStatut === "En attente" ||
      event.interStatut === "Annulé" ||
      event.interStatut === "Bloqué"
    ) {
      return event.dateCreation;
    } else if (event.interStatut === "A réaliser"){
      return event.datePrevue;
    }
  };

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
      designation: selectInfo.interDesignation,
      demandeur: selectInfo.demandeur
        ? selectInfo.demandeur.client.nomSociete
        : null,
      technicien: selectInfo.technicien
        ? `${selectInfo.technicien.user.nom} ${selectInfo.technicien.user.prenom}`
        : null,
    });
    setIsEditing(false);
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

    if (eventInfo.event.extendedProps.statut === "Réalisé") {
      backgroundColor = "#3a7f3b";
    } else if (eventInfo.event.extendedProps.statut === "A réaliser") {
      backgroundColor = "#cecc4d";
    } else if (eventInfo.event.extendedProps.statut === "En attente") {
      backgroundColor = "#dc6b2e";
    } else if (eventInfo.event.extendedProps.statut === "Bloqué") {
      backgroundColor = "#d3a096";
    } else if (eventInfo.event.extendedProps.statut === "Annulé") {
      backgroundColor = "#cd3535";
    }

    let eventStyle = {
      backgroundColor: backgroundColor,
      color: "#faf6ee",
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

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filterOptions = [
    { label: "Tous", value: "all" },
    { label: "Réalisé", value: "Réalisé" },
    { label: "A réaliser", value: "A réaliser" },
    { label: "Bloqué", value: "Bloqué" },
    { label: "Annuler", value: "Annulé" },
    { label: "En attente", value: "En attente" },
  ];

  const renderSidebarEvent = (event) => {
    return (
      <li key={event.id} style={{ margin: 10, fontSize: 14 }}>
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

  const handleEventDrop = async (eventDropInfo) => {
   
    const { event } = eventDropInfo;
    const eventId = event.id;

    if (event.extendedProps.statut === "A réaliser") {
      const newDatePrevue = event.start.toISOString();
      try {
        await ticketService.updateEventDate(eventId, newDatePrevue);

        const updatedEvents = currentEvents.map((e) => {
          if (e.id === eventId) {
            return { ...e, start: newDatePrevue, end: newDatePrevue };
          }
          return e;
        });
        setCurrentEvents(updatedEvents);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'événement:", error);
      }
    } else {
      eventDropInfo.revert();
    }
  };

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
        autoSelect
        renderInput={(params) => (
          <TextField {...params} label="Filtrer" variant="outlined" />
        )}
        style={{ margin: "auto", width: "20%" }}
        freeSolo={false}
      />

      <Stack direction={"row"}>
        <Paper className="demo-app-sidebar">
          <h2 style={{ textAlign: "center", margin: 10, marginTop: 20 }}>
            Tous les événements ({filteredEvents.length})
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
            eventDrop={handleEventDrop}
            events={filteredEvents}
          />
        </div>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{"Détails d'événement"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="body1">
                  <b>Designation :</b>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedEvent ? selectedEvent.designation : ""}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <b>Nom de client :</b>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedEvent ? selectedEvent.extendedProps.demandeur : ""}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <b>Nom de technicien :</b>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedEvent ? selectedEvent.extendedProps.technicien : ""}
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
