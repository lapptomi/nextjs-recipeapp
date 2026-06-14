import { Box } from "@mui/material";

interface LaptopMockupProps {
  screenSrc: string;
  screenAlt?: string;
}

export default function LaptopMockup({
  screenSrc,
  screenAlt = "App screenshot",
}: LaptopMockupProps) {
  return (
    <Box sx={{ flex: 1, position: "relative" }}>
      <Box
        component="img"
        src="/laptop_realistic.svg"
        alt="Laptop"
        sx={{ width: "100%", height: "auto", display: "block" }}
      />
      {/* SVG viewBox is 0 135 600 330; screen rect: x=101, y=169.5, w=398, h=248 */}
      <Box
        component="img"
        src={screenSrc}
        alt={screenAlt}
        sx={{
          position: "absolute",
          top: "10.45%",
          left: "16.83%",
          width: "66.33%",
          height: "75.15%",
          objectFit: "fill",
        }}
      />
    </Box>
  );
}
