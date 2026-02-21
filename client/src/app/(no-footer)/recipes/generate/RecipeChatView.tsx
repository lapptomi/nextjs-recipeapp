"use client";

import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";

// ─── Types ──────────────────────────────────────────────
interface GeneratedRecipe {
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  adjustments: string[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recipe?: GeneratedRecipe;
}

interface RecipeChatViewProps {
  initialPrompt: string;
}

// ─── Mock data ──────────────────────────────────────────
const MOCK_RECIPE: GeneratedRecipe = {
  title: "Mediterranean Grilled Chicken",
  description:
    "Juicy grilled chicken with Mediterranean herbs, served with quinoa and roasted vegetables.",
  cookingTime: 30,
  servings: 4,
  difficulty: "Easy",
  ingredients: [
    "4 boneless chicken breasts",
    "2 tbsp olive oil",
    "2 tsp dried oregano",
    "1 tsp garlic powder",
    "1 cup quinoa",
    "2 cups vegetable broth",
    "1 zucchini, diced",
    "1 red bell pepper, diced",
    "1 cup cherry tomatoes",
    "Fresh parsley",
    "Lemon juice",
    "Salt and pepper",
  ],
  instructions: [
    "Season chicken breasts with oregano, garlic powder, salt, and pepper",
    "Grill chicken on medium-high heat for 6-7 minutes per side",
    "Cook quinoa in vegetable broth according to package directions",
    "Sauté zucchini and bell pepper in olive oil until tender",
    "Halve cherry tomatoes and add to vegetables",
    "Slice grilled chicken and serve over quinoa",
    "Top with fresh parsley and a squeeze of lemon",
    "Drizzle with extra olive oil and serve warm",
  ],
  tags: ["Healthy", "Mediterranean", "High-Protein", "Gluten-Free"],
  adjustments: ["Make vegetarian", "Faster version", "Double servings"],
};

// ─── RecipeCard sub-component ───────────────────────────
function RecipeCard({
  recipe,
  onAdjust,
}: {
  recipe: GeneratedRecipe;
  onAdjust: (adjustment: string) => void;
}) {
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  return (
    <Box
      className="w-full overflow-hidden rounded-2xl border-2 border-gray-200 bg-white"
      sx={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      {/* Image section */}
      <Box className="relative h-56 w-full">
        <Image src="/r3.jpg" alt={recipe.title} fill className="object-cover" />
        {/* Gradient overlay */}
        <Box
          className="pointer-events-none absolute inset-0"
          sx={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2) 50%, transparent)",
          }}
        />
        {/* Info chips on image */}
        <Box className="absolute bottom-4 left-4 flex gap-3">
          <Chip
            icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
            label={
              <Box className="flex items-center gap-1">
                <Typography variant="body2" className="font-bold">
                  {recipe.cookingTime}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  min
                </Typography>
              </Box>
            }
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.95)",
              borderRadius: "9999px",
              boxShadow: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
              height: 36,
              px: 1,
              "& .MuiChip-icon": { color: "primary.main" },
            }}
          />
          <Chip
            icon={<PeopleOutlineIcon sx={{ fontSize: 16 }} />}
            label={
              <Box className="flex items-center gap-1">
                <Typography variant="body2" className="font-bold">
                  {recipe.servings}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  servings
                </Typography>
              </Box>
            }
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.95)",
              borderRadius: "9999px",
              boxShadow: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
              height: 36,
              px: 1,
              "& .MuiChip-icon": { color: "primary.main" },
            }}
          />
          <Chip
            icon={<WhatshotIcon sx={{ fontSize: 16 }} />}
            label={
              <Typography variant="body2" className="font-bold">
                {recipe.difficulty}
              </Typography>
            }
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.95)",
              borderRadius: "9999px",
              boxShadow: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
              height: 36,
              px: 1,
              "& .MuiChip-icon": { color: "primary.main" },
            }}
          />
        </Box>
      </Box>

      {/* Title + description */}
      <Box className="flex gap-4 px-6 pt-5">
        <Box
          className="flex size-12 shrink-0 items-center justify-center rounded-xl"
          sx={{
            background: "linear-gradient(135deg, #ffb900 0%, #ff6900 100%)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <AutoAwesomeIcon sx={{ color: "white", fontSize: 24 }} />
        </Box>
        <Box className="flex flex-col gap-1 pt-1">
          <Typography variant="h6" className="font-bold">
            {recipe.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recipe.description}
          </Typography>
        </Box>
      </Box>

      {/* Divider */}
      <Box className="mx-0 my-5 h-px bg-gray-200" />

      {/* Ingredients */}
      <Box className="flex flex-col gap-3 px-6">
        <Box className="flex items-center gap-2">
          <Typography variant="body2" className="font-bold">
            Ingredients
          </Typography>
          <Typography variant="caption" color="text.disabled">
            ({recipe.ingredients.length})
          </Typography>
        </Box>
        <Box className="grid grid-cols-2 gap-x-6 gap-y-2">
          {recipe.ingredients.map((item, i) => (
            <Box key={i} className="flex items-start gap-4">
              <Box className="mt-2 size-1.5 shrink-0 rounded-full" sx={{ bgcolor: "#ff6900" }} />
              <Typography variant="body2" color="text.secondary">
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Instructions - collapsible */}
      <Box className="mx-2 mt-5 rounded-lg bg-gray-50">
        <Button
          fullWidth
          onClick={() => setInstructionsOpen(!instructionsOpen)}
          className="normal-case"
          sx={{
            justifyContent: "space-between",
            px: 2,
            py: 2,
            borderRadius: "14px",
            color: "text.primary",
            "&:hover": { bgcolor: "grey.200" },
          }}
          endIcon={instructionsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          <Box className="flex items-center gap-2">
            <Typography variant="body2" className="font-bold">
              Instructions
            </Typography>
            <Typography variant="caption" color="text.disabled">
              ({recipe.instructions.length} steps)
            </Typography>
          </Box>
        </Button>
        {instructionsOpen && (
          <Box className="flex flex-col gap-3 px-4 pb-4 pt-2">
            {recipe.instructions.map((step, i) => (
              <Box key={i} className="flex gap-3">
                <Typography
                  variant="body2"
                  className="flex size-6 shrink-0 items-center justify-center rounded-full font-bold text-white"
                  sx={{ bgcolor: "primary.main", fontSize: 12 }}
                >
                  {i + 1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Tags */}
      <Box className="flex flex-wrap gap-2 px-6 pb-4 pt-2">
        {recipe.tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              bgcolor: "#f5f5f5",
              color: "text.secondary",
              fontWeight: 500,
              fontSize: 12,
            }}
          />
        ))}
      </Box>

      {/* Adjust recipe section */}
      <Box className="border-t border-gray-200 px-6 pb-5 pt-4">
        <Typography
          variant="caption"
          color="text.disabled"
          className="mb-3 block tracking-widest"
          sx={{ textTransform: "uppercase", letterSpacing: "0.6px" }}
        >
          Adjust Recipe
        </Typography>
        <Box className="flex flex-wrap gap-2">
          {recipe.adjustments.map((adjustment) => (
            <Button
              key={adjustment}
              variant="outlined"
              size="small"
              className="normal-case"
              onClick={() => onAdjust(adjustment)}
              sx={{
                borderRadius: "9999px",
                borderColor: "#e5e5e5",
                color: "text.secondary",
                fontWeight: 500,
                px: 2,
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "rgba(237, 108, 2, 0.04)",
                },
              }}
            >
              {adjustment}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main RecipeChatView ────────────────────────────────
export default function RecipeChatView({ initialPrompt }: RecipeChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "1",
      role: "user",
      content: initialPrompt,
    },
    {
      id: "2",
      role: "assistant",
      content:
        "I've created the perfect recipe for you! This easy dish takes about 30 minutes and serves 4. Let me know if you'd like any adjustments!",
      recipe: MOCK_RECIPE,
    },
  ]);
  const [input, setInput] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = useCallback(
    (text?: string) => {
      const content = text || input.trim();
      if (!content) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      // TODO: Wire up to AI recipe generation API
      // For now, mock response after a short delay
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Great choice! I've updated the recipe based on your preferences. Here's the revised version:",
          recipe: MOCK_RECIPE,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }, 1000);
    },
    [input]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleAdjust = useCallback(
    (adjustment: string) => {
      handleSend(adjustment);
    },
    [handleSend]
  );

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "#f5f5f5",
      }}
    >
      {/* Messages — the only scrollable region */}
      <Box ref={scrollContainerRef} sx={{ flex: 1, overflowY: "auto", py: 6 }}>
        <Box
          sx={{
            maxWidth: "860px",
            width: "100%",
            mx: "auto",
            px: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {messages.map((message) =>
            message.role === "user" ? (
              <UserMessage key={message.id} content={message.content} />
            ) : (
              <AssistantMessage
                key={message.id}
                content={message.content}
                recipe={message.recipe}
                onAdjust={handleAdjust}
              />
            )
          )}
        </Box>
      </Box>

      {/* Input bar — anchored at the bottom */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "grey.200",
          bgcolor: "white",
          px: 3,
          py: 2,
          boxShadow: "0 -1px 3px rgba(0,0,0,0.1)",
        }}
      >
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
                    color={input.trim() ? "primary" : "default"}
                    disabled={!input.trim()}
                    sx={{
                      bgcolor: input.trim() ? "primary.main" : "#e5e5e5",
                      color: input.trim() ? "white" : "text.disabled",
                      opacity: input.trim() ? 1 : 0.5,
                      borderRadius: "14px",
                      "&:hover": {
                        bgcolor: input.trim() ? "primary.dark" : "#e5e5e5",
                      },
                    }}
                  >
                    <SendIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: "16px",
                borderWidth: 2,
                backgroundColor: "transparent",
                "& fieldset": { borderColor: "#d4d4d4", borderWidth: 2 },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#a3a3a3" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <Typography variant="caption" color="text.disabled" className="mt-2 block text-center">
            Press Enter to send, Shift + Enter for new line
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── UserMessage ────────────────────────────────────────
function UserMessage({ content }: { content: string }) {
  return (
    <Box className="flex items-start justify-end gap-3">
      <Box
        className="max-w-[75%] rounded-2xl px-5 py-3.5"
        sx={{
          bgcolor: "#171717",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="body2" sx={{ color: "white" }}>
          {content}
        </Typography>
      </Box>
      <Box
        className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-200"
        sx={{ bgcolor: "#f5f5f5" }}
      >
        <Typography variant="body2" className="font-semibold" color="text.secondary">
          You
        </Typography>
      </Box>
    </Box>
  );
}

// ─── AssistantMessage ───────────────────────────────────
function AssistantMessage({
  content,
  recipe,
  onAdjust,
}: {
  content: string;
  recipe?: GeneratedRecipe;
  onAdjust: (adjustment: string) => void;
}) {
  return (
    <Box className="flex items-start gap-3">
      <Box
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        sx={{
          background: "linear-gradient(135deg, #ffb900 0%, #ff6900 100%)",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <AutoAwesomeIcon sx={{ color: "white", fontSize: 20 }} />
      </Box>
      <Box className="flex min-w-0 flex-1 flex-col gap-6">
        <Box
          className="max-w-[75%] rounded-2xl border border-gray-200 px-5 py-3.5"
          sx={{ bgcolor: "#fafafa" }}
        >
          <Typography variant="body2" color="text.primary">
            {content}
          </Typography>
        </Box>
        {recipe && <RecipeCard recipe={recipe} onAdjust={onAdjust} />}
      </Box>
    </Box>
  );
}
