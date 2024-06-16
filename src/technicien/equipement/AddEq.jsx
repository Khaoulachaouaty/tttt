import "./Equipement.css";
import { useEffect } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  useTheme,
  Container,
  IconButton, // Importer le composant Container de Material-UI
} from "@mui/material";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import esLocale from "date-fns/locale/es";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Header from "../../admin/components/Header";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/equipement_service";
import DeleteIcon from "@mui/icons-material/Delete";
import { clientService } from "../../services/client_service";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AddEq = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const color = theme.palette.mode === "light" ? "#502bfc" : "#8a81ff"; // Modifier les couleurs en fonction du mode

  const refreshh = () => {
    setEqCode("");
    setEqDesignation("");
    setEqType("");
    setEqFamille("");
    setEqSociete("");
    setEqIdentifiant("");
    setEqDateAchat(null);
    setEqGarantie("O");
    setEqCritique("N");
    setEqDateCreation(null);
    setEqDateMJ(null);
    setEqLocalisation("");
    setEqEnService("O");
    setEqLoginCre("");
    setEqLoginMJ("");
    setEqMachine("N");
    setEqPrix(0.0);
    setEqUserCB1("");
    setEqTypeGarantie("AUC");
    //loadEqpm();
    setEqDateFab(null);
    setEqDateLivraison(null);
    setEqDateMService(null);
    setEqDateInstallation(null);
    setEqDateDemo(null);
    setEqDateRemplacement(null);
    // setPost("");
    // setArticle("");
    // setRess("");
    // setCentre("");
    // setSite("");
    setEqDateFinG(null);
    setEqDureG(0);
    reset();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    refreshh();
    reset();
  };

  const [type, setType] = React.useState([]); // Initialiser l'état type avec un tableau vide
  const [famille, setFamille] = React.useState([]);
  const [societe, setSociete] = React.useState([]);

  const loadType = async () => {
    try {
      const response = await adminService.getAllTypes();
      setType(response.data); // Mettre à jour l'état type avec les données récupérées de l'API
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadSociete = async () => {
    try {
      const response = await clientService.getAllClients();
      setSociete(response.data); // Mettre à jour l'état type avec les données récupérées de l'API
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadFamille = async () => {
    try {
      const response = await adminService.getAllFamilles();
      setFamille(response.data); // Mettre à jour l'état famille avec les données récupérées de l'API
    } catch (error) {
      console.error("Error fetching famille data:", error);
    }
  };

  useEffect(() => {
    loadType();
    loadFamille();
    loadSociete();
  }, []); // Assurez-vous de passer un tableau vide pour exécuter ces fonctions une seule fois au montage du composant

  //l'ajout
  const [eq_code, setEqCode] = React.useState("");
  const [eq_designation, setEqDesignation] = React.useState("");
  const [eq_type, setEqType] = React.useState("");
  const [eq_famille, setEqFamille] = React.useState("");
  const [eq_identifiant, setEqIdentifiant] = React.useState("");
  const [eq_societe, setEqSociete] = React.useState("");
  const [eq_dt_achat, setEqDateAchat] = React.useState(null);
  const [eq_dt_fab, setEqDateFab] = React.useState(null);
  const [eq_dt_livraison, setEqDateLivraison] = React.useState(null);
  const [eq_dt_ms_en_service, setEqDateMService] = React.useState(null);
  const [eq_dt_installation, setEqDateInstallation] = React.useState(null);
  const [eq_dt_demo, setEqDateDemo] = React.useState(null);
  const [eq_dt_remplacement, setEqDateRemplacement] = React.useState(null);
  const [eq_garantie, setEqGarantie] = React.useState("O");
  const [eq_critique, setEqCritique] = React.useState("N");
  // @ts-ignore
  // @ts-ignore
  const [eq_dt_creation, setEqDateCreation] = React.useState(null);
  const [eq_dt_mj, setEqDateMJ] = React.useState(null);
  const [eq_localisation, setEqLocalisation] = React.useState("");
  const [eq_enservice, setEqEnService] = React.useState("O");
  // const [eqClient, setEqClient] = React.useState(eqty_client);
  const [eq_login_cre, setEqLoginCre] = React.useState("");
  const [eq_login_mj, setEqLoginMJ] = React.useState("");
  const [eq_machine, setEqMachine] = React.useState("N");
  const [eq_prix, setEqPrix] = React.useState(0.0);
  const [eq_user_cb1, setEqUserCB1] = React.useState("");
  const [eq_type_garantie, setEqTypeGarantie] = React.useState("AUC");
  const [eq_dt_fing, setEqDateFinG] = React.useState(null);
  const [eq_dureg, setEqDureG] = React.useState(0);
  const [eq_lot, setLot] = React.useState("");
  const [eq_num_serie, setNumSerie] = React.useState("");

  // @ts-ignore
  const [eqpm, setEqpm] = React.useState([]);

  const handleSaveDialog = (e) => {
    e.preventDefault();
    if (!eq_designation.trim()) {
      console.error("Le code et le libellé ne peuvent pas être vides.");
      return; // Sortir de la fonction si le code ou le libellé est vide
    }
    console.log("save date achat", eq_dt_achat);
  
    const eqpm = {
      eqptDesignation: eq_designation,
      type: eq_type,
      famille: eq_famille,
      eqptId: eq_identifiant,
      eqptDtAchat: eq_dt_achat,
      eqptGarantie: eq_garantie,
      eqptCritique: eq_critique,
      eqptDtCreation: new Date(),
      eqptDtMaj: eq_dt_mj,
      eqptLocalisation: eq_localisation,
      eqptEnService: eq_enservice,
      eqptLoginCreation: eq_login_cre,
      eqptLoginMaj: eq_login_mj,
      eqptMachine: eq_machine,
      eqptPrix: eq_prix,
      eqptUserCB1: eq_user_cb1,
      eqptGarTypeDtRef: eq_type_garantie,
      //siteCode: eq_site,
      dateFabrication: eq_dt_fab,
      dateLivraison: eq_dt_livraison,
      dateMiseEnService: eq_dt_ms_en_service,
      dateInstallation: eq_dt_installation,
      dateRemplacement: eq_dt_remplacement,
      //ressCode: eq_ress,
      //postCode: eq_post,
      eqptDureeGarantie: eq_dureg,
      dateFinGarantie: eq_dt_fing,
      dateDemontage: eq_dt_demo,
      //articleCode: eq_article,
      //centreCode: eq_centre,
      eqptLotNumero: eq_lot,
      eqptNumeroSerie: eq_num_serie,
      client: eq_societe,
    };
  
    console.log("avant l'ajout", eqpm);
    
    adminService.saveEquipement(eqpm)
      .then((response) => {
        // Ajouter l'équipement nouvellement ajouté à la liste existante
        setEqpm((prevEqpms) => [...prevEqpms, response.data]);
        navigate("/technicien/equipement")
        console.log("Equipment added successfully:", response.data);
        // Réinitialiser les champs
        refreshh();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  const handleChangeCritique = (event) => {
    setEqCritique(event.target.checked ? "O" : "N");
  };

  const handleChangeService = (event) => {
    setEqEnService(event.target.checked ? "O" : "N");
  };

  const handleChangeMachine = (event) => {
    setEqMachine(event.target.checked ? "O" : "N");
  };

  const handleChangeGarantie = (event) => {
    setEqGarantie(event.target.checked ? "O" : "N");
  };

  const [value, setValue] = React.useState(0);

  // @ts-ignore
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }; // Ajouter cette accolade pour fermer la fonction handleChange

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const onSubmit = (data) => {
    console.log(data);
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  // @ts-ignore
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <Box
    sx={{
      maxWidth: 760,
      mx: "auto",
      p: 3,
      mt: 0,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 2,
      boxShadow: 1,
      minHeight: "calc(88vh - 64px)",
    }}
  >
    <Container>
      {/* Ajouter le composant Paper autour du contenu */}
      <Header title="CRÉER UN EQUIPEMENT " subTitle=" " />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        noValidate
        autoComplete="off"
      >
        {/* Les champs de texte */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Designation"
              variant="outlined"
              value={eq_designation}
              onChange={(e) => setEqDesignation(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Identifiant"
              variant="outlined"
              value={eq_identifiant}
              onChange={(e) => setEqIdentifiant(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                options={societe}
                getOptionLabel={(option) => option.nomSociete}
                sx={{ width: "100%" }}
                //size="small"
                // @ts-ignore
                onChange={(event, value) => {
                  setEqSociete(value);
                  console.log(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Société"
                    {...register("societe", { required: true })}
                    error={Boolean(errors.societe)}
                    helperText={
                      errors.codeType ? "Ce champ est obligatoire" : null
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={eq_critique === "O"}
                    onChange={handleChangeCritique}
                  />
                }
                label="Critique"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={eq_enservice === "O"}
                    onChange={handleChangeService}
                  />
                }
                label="En service"
              />
            </FormGroup>
          </Grid>
          
        </Grid>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Général" {...a11yProps(0)} />
            <Tab label="Réference" {...a11yProps(1)} />
            <Tab label="Historique" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                options={type}
                getOptionLabel={(option) => option.eqtyLibelle}
                sx={{ width: "100%" }}
                //size="small"
                // @ts-ignore
                onChange={(event, value) => {
                  setEqType(value);
                  console.log(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Equipement type"
                    {...register("codeType", { required: true })}
                    error={Boolean(errors.codeType)}
                    helperText={
                      errors.codeType ? "Ce champ est obligatoire" : null
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                //size="small"
                options={famille}
                getOptionLabel={(option) => option.eqfaLibelle}
                sx={{ width: "100%" }}
                // @ts-ignore
                onChange={(event, value) => {
                  setEqFamille(value);
                  console.log(value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Equipement famille" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Localisation"
                variant="outlined"
                //size="small"
                value={eq_localisation}
                onChange={(e) => setEqLocalisation(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Prix"
                variant="outlined"
                type="number"
                value={eq_prix}
                onChange={(e) => setEqPrix(parseFloat(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Numero de lot"
                variant="outlined"
                value={eq_lot}
                onChange={(e) => setLot(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Numero de serie"
                variant="outlined"
                value={eq_num_serie}
                onChange={(e) => setNumSerie(e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                error={Boolean(errors.gar)}
                helperText={errors.gar ? "Ce champ est obligatoire" : null}
                {...register("gar", { required: true, maxLength: 3 })}
                label="Type de garantie"
                value={eq_type_garantie}
                onChange={(e) => setEqTypeGarantie(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Durée"
                variant="outlined"
                type="number"
                value={eq_dureg}
                onChange={(e) => setEqDureG(parseFloat(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // @ts-ignore
                locale={esLocale}
              >
                <DatePicker
                  label="Date fin garantie"
                  value={eq_dt_fing}
                  onChange={(date) => setEqDateFinG(date)}
                  // @ts-ignore
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => <TextField {...params} />}
                  fullWidth
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={eq_machine === "O"}
                      onChange={handleChangeMachine}
                      sx={{
                        color: color,
                        "&.Mui-checked": {
                          color: color,
                        },
                      }}
                    />
                  }
                  label="Machine"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={eq_garantie === "O"}
                      onChange={handleChangeGarantie}
                      sx={{
                        color: color,
                        "&.Mui-checked": {
                          color: color,
                        },
                      }}
                    />
                  }
                  label="Garantie"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // @ts-ignore
                locale={esLocale}
              >
                <DatePicker
                  label="Date de fabrication"
                  value={eq_dt_fab}
                  onChange={(date) => setEqDateFab(date)}
                  // @ts-ignore
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // @ts-ignore
                locale={esLocale}
              >
                <DatePicker
                  label="Date de livraison"
                  value={eq_dt_livraison}
                  onChange={(date) => setEqDateLivraison(date)}
                  // @ts-ignore
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // @ts-ignore
                locale={esLocale}
              >
                <DatePicker
                  label="Mise en service"
                  value={eq_dt_ms_en_service}
                  onChange={(date) => setEqDateMService(date)}
                  // @ts-ignore
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // @ts-ignore
                locale={esLocale}
              >
                <DatePicker
                  label="Date d'achat"
                  value={eq_dt_achat}
                  onChange={(date) => setEqDateAchat(date)}
                  // @ts-ignore
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // @ts-ignore
                locale={esLocale}
              >
                <DatePicker
                  label="Installation"
                  value={eq_dt_installation}
                  onChange={(date) => setEqDateInstallation(date)}
                  // @ts-ignore
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // @ts-ignore
                locale={esLocale}
              >
                <DatePicker
                  label="Date de demonstration"
                  value={eq_dt_demo}
                  onChange={(date) => setEqDateDemo(date)}
                  // @ts-ignore
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // @ts-ignore
                locale={esLocale}
              >
                <DatePicker
                  label="Date de remplacement"
                  value={eq_dt_remplacement}
                  onChange={(date) => setEqDateRemplacement(date)}
                  // @ts-ignore
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CustomTabPanel>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="outlined"  onClick={handleSaveDialog} sx={{color:"#4e617f"}}>
          Sauvegarder
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ ml: 1 }}
          onClick={handleCloseDialog}
        >
          Fermer
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          L'équipement a été ajouté avec succès!
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
};

export default AddEq;
