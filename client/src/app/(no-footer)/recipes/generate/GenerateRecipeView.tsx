"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography } from "@mui/material";
import RecipeChatView from "./RecipeChatView";
import RecipeChatInitialView from "./RecipeChatInitialView";
import { generateRecipeChatReply } from "@/lib/actions/openai";
import { ROUTES } from "@/types";
import type { ChatMessage } from "./chatModel";
import type { GeneratedRecipe, RecipeChatTurn } from "@/lib/actions/openai";

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
    content:
      message.role === "assistant" && message.recipe
        ? JSON.stringify({ message: message.content, recipe: message.recipe })
        : message.content,
  }));
}

export default function GenerateRecipeView() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [assistantThinking, setAssistantThinking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelActiveRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setAssistantThinking(false);
  }, []);

  useEffect(() => cancelActiveRequest, [cancelActiveRequest]);

  const requestAssistantReply = useCallback((conversation: ChatMessage[]) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setAssistantThinking(true);

    generateRecipeChatReply(mapChatMessagesToRecipeTurns(conversation))
      .then((response) => {
        if (controller.signal.aborted) return;
        setMessages((prev) => [
          ...prev,
          createChatMessage({
            role: "assistant",
            content: response.message,
            recipe: response.recipe,
          }),
        ]);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const errorMessage = error instanceof Error ? error.message : "Failed to generate recipe.";
        setMessages((prev) => [
          ...prev,
          createChatMessage({
            role: "assistant",
            content: `Sorry, I couldn't generate a recipe right now: ${errorMessage}`,
          }),
        ]);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        if (abortControllerRef.current !== controller) return;
        abortControllerRef.current = null;
        setAssistantThinking(false);
      });
  }, []);

  const sendMessage = useCallback(
    (text?: string) => {
      if (assistantThinking) return;

      const source = typeof text === "string" ? text : chatInput;
      const content = source.trim();
      if (!content) return;

      const userMessage = createChatMessage({ role: "user", content });
      const nextConversation = [...messages, userMessage];
      setMessages(nextConversation);
      setChatInput("");
      requestAssistantReply(nextConversation);
    },
    [assistantThinking, chatInput, messages, requestAssistantReply]
  );

  const startChat = useCallback(
    (value: string) => {
      const trimmedPrompt = value.trim();
      if (!trimmedPrompt || assistantThinking) return;

      const firstUserMessage = createChatMessage({ role: "user", content: trimmedPrompt });
      setMessages([firstUserMessage]);
      setPrompt("");
      setChatInput("");
      requestAssistantReply([firstUserMessage]);
    },
    [assistantThinking, requestAssistantReply]
  );

  const handleResetChat = useCallback(() => {
    cancelActiveRequest();
    setMessages([]);
    setChatInput("");
    setPrompt("");
  }, [cancelActiveRequest]);

  const isChatMode = messages.length > 0 || assistantThinking;

  return (
    <Box className="flex min-h-0 flex-1 flex-col bg-white">
      <Box className="flex items-center gap-3 border-b border-gray-200 bg-white px-8 py-3">
        <Button startIcon={<ArrowBackIcon />} color="secondary" size="small" href={ROUTES.RECIPES}>
          Back
        </Button>
        <Box className="h-6 w-px bg-gray-200" />
        <Box className="flex flex-col">
          <Typography variant="body1" className="font-bold">
            AI Recipe Generator
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Powered by AI
          </Typography>
        </Box>
        <Box className="ml-auto flex items-center gap-2">
          {messages.length > 0 && (
            <Button variant="outlined" size="small" onClick={handleResetChat}>
              New Chat
            </Button>
          )}
        </Box>
      </Box>

      <Box className="flex min-h-0 flex-1 overflow-hidden">
        {isChatMode ? (
          <RecipeChatView
            messages={messages}
            assistantThinking={assistantThinking}
            input={chatInput}
            onInputChange={setChatInput}
            onSend={sendMessage}
            onAdjust={sendMessage}
          />
        ) : (
          <RecipeChatInitialView
            prompt={prompt}
            onPromptChange={setPrompt}
            onStartChat={startChat}
          />
        )}
      </Box>
    </Box>
  );
}
