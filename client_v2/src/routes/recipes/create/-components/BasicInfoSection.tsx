import { Box, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { type NewRecipe } from "../../../../types/recipe";
import { fieldSlotProps } from "./styles";
import { SectionCard } from "./SectionCard";

export function BasicInfoSection() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<NewRecipe>();

  return (
    <SectionCard title="Basic Information">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
            Recipe Title *
          </Typography>
          <TextField
            {...register("title")}
            fullWidth
            placeholder="e.g., Grandma's Secret Chocolate Chip Cookies"
            error={!!errors.title}
            helperText={errors.title?.message}
            slotProps={fieldSlotProps}
          />
        </Box>
        <Box>
          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
            Description
          </Typography>
          <TextField
            {...register("description")}
            fullWidth
            multiline
            rows={3}
            placeholder="Brief description of your recipe... What makes it special?"
            slotProps={fieldSlotProps}
          />
          <Typography variant="caption" color="text.secondary">
            {watch("description")?.length ?? 0}/500 characters
          </Typography>
        </Box>
      </Box>
    </SectionCard>
  );
}
