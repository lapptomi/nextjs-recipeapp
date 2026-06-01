import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../../../lib/apiClient";
import {
  ChatRole,
  type ChatMessage,
  type GeneratedRecipe,
  type RecipeChatTurn,
} from "../../../../types/generate";

function formatMessage(
  role: ChatMessage["role"],
  content: string,
  recipe?: GeneratedRecipe,
): ChatMessage {
  return { id: crypto.randomUUID(), role, content, recipe };
}

export function useRecipeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const mutation = useMutation({
    mutationFn: (conversation: ChatMessage[]) => {
      const turns: RecipeChatTurn[] = conversation.map((m) => ({
        role: m.role,
        content: m.content,
        recipe: m.recipe,
      }));
      return apiClient.post("/openai/recipe-chat", { messages: turns });
    },
    onSuccess: (response) => {
      setMessages((prev) =>
        prev.concat(
          formatMessage(ChatRole.Assistant, response.message, response.recipe),
        ),
      );
    },
    onError: (e: Error) => {
      setMessages((prev) =>
        prev.concat(
          formatMessage(
            ChatRole.Assistant,
            `Sorry, I couldn't generate a recipe right now: ${e.message}`,
          ),
        ),
      );
    },
  });

  const isChatMode = messages.length > 0 || mutation.isPending;

  function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || mutation.isPending) return;

    const userMessage = formatMessage(ChatRole.User, trimmed);
    const updatedMessages = messages.concat(userMessage);
    setMessages(updatedMessages);
    mutation.mutate(updatedMessages);
  }

  function startChat(value: string) {
    const trimmed = value.trim();
    if (!trimmed || mutation.isPending) return;

    const userMsg = formatMessage(ChatRole.User, trimmed);
    setMessages([userMsg]);
    mutation.mutate([userMsg]);
  }

  function reset() {
    setMessages([]);
    mutation.reset();
  }

  return {
    messages,
    assistantThinking: mutation.isPending,
    isChatMode,
    sendMessage,
    startChat,
    reset,
  };
}
