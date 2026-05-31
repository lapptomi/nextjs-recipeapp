import { Box, Card, CardContent, Skeleton, styled } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

const StyledCard = styled(Card)({
  overflow: "hidden",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
});

interface Props {
  width?: number | string;
  imageHeight?: number;
  sx?: SxProps<Theme>;
}

export default function RecipeCardSkeleton({ width, imageHeight = 250, sx }: Props) {
  return (
    <Box sx={{ width, ...sx }}>
      <StyledCard>
        <Skeleton variant="rectangular" height={imageHeight} />
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2.5 }}>
          <Skeleton variant="text" width="70%" height={28} />
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="60%" height={20} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
}
