import SearchIcon from "@mui/icons-material/Search";
import { Box, Card, CardContent, Typography, styled } from "@mui/material";

const SectionCard = styled(Card)({
  marginBottom: 32,
  overflow: "hidden",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
});

const SectionIconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  width: 40,
  height: 40,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
}));

interface Props {
  instructions: string;
}

export default function RecipeInstructions({ instructions }: Props) {
  return (
    <SectionCard>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <SectionIconWrapper>
            <SearchIcon sx={{ color: "white", fontSize: 20 }} />
          </SectionIconWrapper>
          <Typography variant="h5" sx={{ color: "text.primary" }}>
            Instructions
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {instructions.split("\n").map((step, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
            >
              <Typography
                variant="body2"
                sx={{ minWidth: 24, fontWeight: "bold", color: "primary.main" }}
              >
                {i + 1}.
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </SectionCard>
  );
}
