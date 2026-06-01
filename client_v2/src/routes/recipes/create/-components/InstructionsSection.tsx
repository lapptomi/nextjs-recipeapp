import { Box, Button, IconButton, TextField, Typography, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useFormContext, useFieldArray } from "react-hook-form";
import { type NewRecipe } from "../../../../types/recipe";
import { fieldSlotProps } from "./styles";
import { SectionCard } from "./SectionCard";

const StepCircle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: theme.palette.warning.light,
  flexShrink: 0,
  marginTop: theme.spacing(0.5),
}));

export function InstructionsSection() {
  const {
    register,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useFormContext<NewRecipe>();
  const { fields, append, remove } = useFieldArray({ name: "instructions" });

  function handleAdd() {
    const instructions = watch("instructions");
    const last = instructions[instructions.length - 1];
    if (!last?.instruction?.trim()) {
      setError(`instructions.${instructions.length - 1}.instruction`, {
        type: "manual",
        message: "Instruction cannot be empty",
      });
      return;
    }
    clearErrors(`instructions.${instructions.length - 1}.instruction`);
    append({ instruction: "", step: instructions.length + 1 });
  }

  return (
    <SectionCard
      title="Instructions"
      trailing={
        <Typography variant="caption" color="text.secondary">
          {fields.length} step{fields.length !== 1 ? "s" : ""}
        </Typography>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {fields.map((_, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
          >
            <StepCircle>
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {index + 1}
              </Typography>
            </StepCircle>
            <TextField
              {...register(`instructions.${index}.instruction`)}
              error={!!errors.instructions?.[index]?.instruction}
              helperText={errors.instructions?.[index]?.instruction?.message}
              fullWidth
              multiline
              rows={2}
              placeholder={`Step ${index + 1}: Describe this step in detail...`}
              slotProps={fieldSlotProps}
            />
            <IconButton
              size="small"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              sx={{ mt: 0.5 }}
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
          Add Step
        </Button>
      </Box>
    </SectionCard>
  );
}
