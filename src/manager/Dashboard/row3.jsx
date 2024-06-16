import {
  Box,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import TicketBarChart from "./barChart1";

const Row3 = () => {
  const theme = useTheme();
  return (
    <Paper sx={{ flexGrow: 1, width: "auto", height: "400px" }}>
      <Stack
        alignItems={"center"}
        direction={"row"}
        flexWrap={"wrap"}
        justifyContent={"space-between"}
      >
        <Box>
          <Typography
            color={theme.palette.secondary.main}
            mt={2}
            ml={3}
            variant="h6"
            fontWeight={"bold"}
          >
            Nombre de tickets par équipement
          </Typography>
          <TicketBarChart />
        </Box>
      </Stack>
    </Paper>
  );
};

export default Row3;
