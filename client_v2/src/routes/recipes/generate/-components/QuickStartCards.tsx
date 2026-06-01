import { Box, Button, Typography, styled } from "@mui/material";

const QUICK_START_CARDS = [
  { label: "Quick weeknight dinner under 30 minutes", image: "/r3.jpg" },
  { label: "Healthy meal with chicken", image: "/r2.jpg" },
  { label: "Comfort food for a cozy evening", image: "/r1.jpg" },
  { label: "Impressive dish for guests", image: "/r4.jpg" },
];

const QuickStartSection = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 980,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));


const CardGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

const QuickStartCard = styled(Button)(({ theme }) => ({
  position: "relative",
  width: 220,
  height: 150,
  borderRadius: Number(theme.shape.borderRadius) * 3,
  overflow: "hidden",
  padding: 0,
  textTransform: "none",
  boxShadow: theme.shadows[3],
  "&:hover img": { transform: "scale(1.05)" },
  "&:hover": { boxShadow: theme.shadows[5] },
}));

const CardImage = styled("img")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.2s",
});


const CardLabel = styled(Typography)({
  position: "absolute",
  bottom: 12,
  left: 12,
  right: 12,
  color: "white",
  fontWeight: 500,
  textAlign: "left",
});

interface Props {
  onSelect: (label: string) => void;
}

export default function QuickStartCards({ onSelect }: Props) {
  return (
    <QuickStartSection>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.200" }} />
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: 3 }}
        >
          Quick Start
        </Typography>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.200" }} />
      </Box>

      <CardGrid>
        {QUICK_START_CARDS.map(({ label, image }) => (
          <QuickStartCard key={label} onClick={() => onSelect(label)}>
            <CardImage src={image} alt={label} />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }} />
            <CardLabel variant="body2">{label}</CardLabel>
          </QuickStartCard>
        ))}
      </CardGrid>
    </QuickStartSection>
  );
}
