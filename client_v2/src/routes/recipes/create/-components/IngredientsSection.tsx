import { Box, Button, IconButton, TextField, Typography, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useFormContext, useFieldArray } from "react-hook-form";
import { type NewRecipe } from "../../../../types/recipe";
import { fieldSlotProps } from "./styles";
import { SectionCard } from "./SectionCard";

const StepNumber = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
  borderRadius: Number(theme.shape.borderRadius),
  backgroundColor: theme.palette.grey[100],
  flexShrink: 0,
}));

export function IngredientsSection() {
  const {
    register,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useFormContext<NewRecipe>();
  const { fields, append, remove } = useFieldArray({ name: "ingredients" });

  function handleAdd() {
    const ingredients = watch("ingredients");
    const last = ingredients[ingredients.length - 1];
    if (!last?.ingredient?.trim()) {
      setError(`ingredients.${ingredients.length - 1}.ingredient`, {
        type: "manual",
        message: "Ingredient cannot be empty",
      });
      return;
    }
    if (!last?.amount?.trim()) {
      setError(`ingredients.${ingredients.length - 1}.amount`, {
        type: "manual",
        message: "Amount cannot be empty",
      });
      return;
    }
    clearErrors(`ingredients.${ingredients.length - 1}`);
    append({ ingredient: "", amount: "" });
  }

  return (
    <SectionCard
      title="Ingredients"
      trailing={
        <Typography variant="caption" color="text.secondary">
          {fields.length} item{fields.length !== 1 ? "s" : ""}
        </Typography>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {fields.map((_, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <StepNumber>
              <Typography variant="caption">{index + 1}</Typography>
            </StepNumber>
            <TextField
              {...register(`ingredients.${index}.amount`)}
              error={!!errors.ingredients?.[index]?.amount}
              size="small"
              placeholder="Amount"
              sx={{ width: 100 }}
              slotProps={fieldSlotProps}
            />
            <TextField
              {...register(`ingredients.${index}.ingredient`)}
              error={!!errors.ingredients?.[index]?.ingredient}
              size="small"
              placeholder="Ingredient name"
              sx={{ flex: 1 }}
              slotProps={fieldSlotProps}
            />
            <IconButton
              size="small"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          color="secondary"
          onClick={handleAdd}
          sx={{ alignSelf: "flex-start" }}
        >
          Add Ingredient
        </Button>
      </Box>
    </SectionCard>
  );
}
