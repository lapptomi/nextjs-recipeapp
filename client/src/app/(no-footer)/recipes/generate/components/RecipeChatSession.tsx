"use client";

import { useEffect, useState } from "react";

import RecipeChatInitialView from "./RecipeChatInitialView";
import RecipeChatView from "./RecipeChatView";
import { generateRecipeChatReply } from "@/lib/actions/openai";
import { ChatRole } from "@/types";
import type { ChatMessage, GeneratedRecipe, RecipeChatTurn } from "@/types";

interface RecipeChatSessionProps {
  startInChatMode?: boolean;
  onSessionActiveChange: (active: boolean) => void;
}

function createChatMessage(params: {
  role: ChatMessage["role"];
  content: string;
  recipe?: GeneratedRecipe;
}): ChatMessage {
  return {
    id: globalThis.crypto.randomUUID(),
    role: params.role,
    content: params.content,
    recipe: params.recipe,
  };
}

function mapChatMessagesToRecipeTurns(messages: ChatMessage[]): RecipeChatTurn[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
    recipe: message.recipe,
  }));
}

export default function RecipeChatSession({
  startInChatMode = false,
  onSessionActiveChange,
}: RecipeChatSessionProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [assistantThinking, setAssistantThinking] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const isChatMode = startInChatMode || messages.length > 0 || assistantThinking;

  useEffect(() => {
    onSessionActiveChange(isChatMode);
  }, [isChatMode, onSessionActiveChange]);

  function fetchAssistantReply(conversation: ChatMessage[]) {
    setAssistantThinking(true);

    generateRecipeChatReply(mapChatMessagesToRecipeTurns(conversation))
      .then((response) => {
        setMessages((prev) => [
          ...prev,
          createChatMessage({
            role: ChatRole.Assistant,
            content: response.message,
            recipe: response.recipe,
          }),
        ]);
      })
      .catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : "Failed to generate recipe.";

        setMessages((prev) => [
          ...prev,
          createChatMessage({
            role: ChatRole.Assistant,
            content: `Sorry, I couldn't generate a recipe right now: ${errorMessage}`,
          }),
        ]);
      })
      .finally(() => {
        setAssistantThinking(false);
      });
  }

  function addUserMessageToHistory(content: string, history: ChatMessage[]) {
    const trimmedContent = content.trim();
    if (!trimmedContent || assistantThinking) return;

    const userMessage = createChatMessage({ role: ChatRole.User, content: trimmedContent });
    return [...history, userMessage];
  }

  function sendMessage(content: string) {
    const nextConversation = addUserMessageToHistory(content, messages);
    if (!nextConversation) return;

    setMessages(nextConversation);
    setChatInput("");
    fetchAssistantReply(nextConversation);
  }

  function startChat(value: string) {
    const nextConversation = addUserMessageToHistory(value, []);
    if (!nextConversation) return;

    setMessages(nextConversation);
    setPrompt("");
    setChatInput("");
    fetchAssistantReply(nextConversation);
  }

  if (isChatMode) {
    return (
      <RecipeChatView
        messages={messages}
        assistantThinking={assistantThinking}
        input={chatInput}
        onInputChange={setChatInput}
        onSend={sendMessage}
        onAdjust={sendMessage}
      />
    );
  }

  return (
    <RecipeChatInitialView prompt={prompt} onPromptChange={setPrompt} onStartChat={startChat} />
  );
}
