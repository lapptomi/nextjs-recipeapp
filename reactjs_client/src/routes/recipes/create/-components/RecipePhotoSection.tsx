import { Box, Button, IconButton, Typography, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useFormContext } from "react-hook-form";
import { type NewRecipe } from "../../../../types/recipe";
import { SectionCard } from "./SectionCard";

const UploadArea = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: "2px dashed",
  borderColor: theme.palette.grey[300],
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(6),
}));

const PreviewBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export function RecipePhotoSection() {
  const { register, setValue, clearErrors, watch } =
    useFormContext<NewRecipe>();
  const selectedImage = watch("image");

  return (
    <SectionCard title="Recipe Photo">
      <UploadArea>
        {selectedImage instanceof File ? (
          <PreviewBox>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {selectedImage.name}
            </Typography>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Recipe preview"
              style={{
                width: 300,
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => {
                  setValue("image", null);
                  clearErrors("image");
                }}
              >
                <CloseIcon color="error" fontSize="small" />
              </IconButton>
              <Typography variant="body2" color="error">
                Remove image
              </Typography>
            </Box>
          </PreviewBox>
        ) : (
          <>
            <CloudUploadOutlinedIcon
              sx={{ fontSize: 48, color: "grey.500", mb: 1 }}
            />
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              Click to upload recipe photo
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              PNG, JPG or WEBP (max. 1MB)
            </Typography>
            <Button
              component="label"
              variant="text"
              color="primary"
              sx={{ mt: 1 }}
            >
              Choose File
              <input
                {...register("image")}
                type="file"
                hidden
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setValue("image", e.target.files?.[0] ?? null)}
              />
            </Button>
          </>
        )}
      </UploadArea>
    </SectionCard>
  );
}
