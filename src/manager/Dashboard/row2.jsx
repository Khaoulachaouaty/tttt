import {
    Box,
    Paper,
    Stack,
    Typography,
    useTheme,
  } from "@mui/material";
import Pie from "./pie";
import BarChart from "./barChart";
  
  const Row2 = () => {
    const theme = useTheme();
    return (
      <Stack direction={"row"} flexWrap={"wrap"} gap={1.2} mt={1.3}>
        <Paper sx={{ flexGrow: 1, height:"400px" }}>
          <Stack
            alignItems={"center"}
            direction={"row"}
            flexWrap={"wrap"}
            justifyContent={"space-between"}
          >
            <Box sx={{ width: "100%", flexGrow: 1, mr: 2}}>
              <Typography
                color={theme.palette.secondary.main}
                mt={2}
                ml={3}
                variant="h6"
                fontWeight={"bold"}
              >
                Les interventions en retard et à temps pour chaque technicien
              </Typography>
              <BarChart/>
            </Box>
  
           
          </Stack>
  
        </Paper>

        <Paper sx={{ flexGrow: 1, height:"400px" }}>
        <Stack
          alignItems={"center"}
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <Box sx={{
          overflow: "auto",
          borderRadius: "4px",
          width: "100%",
          height: "400px",
          flexGrow: 1,
        }}>
          
            <Typography
              color={theme.palette.secondary.main}
              fontWeight={"bold"}
              p={1.2}
              variant="h6"
              ml={2}
              mt={3}
            >
              Interventions réalisées par société
            </Typography>
            <Pie  />
            </Box>
        </Stack>
      </Paper>
      </Stack>
    );
  };
  
  export default Row2;
  