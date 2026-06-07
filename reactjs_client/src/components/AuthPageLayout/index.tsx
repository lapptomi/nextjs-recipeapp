import { Box, styled, type Theme } from "@mui/material";

export const BlurredBackground = styled(Box)({
  backgroundImage: "url('/recipeimage.jpeg')",
  filter: "blur(15px) brightness(0.3)",
  transform: "scale(1.3)",
  zIndex: -1,
  backgroundRepeat: "no-repeat",
  backgroundColor: "gray",
  backgroundSize: "cover",
  minWidth: "65vw",
  backgroundPosition: "center",
});

export const FormPanel = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  width: 480,
}));
