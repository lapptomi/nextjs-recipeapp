import { Box, Typography } from "@mui/material";

import CollapsibleSection from "./CollapsibleSection";

interface InstructionsSectionProps {
  instructions: string[];
}

export default function InstructionsSection({ instructions }: InstructionsSectionProps) {
  return (
    <CollapsibleSection title="Instructions" count={`${instructions.length} steps`}>
      <Box className="flex flex-col gap-3">
        {instructions.map((step, i) => (
          <Box key={i} className="flex gap-3">
            <Typography variant="body1">{i + 1}.</Typography>
            <Typography variant="body1" color="text.secondary">
              {step}
            </Typography>
          </Box>
        ))}
      </Box>
    </CollapsibleSection>
  );
}
