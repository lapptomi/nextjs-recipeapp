"use client";

import { useCallback } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SendIcon from "@mui/icons-material/Send";
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
import Image from "next/image";

interface RecipeChatInitialViewProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onStartChat: (value: string) => void;
}

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

export default function RecipeChatInitialView({
  prompt,
  onPromptChange,
  onStartChat,
}: RecipeChatInitialViewProps) {
  const handleSubmit = useCallback(
    (event?: React.FormEvent) => {
      event?.preventDefault();
      onStartChat(prompt);
    },
    [onStartChat, prompt]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <Box className="flex-1 overflow-y-auto">
      <Container maxWidth="lg" className="py-10">
        <Box className="flex flex-col items-center gap-8">
          <Box className="flex items-center gap-6">
            <Box className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 via-secondary-main to-orange-700 shadow-lg shadow-secondary-main/40">
              <AutoAwesomeIcon className="text-[32px] text-white" />
            </Box>
            <Box className="text-left">
              <Typography variant="h3" className="mb-1 font-bold text-primary-main">
                What are you craving?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Describe your ideal meal and I&apos;ll create a personalized recipe for you.
              </Typography>
            </Box>
          </Box>

          <Box className="w-full max-w-2xl">
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                minRows={3}
                placeholder='E.g., "Quick pasta dinner for 2 with vegetables"'
                value={prompt}
                onChange={(event) => onPromptChange(event.target.value)}
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
                }}
                className="[&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiOutlinedInput-root]:bg-backgroundWhite [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-secondary-main"
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

          <Box className="flex w-full max-w-5xl flex-col gap-6">
            <Box className="flex items-center justify-center gap-4">
              <Box className="h-px flex-1 bg-gray-200" />
              <Typography variant="overline" className="tracking-widest" color="text.secondary">
                Quick Start
              </Typography>
              <Box className="h-px flex-1 bg-gray-200" />
            </Box>

            <Box className="flex flex-wrap justify-center gap-4">
              {QUICK_START_CARDS.map(({ id, label, image, alt }) => (
                <Button
                  key={id}
                  className="group h-[150px] w-[220px] shrink-0 overflow-hidden rounded-xl p-0 text-left normal-case shadow-md transition-shadow hover:bg-transparent hover:shadow-lg"
                  onClick={() => onStartChat(label)}
                >
                  <Box className="relative h-full w-full">
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <Box className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.99),transparent_60%)]" />

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

            <Box className="flex flex-wrap justify-center gap-2">
              {FILTER_CHIPS.map(({ id, label, icon: Icon }) => (
                <Chip
                  key={id}
                  icon={<Icon className="text-[18px]" />}
                  label={label}
                  variant="outlined"
                  className="rounded-full border-gray-200 bg-gray-50 transition-colors hover:border-secondary-main hover:bg-secondary-main/5"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
