import { useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import QuickStartCards from "./QuickStartCards";

const ScrollContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
});

const ContentStack = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(4),
}));

const HeaderRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 64,
  height: 64,
  borderRadius: Number(theme.shape.borderRadius) * 3,
  background: "linear-gradient(135deg, #fb923c, #ed6c02, #c2410c)",
  boxShadow: "0 8px 24px rgba(237,108,2,0.4)",
}));

const PromptContainer = styled(Box)({
  width: "100%",
  maxWidth: 600,
});

const HintText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: "block",
  textAlign: "center",
}));

interface Props {
  onStartChat: (value: string) => void;
}

export default function RecipeChatInitialView({ onStartChat }: Props) {
  const [prompt, setPrompt] = useState("");

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onStartChat(prompt);
    }
  }

  return (
    <ScrollContainer>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <ContentStack>
          <HeaderRow>
            <IconContainer>
              <AutoAwesomeIcon sx={{ fontSize: 32, color: "white" }} />
            </IconContainer>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: "bold" }}
                color="primary"
              >
                What are you craving?
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Describe your ideal meal and I'll create a personalized recipe
                for you.
              </Typography>
            </Box>
          </HeaderRow>

          <PromptContainer>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              minRows={3}
              placeholder='E.g., "Quick pasta dinner for 2 with vegetables"'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color={prompt.trim() ? "primary" : "default"}
                        disabled={!prompt.trim()}
                        onClick={() => onStartChat(prompt)}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <HintText variant="caption" sx={{ color: "text.secondary" }}>
              Press Enter to send or choose a starter below
            </HintText>
          </PromptContainer>

          <QuickStartCards onSelect={onStartChat} />
        </ContentStack>
      </Container>
    </ScrollContainer>
  );
}
