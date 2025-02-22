import { Box, Typography, useTheme } from "@mui/material";





const Header = ({title, subTitle, isDashboard=false}) => {
  const theme = useTheme();
  return (
    <Box mb={ isDashboard? 2 :1}>
    <Typography
      sx={{
        color: theme.palette.mode === 'light' ?  '#5736cc' : '#7361f3',
        fontWeight: "bold",
        
      }}
      variant="h5"
    >
      {title}
    </Typography>
    <Typography variant="body1">{subTitle}</Typography>
  </Box>

  
  );
}

export default Header;
