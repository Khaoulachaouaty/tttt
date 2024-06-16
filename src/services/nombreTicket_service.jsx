import Axios from "./caller_service";

let getTotalTicket = () => {
    return Axios.get('/tickets/api/total')
}

let getEnAttenteTicket = () => {
    return Axios.get('/tickets/api/pending')
}

let getTicketAReliser = () => {
    return Axios.get('/tickets/api/todo')
}

let getTicketRealise = () => {
    return Axios.get('/tickets/api/done')
}

let getTicketBloque = () => {
    return Axios.get('/tickets/api/blocked')
}

let getTicketAnnuler = () => {
    return Axios.get('/tickets/api/cancelled')
}

let getTotalTicketInter = () => {
    return Axios.get('/tickets/api/totalNonArchived')
}

let getEnAttenteTicketInter = () => {
    return Axios.get('/tickets/api/totalNonArchivPending')
}

let getTicketAReliserInter = () => {
    return Axios.get('/tickets/api/totalNonArchivARealize')
}

let getTicketRealiseInter = () => {
    return Axios.get('/tickets/api/totalNonArchivRealized')
}

//Intervention Technicien
let getTotalTicketTechInter = () => {
    return Axios.get('/tickets/api/TotNonArchTech')
}

let getTicketAReliserTechInter = () => {
    return Axios.get('/tickets/api/TotNonArchTechARealized')
}

let getTicketRealiseTechInter = () => {
    return Axios.get('/tickets/api/TotNonArchTechRealizedddd')
}

//Dashboard
let getTotalTicketTech = () => {
    return Axios.get('/tickets/api/totalTicketsTechnicien')
}

let getTicketAReliserTech = () => {
    return Axios.get('/tickets/api/todoTicketsTechnicien')
}

let getTicketRealiseTech = () => {
    return Axios.get('/tickets/api/doneTicketsTechnicien')
}
export const NombreTickets = {
    getTotalTicket, getEnAttenteTicket, getTicketAReliser, getTicketRealise, getTicketAnnuler, getTicketBloque,
    getTicketRealiseInter, getTicketAReliserInter, getTotalTicketInter, getEnAttenteTicketInter,
    getTotalTicketTechInter, getTicketAReliserTechInter, getTicketRealiseTechInter, getTotalTicketTech, 
    getTicketAReliserTech, getTicketRealiseTech
}