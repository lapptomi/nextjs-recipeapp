import { Box, Typography, styled } from "@mui/material";
import CollapsibleSection from "./CollapsibleSection";

const InstructionsList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(1),
}));

export default function GeneratedRecipeInstructions({
  instructions,
}: {
  instructions: string[];
}) {
  return (
    <CollapsibleSection
      title="Instructions"
      count={`${instructions.length} steps`}
    >
      <InstructionsList>
        {instructions.map((step, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5 }}>
            <Typography variant="body1">{i + 1}.</Typography>
            <Typography variant="body1" color="text.secondary">
              {step}
            </Typography>
          </Box>
        ))}
      </InstructionsList>
    </CollapsibleSection>
  );
}
