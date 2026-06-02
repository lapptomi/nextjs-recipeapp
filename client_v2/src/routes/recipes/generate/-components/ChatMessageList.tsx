import { useEffect, useRef } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, Typography, styled } from "@mui/material";
import { ChatRole, type ChatMessage } from "../../../../types/generate";
import RecipeVersionCard from "./RecipeVersionCard";

const ScrollArea = styled(Box)({
  flex: 1,
  overflowY: "auto",
  paddingTop: 24,
  paddingBottom: 24,
});

const MessageList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  padding: `0 ${theme.spacing(1.5)}`,
}));

const UserMessageRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-end",
  gap: theme.spacing(1.5),
}));

const UserBubble = styled(Box)(({ theme }) => ({
  maxWidth: "75%",
  borderRadius: Number(theme.shape.borderRadius) * 4,
  padding: `${theme.spacing(1.75)} ${theme.spacing(2.5)}`,
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.secondary.main,
}));

const UserAvatar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: Number(theme.shape.borderRadius) * 3,
  border: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: theme.palette.grey[100],
  flexShrink: 0,
}));

const AssistantAvatar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: Number(theme.shape.borderRadius) * 3,
  background: "linear-gradient(135deg, #fbbf24, #1c1c1c)",
  boxShadow: theme.shadows[2],
  flexShrink: 0,
}));

const AssistantMessageContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: 1,
  minWidth: 0,
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

const AssistantBubble = styled(Box)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 4,
  border: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: "white",
  padding: `${theme.spacing(1.75)} ${theme.spacing(2.5)}`,
}));

const ThinkingBubble = styled(Box)(({ theme }) => ({
  maxWidth: "75%",
  borderRadius: Number(theme.shape.borderRadius) * 4,
  border: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: "white",
  padding: `${theme.spacing(2)} ${theme.spacing(2.5)}`,
}));

const ThinkingDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "delay",
})<{ delay: number }>(({ theme, delay }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.grey[400],
  animation: "pulse 1.5s infinite",
  animationDelay: `${delay}ms`,
}));

interface Props {
  messages: ChatMessage[];
  assistantThinking: boolean;
  generatedRecipes: ChatMessage[];
  selectedMessageId: string | undefined;
  savedMessageIds: string[];
  onSelectMessage: (id: string) => void;
}

export default function ChatMessageList({
  messages,
  assistantThinking,
  generatedRecipes,
  selectedMessageId,
  savedMessageIds,
  onSelectMessage,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [assistantThinking, messages]);

  return (
    <ScrollArea ref={scrollRef}>
      <MessageList>
        {messages.map((msg) => {
          if (msg.role === ChatRole.User) {
            return (
              <UserMessageRow key={msg.id}>
                <UserBubble>
                  <Typography variant="body1" color="white">
                    {msg.content}
                  </Typography>
                </UserBubble>
                <UserAvatar>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    You
                  </Typography>
                </UserAvatar>
              </UserMessageRow>
            );
          }

          return (
            <Box
              key={msg.id}
              sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
            >
              <AssistantAvatar>
                <AutoAwesomeIcon sx={{ fontSize: 20, color: "white" }} />
              </AssistantAvatar>
              <AssistantMessageContent>
                <AssistantBubble>
                  <Typography variant="body1" sx={{ color: "text.primary" }}>
                    {msg.content}
                  </Typography>
                </AssistantBubble>
                {msg.recipe && (
                  <RecipeVersionCard
                    recipe={msg.recipe}
                    version={generatedRecipes.indexOf(msg) + 1}
                    selected={msg.id === selectedMessageId}
                    saved={savedMessageIds.includes(msg.id)}
                    onClick={() => onSelectMessage(msg.id)}
                  />
                )}
              </AssistantMessageContent>
            </Box>
          );
        })}

        {assistantThinking && (
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <AssistantAvatar>
              <AutoAwesomeIcon sx={{ fontSize: 20, color: "white" }} />
            </AssistantAvatar>
            <ThinkingBubble>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                {[0, 150, 300].map((delay) => (
                  <ThinkingDot key={delay} delay={delay} />
                ))}
              </Box>
            </ThinkingBubble>
          </Box>
        )}
      </MessageList>
    </ScrollArea>
  );
}
