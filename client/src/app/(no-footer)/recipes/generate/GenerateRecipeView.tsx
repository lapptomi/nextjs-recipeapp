"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Image from "next/image";
import { useState, useCallback } from "react";

const QUICK_START_CARDS = [
  {
    id: "quick-weeknight",
    label: "Quick weeknight dinner under 30 minutes",
    image: "/r3.jpg",
    alt: "Cooked green vegetables in pan",
  },
  {
    id: "healthy-chicken",
    label: "Healthy meal with chicken",
    image: "/r2.jpg",
    alt: "Cooking ingredients with herbs and spices",
  },
  {
    id: "comfort-food",
    label: "Comfort food for a cozy evening",
    image: "/r1.jpg",
    alt: "Pasta in white bowl",
  },
  {
    id: "impressive-guests",
    label: "Impressive dish for guests",
    image: "/r4.jpg",
    alt: "Elegant dinner table setting",
  },
];

const FILTER_CHIPS = [
  { id: "time", label: "Time-based", icon: AccessTimeIcon },
  { id: "servings", label: "Serving sizes", icon: PeopleOutlineIcon },
  { id: "diet", label: "Diet preferences", icon: RestaurantIcon },
];

interface GenerateRecipeViewProps {
  onStartChat: (prompt: string) => void;
}

export default function GenerateRecipeView({ onStartChat }: GenerateRecipeViewProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (prompt.trim()) onStartChat(prompt.trim());
    },
    [prompt, onStartChat]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <Box className="flex-1 overflow-y-auto">
      <Container maxWidth="lg" className="py-10">
        <Box className="flex flex-col items-center gap-8">
          {/* Accent icon + Heading - horizontal layout */}
          <Box className="flex items-center gap-6">
            <Box
              className="flex size-16 items-center justify-center rounded-xl"
              sx={{
                background: "linear-gradient(135deg, #ff9f4d 0%, #ed6c02 50%, #e65100 100%)",
                boxShadow: "0 8px 24px rgba(237, 108, 2, 0.35)",
              }}
            >
              <AutoAwesomeIcon sx={{ color: "white", fontSize: 32 }} />
            </Box>
            <Box className="text-left">
              <Typography variant="h3" className="mb-1 font-bold" sx={{ color: "text.primary" }}>
                What are you craving?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Describe your ideal meal and I&apos;ll create a personalized recipe for you.
              </Typography>
            </Box>
          </Box>

          {/* Prompt input */}
          <Box className="w-full max-w-2xl">
            <form onSubmit={handleSubmit}>
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        color={prompt.trim() ? "primary" : "default"}
                        disabled={!prompt.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "#d4d4d4",
                      "&:hover": {
                        borderColor: "#a3a3a3",
                      },
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#a3a3a3",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                className="mt-2 block text-center"
              >
                Press Enter to send or choose a starter below
              </Typography>
            </form>
          </Box>

          {/* Quick Start section */}
          <Box className="flex w-full max-w-5xl flex-col gap-6">
            {/* Section title with dividers */}
            <Box className="flex items-center justify-center gap-4">
              <Box className="h-px flex-1 bg-gray-200" />
              <Typography variant="overline" className="tracking-widest" color="text.secondary">
                Quick Start
              </Typography>
              <Box className="h-px flex-1 bg-gray-200" />
            </Box>

            {/* Recipe cards - fixed size 220×165 (4:3) */}
            <Box className="flex flex-wrap justify-center gap-4">
              {QUICK_START_CARDS.map(({ id, label, image, alt }) => (
                <Button
                  key={id}
                  className="group h-[165px] w-[220px] shrink-0 overflow-hidden rounded-xl p-0 text-left normal-case"
                  onClick={() => onStartChat(label)}
                  sx={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)",
                    "&:hover": {
                      bgcolor: "transparent",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box className="relative h-full w-full">
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    {/* Static gradient overlay - bottom black to transparent */}
                    <Box
                      className="pointer-events-none absolute inset-0"
                      sx={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.99), transparent 60%)",
                      }}
                    />
                    {/* AI Chef icon - top right, black square with white border */}
                    <Box
                      className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg border-2 border-white"
                      sx={{ bgcolor: "rgba(0,0,0,0.6)" }}
                    >
                      <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: 16 }} />
                    </Box>
                    {/* Label - bottom left */}
                    <Typography
                      variant="body2"
                      className="absolute bottom-3 left-3 right-3 font-medium text-white"
                    >
                      {label}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>

            {/* Filter chips */}
            <Box className="flex flex-wrap justify-center gap-2">
              {FILTER_CHIPS.map(({ id, label, icon: Icon }) => (
                <Chip
                  key={id}
                  icon={<Icon sx={{ fontSize: 18 }} />}
                  label={label}
                  variant="outlined"
                  className="rounded-full border-gray-200 bg-gray-50"
                  sx={{
                    "&:hover": { borderColor: "primary.main", bgcolor: "rgba(237, 108, 2, 0.04)" },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
