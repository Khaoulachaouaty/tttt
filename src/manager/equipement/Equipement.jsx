import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { adminService } from "../../services/equipement_service";
import Header from "../../admin/components/Header";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "30%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100px",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Equipement = () => {
  const theme = useTheme();

  const cardStyles = {
    backgroundColor: theme.palette.mode === "light" ? "#f3f8fb" : "#292929",
  };

  const codeStyles = {
    fontSize: "1rem",
    color: theme.palette.mode === "light" ? "#666666" : "#e7e7e7",
  };

  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [selectedSociete, setSelectedSociete] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedFamille, setSelectedFamille] = useState("");

  const [societes, setSocietes] = useState([]);
  const [types, setTypes] = useState([]);
  const [familles, setFamilles] = useState([]);

  useEffect(() => {
    loadEquipements();
  }, []);

  useEffect(() => {
    filterEquipements();
  }, [searchInputValue, selectedSociete, selectedType, selectedFamille]);

  useEffect(() => {
    const societes = extractUniqueValues(searchResults, "client");
    const types = extractUniqueValues(searchResults, "type");
    const familles = extractUniqueValues(searchResults, "famille");
    setSocietes(societes);
    setTypes(types);
    setFamilles(familles);
  }, [searchResults]);

  const loadEquipements = async () => {
    try {
      const response = await adminService.getAllEquipements();
      setSearchResults(response.data);
      setFilteredResults(response.data); // Initialize with full list
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const extractUniqueValues = (data, key) => {
    if (key === "client") {
      return [...new Set(data.map((item) => item.client.nomSociete))];
    } else if (key === "type") {
      return [...new Set(data.map((item) => item.type.eqtyLibelle))];
    } else if (key === "famille") {
      return [...new Set(data.map((item) => item.famille.eqfaLibelle))];
    }
    return [];
  };

  const filterEquipements = () => {
    const libelle = searchInputValue.toLowerCase();
    const filteredResults = searchResults.filter((eqm) => {
      const matchesDesignation = eqm.eqptDesignation
        ?.toLowerCase()
        .includes(libelle);
      const matchesSociete = selectedSociete
        ? eqm.client.nomSociete === selectedSociete
        : true;
      const matchesType = selectedType ? eqm.type.eqtyLibelle === selectedType : true;
      const matchesFamille = selectedFamille
        ? eqm.famille.eqfaLibelle === selectedFamille
        : true;
      return (
        matchesDesignation && matchesSociete && matchesType && matchesFamille
      );
    });
    setFilteredResults(filteredResults);
  };

  const handleSearchChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  return (
    <Box component="main" sx={{ minHeight: "calc(100vh - 64px)" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
         // margin="5px"
          sx={{ fontWeight: 500 }}
        >
          Equipements
        </Typography>
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <Select
            value={selectedSociete}
            onChange={(e) => setSelectedSociete(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{width:200, height:45}}
          >
            <MenuItem value="">Toutes les sociétés</MenuItem>
            {societes.map((societe, index) => (
              <MenuItem key={index} value={societe}>{societe}</MenuItem>
            ))}
          </Select>

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{width:200, height:45}}
          >
            <MenuItem value="">Tous les types</MenuItem>
            {types.map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </Select>

          <Select
            value={selectedFamille}
            onChange={(e) => setSelectedFamille(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{width:200, height:45}}
          >
            <MenuItem value="">Toutes les familles</MenuItem>
            {familles.map((famille, index) => (
              <MenuItem key={index} value={famille}>{famille}</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
          minHeight: 400,
        }}
      >
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.background.main
                : theme.palette.background.main,
            padding: "5px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
                Liste des équipements
              </Box>
            }
            subTitle=""
          />
          <Search
            sx={{
              backgroundColor:
                theme.palette.mode === "light" ? "#f3f8fb" : "#6d6d6d",
              width: "200px",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Chercher…"
              inputProps={{ "aria-label": "search" }}
              value={searchInputValue || ""}
              onChange={handleSearchChange}
            />
          </Search>
        </Box>
        <Box sx={{ gap: 3 }} my={1}>
          <main className="flex">
            <section
              className="flex right-section"
              style={{ justifyContent: "flex-start" }}
            >
              {searchInputValue !== "" && filteredResults.length === 0 && (
                <p>Aucun résultat trouvé pour `{searchInputValue}`</p>
              )}
              {filteredResults.map((eqm) => (
                <article key={eqm.eqptCode} className="card" style={cardStyles}>
                  <img
                    width={246}
                    height={200}
                    src={
                      eqm.image
                        ? `data:${eqm.image.type};base64,${eqm.image.image}`
                        : "/public/image.jpg"
                    }
                    alt={eqm.eqptDesignation}
                  />
                  <div style={{ width: "246px" }} className="box">
                    <h1 className="title">{eqm.eqptDesignation}</h1>
                    <p style={codeStyles} className="code">
                      Code: {eqm.eqptCode}
                    </p>
                    <p style={codeStyles}>
                     Société: {eqm.client.nomSociete}
                    </p>
                    <div className="flex icons">
                      <div style={{ gap: "11px" }} className="flex">
                        <div className="icon-link"></div>
                        <div className="icon-github"></div>
                      </div>
                      <Link
                        to={`./details?eqptCode=${eqm.eqptCode}`}
                        style={{
                          color:
                            theme.palette.mode === "light" ? "#677f8e" : "#c5d9dc",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          marginLeft: 200,
                        }}
                      >
                        <ArrowForwardIcon />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </main>
        </Box>
      </Box>
    </Box>
  );
};

export default Equipement;
