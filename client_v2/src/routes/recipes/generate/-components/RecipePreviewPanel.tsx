import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, Typography, styled } from "@mui/material";
import type { ChatMessage } from "../../../../types/generate";
import GeneratedRecipeCard from "./GeneratedRecipeCard";

const PreviewPanel = styled(Box)({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  overflow: "hidden",
});

const PreviewScroll = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(3),
}));

const EmptyStateContainer = styled(Box)({
  display: "flex",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
});


interface Props {
  generatedRecipes: ChatMessage[];
  selectedMessageId: string | undefined;
  onAdjust: (adjustment: string) => void;
  onSave: (messageId: string) => void;
}

export default function RecipePreviewPanel({
  generatedRecipes,
  selectedMessageId,
  onAdjust,
  onSave,
}: Props) {
  return (
    <PreviewPanel>
      <PreviewScroll>
        {generatedRecipes.length === 0 ? (
          <EmptyStateContainer>
            <Box>
              <AutoAwesomeIcon
                sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }}
              />
              <Typography variant="body1" color="text.secondary">
                Your generated recipe will appear here
              </Typography>
            </Box>
          </EmptyStateContainer>
        ) : (
          generatedRecipes.map((msg) => (
            <Box key={msg.id} sx={{ display: msg.id === selectedMessageId ? "block" : "none" }}>
              <GeneratedRecipeCard
                recipe={msg.recipe!}
                onAdjust={onAdjust}
                onSave={() => onSave(msg.id)}
              />
            </Box>
          ))
        )}
      </PreviewScroll>
    </PreviewPanel>
  );
}
