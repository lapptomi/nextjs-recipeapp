import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography, styled } from "@mui/material";
import { useRecipeChat } from "./-components/useRecipeChat";
import RecipeChatInitialView from "./-components/RecipeChatInitialView";
import RecipeChatView from "./-components/RecipeChatView";

const PageContainer = styled(Box)({
  display: "flex",
  flex: 1,
  minHeight: 0,
  flexDirection: "column",
  backgroundColor: "white",
});

const ChatHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: "white",
  padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const HeaderDivider = styled(Box)(({ theme }) => ({
  width: 1,
  height: 24,
  backgroundColor: theme.palette.grey[200],
}));

const ContentContainer = styled(Box)({
  display: "flex",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
  flexDirection: "column",
});

const NewChatButton = styled(Button)({
  marginLeft: "auto",
  whiteSpace: "nowrap",
});

export default function GenerateRecipePage() {
  const {
    messages,
    assistantThinking,
    isChatMode,
    sendMessage,
    startChat,
    reset,
  } = useRecipeChat();

  return (
    <PageContainer>
      {isChatMode && (
        <ChatHeader>
          <Button
            startIcon={<ArrowBackIcon />}
            color="secondary"
            size="small"
            onClick={reset}
          >
            Back
          </Button>
          <HeaderDivider />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              AI Recipe Generator
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Powered by AI
            </Typography>
          </Box>
          <NewChatButton variant="outlined" size="small" onClick={reset}>
            New Chat
          </NewChatButton>
        </ChatHeader>
      )}

      <ContentContainer>
        {isChatMode ? (
          <RecipeChatView
            messages={messages}
            assistantThinking={assistantThinking}
            onSend={sendMessage}
          />
        ) : (
          <RecipeChatInitialView onStartChat={startChat} />
        )}
      </ContentContainer>
    </PageContainer>
  );
}
