import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";


interface Props {
  assistantThinking: boolean;
  onSend: (message: string) => void;
}

export default function ChatInput({ assistantThinking, onSend }: Props) {
  const [input, setInput] = useState("");

  const canSend = input.trim().length > 0 && !assistantThinking;

  function handleSend() {
    onSend(input);
    setInput("");
  }

  return (
    <Box sx={{ borderTop: "1px solid #eeeeee", backgroundColor: "white", p: 2.5 }}>
      <TextField
        fullWidth
        multiline
        maxRows={3}
        placeholder="Describe what you'd like to cook next..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        variant="outlined"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSend}
                  disabled={!canSend}
                  color={canSend ? "primary" : "default"}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", textAlign: "center" }}>
        {assistantThinking
          ? "AI is thinking..."
          : "Press Enter to send, Shift + Enter for new line"}
      </Typography>
    </Box>
  );
}
