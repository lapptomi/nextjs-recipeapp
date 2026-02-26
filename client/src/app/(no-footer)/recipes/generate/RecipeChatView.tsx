"use client";

import { useEffect, useRef, useState } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SendIcon from "@mui/icons-material/Send";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { generateRecipeChatReply, saveGeneratedRecipe } from "@/lib/actions/openai";
import type { GeneratedRecipe, RecipeChatTurn } from "@/lib/actions/openai";
import { ROUTES } from "@/types";
import CircleIcon from "@mui/icons-material/Circle";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recipe?: GeneratedRecipe;
}

interface RecipeChatViewProps {
  initialPrompt: string;
}

const SUPPORTED_CATEGORIES = new Set(["breakfast", "lunch", "dinner", "dessert", "snack"]);

function buildSaveGeneratedRecipePayload(recipe: GeneratedRecipe) {
  const category = recipe.tags
    .map((tag) => tag.trim().toLowerCase())
    .find((tag) => SUPPORTED_CATEGORIES.has(tag));

  return {
    title: recipe.title,
    description: recipe.description,
    instructions: recipe.instructions,
    cookingTime: recipe.cookingTime,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    category,
  };
}

function getRecipeSaveErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return "Failed to save recipe. Please try again.";

  if (error.message.toLowerCase().includes("unauthorized")) {
    return "Please log in to save recipes.";
  }
  return error.message;
}

function requestAssistantReply(
  conversation: ChatMessage[],
  setAssistantThinking: React.Dispatch<React.SetStateAction<boolean>>,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  setAssistantThinking(true);

  const turns: RecipeChatTurn[] = conversation.map((message) => ({
    role: message.role,
    content:
      message.role === "assistant" && message.recipe
        ? JSON.stringify({ message: message.content, recipe: message.recipe })
        : message.content,
  }));

  return generateRecipeChatReply(turns)
    .then((response) =>
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.message,
          recipe: response.recipe,
        },
      ])
    )
    .catch((error: unknown) =>
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Sorry, I couldn't generate a recipe right now. ${error instanceof Error ? error.message : "Failed to generate recipe."}`,
        },
      ])
    )
    .finally(() => setAssistantThinking(false));
}

function RecipeCard({
  recipe,
  onAdjust,
}: {
  recipe: GeneratedRecipe;
  onAdjust: (adjustment: string) => void;
}) {
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecipeId, setSavedRecipeId] = useState<number | undefined>(undefined);
  const [savedImageUrl, setSavedImageUrl] = useState<string | undefined>(undefined);
  const [saveError, setSaveError] = useState<string | undefined>(undefined);
  const [showSaveSuccessSnackbar, setShowSaveSuccessSnackbar] = useState(false);
  const router = useRouter();

  const handleSaveRecipe = () => {
    if (isSaving || savedRecipeId) return;

    setIsSaving(true);
    setSaveError(undefined);

    saveGeneratedRecipe(buildSaveGeneratedRecipePayload(recipe))
      .then((createdRecipe) => {
        setSavedRecipeId(createdRecipe?.id);
        setSavedImageUrl(createdRecipe?.image ?? undefined);
        setShowSaveSuccessSnackbar(true);
      })
      .catch((error: unknown) => setSaveError(getRecipeSaveErrorMessage(error)))
      .finally(() => setIsSaving(false));
  };

  const handleOpenRecipe = () => {
    if (!savedRecipeId) return;
    router.push(`${ROUTES.RECIPES}/${savedRecipeId}`);
  };

  return (
    <Box className="w-full overflow-hidden rounded-2xl shadow-lg bg-white">
      <Box
        className={`relative h-56 w-full ${savedImageUrl ? "" : "bg-gray-200 border-y border-gray-300"}`}
      >
        {savedImageUrl ? (
          <>
            <Image src={savedImageUrl} alt={recipe.title} fill className="object-cover" />
            <Box className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.6),rgba(0,0,0,0.2)_50%,transparent)]" />
          </>
        ) : (
          <Box className="flex h-full items-center justify-center">
            <RestaurantIcon className="text-gray-400 drop-shadow-sm" style={{ fontSize: 80 }} />
          </Box>
        )}
        <Box className="absolute bottom-4 left-4 flex gap-3">
          <Chip
            icon={<AccessTimeIcon className="text-base" />}
            label={
              <Box className="flex items-center gap-1">
                <Typography variant="body2" fontWeight="bold">
                  {recipe.cookingTime}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  min
                </Typography>
              </Box>
            }
            size="small"
            className="h-9 rounded-full bg-white/95 px-2 shadow-lg"
          />
          <Chip
            icon={<PeopleOutlineIcon className="text-base" />}
            label={
              <Box className="flex items-center gap-1">
                <Typography variant="body2" fontWeight="bold">
                  {recipe.servings}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  servings
                </Typography>
              </Box>
            }
            size="small"
            className="h-9 rounded-full bg-white/95 px-2 shadow-lg"
          />
          <Chip
            icon={<WhatshotIcon className="text-base" />}
            label={
              <Typography variant="body2" fontWeight="bold">
                {recipe.difficulty}
              </Typography>
            }
            size="small"
            className="h-9 rounded-full bg-white/95 px-2 shadow-lg"
          />
        </Box>
      </Box>

      <Box className="flex flex-col gap-5 p-4 sm:p-6">
        <Box className="flex gap-4">
          <Box className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-secondary-main shadow-md">
            <AutoAwesomeIcon className="text-2xl text-white" />
          </Box>
          <Box className="flex flex-col gap-1">
            <Typography variant="h6" fontWeight="bold">
              {recipe.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {recipe.description}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="flex flex-col gap-3">
          <Box className="flex items-center gap-2">
            <Typography variant="body2" fontWeight="bold">
              Ingredients
            </Typography>
            <Typography variant="caption" color="text.disabled">
              ({recipe.ingredients.length})
            </Typography>
          </Box>
          <Box className="grid grid-cols-2 gap-x-6 gap-y-2">
            {recipe.ingredients.map((item, i) => (
              <Box key={i} className="flex items-center gap-4">
                <CircleIcon
                  className="flex justify-center items-center size-[6px]"
                  color="primary"
                />
                <Typography variant="body1" color="text.secondary">
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="rounded-lg bg-gray-50 p-3">
          <Button
            fullWidth
            color="secondary"
            onClick={() => setInstructionsOpen(!instructionsOpen)}
            className="!justify-between rounded-[14px] px-2 py-2 normal-case"
            endIcon={instructionsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            <Box className="flex items-center gap-2">
              <Typography variant="caption" fontWeight="bold">
                Instructions
              </Typography>
              <Typography variant="caption" color="text.disabled">
                ({recipe.instructions.length} steps)
              </Typography>
            </Box>
          </Button>
          {instructionsOpen && (
            <Box className="flex flex-col gap-3">
              {recipe.instructions.map((step, i) => (
                <Box key={i} className="flex gap-3">
                  <Typography variant="body1">{i + 1}.</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box className="flex flex-wrap flex-col gap-1">
          <Typography variant="caption" color="textSecondary">
            TAGS
          </Typography>
          <Box className="flex gap-1">
            {recipe.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>

        <Divider />

        <Box className="flex flex-col gap-4">
          <Typography variant="caption" color="textSecondary">
            QUICK ADJUST
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {recipe.adjustments.map((adjustment) => (
              <Chip
                key={adjustment}
                label={adjustment}
                variant="outlined"
                onClick={() => onAdjust(adjustment)}
              />
            ))}
          </Box>

          <Box className="flex w-full flex-col items-end gap-2">
            <Box>
              {saveError && (
                <Typography variant="caption" color="error">
                  {saveError}
                </Typography>
              )}
            </Box>

            <Box className="flex gap-2">
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveRecipe}
                disabled={isSaving || Boolean(savedRecipeId)}
                loading={isSaving}
                startIcon={<BookmarkBorderIcon />}
              >
                {isSaving ? "Saving..." : savedRecipeId ? "Saved" : "Save Recipe"}
              </Button>

              {savedRecipeId && (
                <Button variant="outlined" size="small" onClick={handleOpenRecipe}>
                  Open Recipe
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={showSaveSuccessSnackbar}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setShowSaveSuccessSnackbar(false);
        }}
        message="Recipe saved successfully!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

export default function RecipeChatView({ initialPrompt }: RecipeChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [assistantThinking, setAssistantThinking] = useState(false);
  const [input, setInput] = useState(initialPrompt);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasAutoSentInitialPromptRef = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [assistantThinking, messages]);

  useEffect(() => {
    const content = initialPrompt.trim();
    if (!content || hasAutoSentInitialPromptRef.current) return;

    const firstMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    hasAutoSentInitialPromptRef.current = true;
    setMessages([firstMessage]);
    setInput("");

    requestAssistantReply([firstMessage], setAssistantThinking, setMessages);
  }, [initialPrompt]);

  const handleSend = (text?: string) => {
    const content = text || input.trim();
    if (!content || assistantThinking) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const nextConversation = [...messages, userMessage];
    setMessages(nextConversation);
    setInput("");
    requestAssistantReply(nextConversation, setAssistantThinking, setMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAdjust = (adjustment: string) => {
    handleSend(adjustment);
  };
  const canSend = input.trim().length > 0 && !assistantThinking;

  return (
    <Box className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-100">
      <Box ref={scrollContainerRef} className="flex-1 overflow-y-auto py-6">
        <Box className="mx-auto flex w-full max-w-[860px] flex-col gap-3 px-3">
          {messages.map((message) =>
            message.role === "user" ? (
              <Box key={message.id} className="flex items-start justify-end gap-3">
                <Box
                  className="max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm"
                  sx={{ backgroundColor: "secondary.main" }}
                >
                  <Typography variant="body1" color="text.primaryLight">
                    {message.content}
                  </Typography>
                </Box>
                <Box className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                  <Typography variant="body1" color="text.secondary">
                    You
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box key={message.id} className="flex items-start gap-3">
                <Box className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-secondary-main shadow-md">
                  <AutoAwesomeIcon className="text-xl text-white" />
                </Box>
                <Box className="flex min-w-0 flex-1 flex-col gap-6">
                  <Box className="max-w-[75%] rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3.5">
                    <Typography variant="body1" color="text.primary">
                      {message.content}
                    </Typography>
                  </Box>
                  {message.recipe && <RecipeCard recipe={message.recipe} onAdjust={handleAdjust} />}
                </Box>
              </Box>
            )
          )}
          {assistantThinking && (
            <Box className="flex items-start gap-3">
              <Box className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-secondary-main shadow-md">
                <AutoAwesomeIcon className="text-xl text-white" />
              </Box>
              <Box className="max-w-[75%] rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
                <Box className="flex items-center gap-1.5">
                  <Box className="size-2 animate-pulse rounded-full bg-gray-400" />
                  <Box className="size-2 animate-pulse rounded-full bg-gray-400 [animation-delay:150ms]" />
                  <Box className="size-2 animate-pulse rounded-full bg-gray-400 [animation-delay:300ms]" />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box className="border-t border-gray-200 bg-white p-5 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
        <Box className="mx-auto max-w-4xl">
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Describe what you'd like to cook next..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleSend()}
                    disabled={!canSend}
                    color={canSend ? "primary" : "default"}
                  >
                    <SendIcon className="text-base" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="caption" color="textSecondary" className="mt-2 block text-center">
            {assistantThinking
              ? "AI is thinking..."
              : "Press Enter to send, Shift + Enter for new line"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
