import { createTheme } from "@mui/material/styles";
import { Metrophobic } from "next/font/google";
import bg from "@/assets/global/5999.jpg";

export const metroPhobic = Metrophobic({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const theme = createTheme({
  palette: {
    primary: { main: "#000000" },
    secondary: { main: "#6B6B6B" },
    error: { main: "#FF0000" },
    success: { main: "#1A8917" },
  },
  typography: {
    fontFamily: metroPhobic.style.fontFamily,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          // backgroundImage: `linear-gradient(
          // rgba(255, 255, 255, 0.7),
          // rgba(255, 255, 255, 0.7)
          // ), url(${bg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        },
      },
    },
  },
});
