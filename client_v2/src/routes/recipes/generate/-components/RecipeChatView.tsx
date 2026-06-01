import { useState } from "react";
import { Box, styled } from "@mui/material";
import { ChatRole, type ChatMessage } from "../../../../types/generate";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import RecipePreviewPanel from "./RecipePreviewPanel";

const ChatLayout = styled(Box)({
  display: "flex",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
  flexDirection: "row",
});

const ChatPanel = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  width: 500,
  flexShrink: 0,
  borderRight: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: theme.palette.grey[100],
}));

interface Props {
  messages: ChatMessage[];
  assistantThinking: boolean;
  onSend: (message: string) => void;
}

export default function RecipeChatView({
  messages,
  assistantThinking,
  onSend,
}: Props) {
  const [manuallySelectedId, setManuallySelectedId] = useState<string>();
  const [savedMessageIds, setSavedMessageIds] = useState<string[]>([]);

  const generatedRecipes = messages.filter(
    (m) => m.role === ChatRole.Assistant && m.recipe,
  );
  const selectedMessageId = manuallySelectedId ?? generatedRecipes.at(-1)?.id;

  return (
    <ChatLayout>
      <ChatPanel>
        <ChatMessageList
          messages={messages}
          assistantThinking={assistantThinking}
          generatedRecipes={generatedRecipes}
          selectedMessageId={selectedMessageId}
          savedMessageIds={savedMessageIds}
          onSelectMessage={setManuallySelectedId}
        />
        <ChatInput assistantThinking={assistantThinking} onSend={onSend} />
      </ChatPanel>

      <RecipePreviewPanel
        generatedRecipes={generatedRecipes}
        selectedMessageId={selectedMessageId}
        onAdjust={onSend}
        onSave={(id) => setSavedMessageIds((prev) => prev.concat(id))}
      />
    </ChatLayout>
  );
}
