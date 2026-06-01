import {
  Box,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useFormContext } from "react-hook-form";
import { type NewRecipe } from "../../../../types/recipe";
import { fieldSlotProps, inputSx } from "./styles";
import { SectionCard } from "./SectionCard";

export function RecipeDetailsSection() {
  const { register } = useFormContext<NewRecipe>();

  return (
    <SectionCard title="Recipe Details">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Cooking Time (minutes)
            </Typography>
          </Box>
          <TextField
            fullWidth
            type="number"
            placeholder="30"
            {...register("cookingTime", { valueAsNumber: true })}
            slotProps={fieldSlotProps}
          />
        </Box>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <RestaurantMenuIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Servings
            </Typography>
          </Box>
          <TextField
            fullWidth
            type="number"
            placeholder="4"
            {...register("servings", { valueAsNumber: true })}
            slotProps={fieldSlotProps}
          />
        </Box>
        <Box>
          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
            Category
          </Typography>
          <Select
            {...register("category")}
            fullWidth
            displayEmpty
            input={<OutlinedInput sx={inputSx} />}
          >
            <MenuItem value="" disabled>
              Select category
            </MenuItem>
            <MenuItem value="breakfast">Breakfast</MenuItem>
            <MenuItem value="lunch">Lunch</MenuItem>
            <MenuItem value="dinner">Dinner</MenuItem>
            <MenuItem value="dessert">Dessert</MenuItem>
            <MenuItem value="snack">Snack</MenuItem>
          </Select>
        </Box>
      </Box>
    </SectionCard>
  );
}
